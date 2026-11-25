const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = path.resolve(__dirname, '..');
const collectionPath = path.join(root, 'docs', 'mindu-postman-collection.json');
const collection = JSON.parse(fs.readFileSync(collectionPath, 'utf8'));
const context = { window: { MINDU_ROUTE_GROUPS: [] } };
for (const file of fs.readdirSync(path.join(root, 'data', 'routes')).filter(f => f.endsWith('.js'))) {
  vm.runInNewContext(fs.readFileSync(path.join(root, 'data', 'routes', file), 'utf8'), context);
}
const routes = context.window.MINDU_ROUTE_GROUPS.flatMap(g => g.rotas.map(r => ({ ...r, group: g.nome })));
function sanitize(value, key = '') {
  if (/senha|token|api.?key|secret/i.test(key)) return `{{${key.toLowerCase().includes('senha') ? 'senhaTeste' : 'token'}}}`;
  if (Array.isArray(value)) return value.map(v => sanitize(v));
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k,v]) => [k, sanitize(v,k)]));
  return value;
}
const variables = new Map((collection.variable || []).map(v => [v.key, v]));
for (const key of ['id', 'clienteId', 'empresaId', 'profissionalId', 'planoId', 'senhaTeste', 'emailTeste', 'resetToken']) {
  if (!variables.has(key)) collection.variable.push({ key, value: '' });
}
const loginScript = `if (pm.response.code === 200) { const data = pm.response.json(); if (data.token) pm.collectionVariables.set("token", data.token); }`;
const groups = new Map();
for (const r of routes) {
  const folder = r.auth || 'Público';
  if (!groups.has(folder)) groups.set(folder, []);
  const urlPath = r.path.split('/').filter(Boolean).map(p => p.startsWith('{') ? `{{${p.slice(1, -1)}}}` : p);
  let request = { method: r.m.toUpperCase(), header: [], url: { raw: `{{baseUrl}}/${urlPath.join('/')}`, host: ['{{baseUrl}}'], path: urlPath }, description: `${r.desc || ''}\nAutorização: ${folder}.` };
  if (folder !== 'Público' && !r.path.endsWith('/login')) request.auth = { type: 'bearer', bearer: [{ key: 'token', value: '{{token}}', type: 'string' }] };
  if (r.path === '/v1/auth/login') {
    request.header.push({ key: 'Content-Type', value: 'application/json' });
    request.body = { mode: 'raw', raw: JSON.stringify({ email: '{{emailTeste}}', senha: '{{senhaTeste}}' }, null, 2), options: { raw: { language: 'json' } } };
  } else if (r.isForm || (typeof r.reqBody === 'string' && r.reqBody.startsWith('multipart/form-data'))) {
    const formdata = [];
    if (r.reqBody && typeof r.reqBody === 'object') {
      for (const [key, value] of Object.entries(r.reqBody)) {
        const vals = Array.isArray(value) ? value : [value];
        for (const v of vals) {
          const filePart = /file|foto|carteirinha/i.test(key);
          const sample = key === 'history' ? '[]' : key === 'message' ? 'Mensagem curta de teste' : String(v);
          formdata.push({ key, value: sample, type: filePart ? 'file' : 'text', ...(filePart ? { src: [] } : {}) });
        }
      }
    } else {
      const fileField = r.reqBody.match(/(?:form-data: )?([A-Za-z]+) \(arquivo/)?.[1] || 'file';
      formdata.push({ key: fileField, type: 'file', src: [] });
    }
    request.body = { mode: 'formdata', formdata };
  } else if (r.reqBody && typeof r.reqBody === 'object') {
    request.header.push({ key: 'Content-Type', value: 'application/json' });
    request.body = { mode: 'raw', raw: JSON.stringify(sanitize(r.reqBody), null, 2).replace(/<uuid>/g, '{{id}}'), options: { raw: { language: 'json' } } };
  }
  const item = { name: `${r.m.toUpperCase()} ${r.path}`, request };
  if (r.path === '/v1/auth/login') item.event = [{ listen: 'test', script: { type: 'text/javascript', exec: loginScript.split('\n') } }];
  groups.get(folder).push(item);
}
collection.item = (collection.item || []).filter(i => i.name !== 'API completa (mappings atuais)');
collection.item.push({ name: 'API completa (mappings atuais)', item: [...groups.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([name, item]) => ({ name: `Perfil: ${name}`, item })) });
function scrub(items) {
  for (const item of items || []) {
    if (item.request?.body?.mode === 'raw') {
      item.request.body.raw = item.request.body.raw.replace(/"(senha(?:Atual|Nova)?)"\s*:\s*"[^"]*"/gi, '"$1": "{{senhaTeste}}"').replace(/"token"\s*:\s*"[^"]*"/gi, '"token": "{{token}}"');
      if (item.name.includes('/v1/auth/redefinir-senha')) item.request.body.raw = item.request.body.raw.replace('"token": "{{token}}"', '"token": "{{resetToken}}"');
    }
    scrub(item.item);
  }
}
scrub(collection.item);
fs.writeFileSync(collectionPath, JSON.stringify(collection, null, 2) + '\n', 'utf8');
console.log(`Coleção atualizada: ${routes.length} mappings em ${groups.size} grupos.`);
