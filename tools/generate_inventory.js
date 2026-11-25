const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = path.resolve(__dirname, '..');
const appRoot = 'C:/Users/livia/AndroidStudioProjects/MindUApp';
const ctx = { window: { MINDU_ROUTE_GROUPS: [] } };
for (const file of fs.readdirSync(path.join(root, 'data/routes')).filter(f => f.endsWith('.js'))) vm.runInNewContext(fs.readFileSync(path.join(root, 'data/routes', file), 'utf8'), ctx);
const routes = ctx.window.MINDU_ROUTE_GROUPS.flatMap(g => g.rotas.map(r => ({ ...r, group: g.nome })));
let api = '';
try { api = fs.readFileSync(path.join(appRoot, 'app/src/main/java/com/example/mindu/api/ApiService.java'), 'utf8'); } catch {}
const declarations = [...api.matchAll(/@(GET|POST|PUT|PATCH|DELETE)\s*\(\s*"([^"]+)"\s*\)\s*\n\s*[\s\S]*?\b(\w+)\s*\(/g)];
const declared = new Map(declarations.map(m => [`${m[1].toLowerCase()} /${m[2]}`.replace(/\{([^}]+)\}/g, '{$1}'), m[3]]));
const sourceRoot = path.join(appRoot, 'app/src/main/java');
let sourceFiles = [];
function walk(dir) { try { for (const e of fs.readdirSync(dir, { withFileTypes: true })) { const p = path.join(dir, e.name); if (e.isDirectory()) walk(p); else if (e.name.endsWith('.java') && !p.endsWith('ApiService.java')) sourceFiles.push(p); } } catch {} }
walk(sourceRoot);
const postman = JSON.parse(fs.readFileSync(path.join(root, 'docs/mindu-postman-collection.json'), 'utf8'));
const postmanRoutes = new Set();
function collect(items) { for (const i of items || []) { if (i.request) { const m = i.request.method?.toLowerCase(); const raw = i.request.url?.raw || ''; const p = raw.replace(/^\{\{baseUrl\}\}/, '').replace(/\{\{([^}]+)\}\}/g, '{$1}').split('?')[0]; if (m && p.startsWith('/v1/')) postmanRoutes.add(`${m} ${p}`); } collect(i.item); } }
collect(postman.item);
const rows = routes.map(r => {
  const key = `${r.m} ${r.path}`;
  const method = declared.get(`${r.m} ${r.path}`);
  const actualCall = method && sourceFiles.some(f => new RegExp(`\\b${method}\\s*\\(`).test(fs.readFileSync(f, 'utf8')));
  const android = method ? (actualCall ? 'Sim (callsite)' : 'Interface Retrofit; callsite não localizado') : 'Não';
  return { ...r, reqBody: safe(r.reqBody), resBody: safe(r.resBody), android, postman: postmanRoutes.has(key) ? 'Sim' : 'Não' };
});
const esc = s => String(s ?? '—').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
function safe(value, key = '') {
  if (/senha|token|api.?key|secret/i.test(key)) return '<placeholder>';
  if (Array.isArray(value)) return value.map(v => safe(v));
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k,v]) => [k, safe(v,k)]));
  return value;
}
const request = r => typeof r.reqBody === 'string' ? r.reqBody : r.reqBody ? JSON.stringify(r.reqBody) : 'Sem corpo; consulte query/rota';
const profile = r => r.auth || 'Público';
const errorsFor = r => {
  const out = ['400 entrada/parâmetros inválidos'];
  if (r.auth && r.auth !== 'Público') out.push('401 JWT', '403 perfil/escopo');
  if (/\{id\}|\/me(?:\/|$)/.test(r.path)) out.push('404 recurso/conta ausente');
  if (r.m === 'post' && !r.path.includes('/chat')) out.push('409 conflito/duplicidade');
  if (r.isForm || (typeof r.reqBody === 'string' && r.reqBody.startsWith('multipart/form-data'))) out.push('413 arquivo excede limite');
  if (r.path.startsWith('/v1/auth/login') || r.path.startsWith('/v1/auth/esqueci-senha') || r.path.startsWith('/v1/auth/redefinir-senha')) out.push('429 limite (Retry-After)');
  if (r.path.startsWith('/v1/chat')) out.push('502/503 integração Mila; upstream Mila pode responder 422');
  return out.join('; ');
};
function curl(r) {
  let route = r.path.replace(/\{([^}]+)\}/g, '<$1>');
  const query = (r.desc || '').match(/\?([A-Za-z]+)=([A-Za-z0-9_{}.-]+)/);
  if (query) route += `?${query[1]}=${query[2].replace(/[{}]/g, '')}`;
  const auth = r.auth && r.auth !== 'Público' ? ` -H 'Authorization: Bearer TOKEN_JWT'` : '';
  if (r.isForm || (typeof r.reqBody === 'string' && r.reqBody.startsWith('multipart/form-data'))) {
    const parts = r.reqBody && typeof r.reqBody === 'object' ? Object.keys(r.reqBody).map(k => `-F '${k}=${/file|foto|carteirinha/i.test(k) ? '@arquivo-de-teste' : 'VALOR_DE_TESTE'}'`).join(' ') : `-F 'fotoCarteirinha=@carteirinha.png'`;
    return `curl -i -X ${r.m.toUpperCase()} 'http://localhost:8080${route}'${auth} ${parts}`;
  }
  const body = r.reqBody && typeof r.reqBody === 'object' ? ` -H 'Content-Type: application/json' --data '${JSON.stringify(r.reqBody)}'` : '';
  return `curl -i -X ${r.m.toUpperCase()} 'http://localhost:8080${route}'${auth}${body}`;
}
const tableRows = rows.map(r => `<tr><td><span class="method method-${esc(r.m)}">${esc(r.m.toUpperCase())}</span></td><td><code>${esc(r.path)}</code></td><td>${esc(profile(r))}</td><td>${esc(request(r))}<br><small>${esc(r.desc || '')}</small></td><td>${esc(JSON.stringify(r.resBody ?? 'ResponseEntity/DTO; ver guia detalhado'))}</td><td>${esc(errorsFor(r))}</td><td>Sim</td><td>${r.postman}</td><td>${esc(r.android)}</td><td><code>${esc(curl(r))}</code></td></tr>`).join('\n');
const available = rows.filter(r => r.android === 'Não');
const html = `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Auditoria técnica de rotas · MindU</title><link rel="stylesheet" href="../style.css"><body><main class="inventory"><a href="api-inventario.html">← Acompanhamento da equipe</a><h1>Auditoria técnica de rotas</h1><p>Fonte: mappings dos controllers Spring. O request e response abaixo resumem exemplos do catálogo; obrigatoriedade, enums e limites estão no guia e nos DTOs. “Android” distingue chamada encontrada no código do app de declaração em ApiService.</p><h2>Disponíveis, ainda não integradas no app</h2><p>${available.length ? available.map(r => `<code>${esc(r.m.toUpperCase())} ${esc(r.path)}</code>`).join('<br>') : 'Nenhuma rota ausente.'}</p><p>As fotos de Cliente, Empresa e Admin são locais em filesDir, pelo id de usuário; não há rota de foto para esses perfis. Profissional mantém foto pela API.</p><h2>Mappings da API (${rows.length})</h2><div style="overflow:auto"><table><thead><tr><th>Método</th><th>Rota</th><th>Autorização</th><th>Request (exemplo)</th><th>Response (exemplo)</th><th>Erros possíveis</th><th>Catálogo</th><th>Postman</th><th>Android</th></tr></thead><tbody>${tableRows}</tbody></table></div><p>Consulte <a href="../tutorial.html">Como usar a API</a> para regras e limites. A coleção inclui requests para todas as rotas.</p></main></body></html>`;
const styledHtml = html.replace('<link rel="stylesheet" href="../style.css"><body>', '<link rel="stylesheet" href="../style.css"><style>.inventory{max-width:1500px;margin:24px auto;padding:0 22px}.inventory table{width:100%;border-collapse:collapse;background:var(--panel)}.inventory th,.inventory td{padding:9px;border:1px solid var(--line);text-align:left;vertical-align:top;font-size:.82rem}.inventory th{position:sticky;top:0;background:var(--panel);z-index:1}.inventory code{overflow-wrap:anywhere}.method{display:inline-block;min-width:52px;padding:3px 7px;border-radius:5px;color:white;text-align:center;font:600 .72rem monospace}.method-get{background:var(--get)}.method-post{background:var(--post)}.method-put{background:var(--put)}.method-patch{background:var(--patch)}.method-delete{background:var(--delete)}</style><body>').replace('<th>Android</th>', '<th>Android</th><th>curl</th>');
fs.writeFileSync(path.join(root, 'docs/api-referencia-rotas.html'), styledHtml);
const errors = '400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422.';
const md = [`# Inventário de rotas MindU`, ``, `Fonte: controllers Spring. ${rows.length} mappings.`, ``, `## Disponíveis, ainda não integradas no app`, ``, ...(available.length ? available.map(r => `- \`${r.m.toUpperCase()} ${r.path}\``) : ['- Nenhuma.']), ``, `Fotos de Cliente, Empresa e Admin ficam localmente em filesDir, por id de usuário; não há rota de foto. Profissional usa API.`, ``, `| Método | Rota | Autorização | Request | Response | Erros possíveis | docs | Postman | Android |`, `|---|---|---|---|---|---|---|---|---|`, ...rows.map(r => `| ${r.m.toUpperCase()} | \`${r.path}\` | ${profile(r)} | ${request(r).replace(/\|/g,'\\|')}; ${r.desc || ''} | ${JSON.stringify(r.resBody ?? 'DTO/ResponseEntity').replace(/\|/g,'\\|')} | ${errors} | Sim | ${r.postman} | ${r.android} |`), ``, `Campos obrigatórios, enums e limites estão resumidos no guia e nos DTOs do backend.`, ``, `## Exemplos curl por rota`, ``, ...rows.map(r => `- **${r.m.toUpperCase()} ${r.path}**\n  \`${curl(r)}\``)].join('\n');
fs.writeFileSync(path.join(root, 'docs/api-referencia-rotas.md'), md + `\n\n## Exemplos curl por rota\n\n` + rows.map(r => `- **${r.m.toUpperCase()} ${r.path}**\n  \`${curl(r)}\``).join('\n'));
console.log(`Inventário criado: ${rows.length} mappings; ${available.length} sem interface Retrofit.`);
