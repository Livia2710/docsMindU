/* ========== Configuração ========== */
const ENV = {
  local: "http://localhost:8080",
  web: "https://mindu-api.onrender.com"
};
const ANDROID_LOCAL = "http://10.0.2.2:8080";
const THEME_STORAGE_KEY = "mindu-theme";
const REPO = "Livia2710/docsMindU";
const colorSchemePreference = window.matchMedia("(prefers-color-scheme: dark)");

let currentEnv = "local";

/* ========== Issues do GitHub ========== */
function issueURL(titulo, corpo) {
  return `https://github.com/${REPO}/issues/new?title=${encodeURIComponent(titulo)}&body=${encodeURIComponent(corpo)}&labels=api`;
}

/* ========== Tema ========== */
function setTheme(theme, savePreference = false) {
  document.documentElement.dataset.theme = theme;

  if (savePreference) {
    try { localStorage.setItem(THEME_STORAGE_KEY, theme); } catch (e) {}
  }

  const themeButton = document.getElementById("theme-toggle");
  if (!themeButton) return;
  const isDark = theme === "dark";
  themeButton.textContent = isDark ? "Modo escuro" : "Modo claro";
  themeButton.setAttribute("aria-pressed", String(isDark));
  themeButton.title = `Tema atual: ${isDark ? "escuro" : "claro"}. Clique para alternar.`;
}

function getSavedTheme() {
  try { return localStorage.getItem(THEME_STORAGE_KEY); } catch (e) { return null; }
}

function initializeTheme() {
  setTheme(getSavedTheme() || (colorSchemePreference.matches ? "dark" : "light"));

  colorSchemePreference.addEventListener("change", event => {
    if (!getSavedTheme()) {
      setTheme(event.matches ? "dark" : "light");
    }
  });
}

/* ========== Ambiente (Local / Web) ========== */
function setEnv(env) {
  currentEnv = env;
  document.getElementById("env-local").classList.toggle("active", env === "local");
  document.getElementById("env-web").classList.toggle("active", env === "web");
  const url = env === "local" ? ENV.local : ENV.web;
  document.querySelectorAll(".baseurl").forEach(element => {
    const isAndroid = element.closest("[data-panel='android']");
    element.textContent = isAndroid ? (env === "local" ? ANDROID_LOCAL : ENV.web) : url;
  });
  document.querySelectorAll(".url-full").forEach(element => {
    element.textContent = url + element.dataset.path;
  });
}

/* ========== Dados das rotas ========== */
const RESOURCES = window.MINDU_ROUTE_GROUPS;

function codClasse(codigo) {
  return codigo.startsWith("5") ? "cod-5xx" : "cod-4xx";
}

const ERROS_COMUNS = window.MINDU_ROUTE_ERRORS;

/* ========== Helpers ========== */
function esc(value) {
  return String(value).replace(/[&<>]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[character]));
}

function json(value) {
  return value === null ? null : JSON.stringify(value, null, 2);
}

function anchorId(resId, path, method) {
  return resId + "-" + method + "-" + path.replace(/[/{}]/g, "");
}

/* ========== Construção da página ========== */
function buildNav() {
  const nav = document.getElementById("sidenav");
  nav.innerHTML = RESOURCES.map(resource =>
    `<div class="grp">${resource.nome}</div>` +
    resource.rotas.map(route =>
      `<a href="#${anchorId(resource.id, route.path, route.m)}"><span class="nm ${route.m}">${route.m.toUpperCase()}</span><span class="np">${route.path}</span></a>`
    ).join("")
  ).join("");
}

function buildRoutes() {
  const element = document.getElementById("routes");
  element.innerHTML = RESOURCES.map(resource => `
    <section class="resource" id="${resource.id}">
      <h2>${resource.nome}</h2>
      ${resource.rotas.map((route, index) => routeHTML(resource.id, route, index)).join("")}
    </section>
  `).join("");

  RESOURCES.forEach(resource => resource.rotas.forEach((route, index) => {
    const card = document.getElementById(anchorId(resource.id, route.path, route.m));
    const link = document.createElement("a");
    link.className = "detail-link";
    link.href = "rota.html?rota=" + encodeURIComponent(route.m.toUpperCase() + " " + route.path);
    link.textContent = "Abrir guia detalhado desta rota →";
    card.querySelector(".body").prepend(link);
  }));
}

function routeHTML(resId, rt, i) {
  const anchor = anchorId(resId, rt.path, rt.m);
  const uid = `${resId}-${i}`;
  const issueHref = issueURL(
    `[Rota] ${rt.m.toUpperCase()} ${rt.path}`,
    `**Rota:** ${rt.m.toUpperCase()} ${rt.path}\n\n**O que está errado ou faltando:**\n`
  );
    const erros = ERROS_COMUNS[`${rt.m.toUpperCase()} ${rt.path}`] || [];
    const errosHTML = erros.length ? `
    <details class="errors">
        <summary>Erros comuns nesta rota (${erros.length})</summary>
        <ul>
        ${erros.map(e => `<li><span class="cod ${codClasse(e.codigo)}">${e.codigo}</span> ${esc(e.motivo)} — <strong>correção:</strong> ${esc(e.correcao)}</li>`).join("")}
        </ul>
    </details>` : "";
  return `
  <div class="route" id="${anchor}">
    <button class="head" onclick="this.parentElement.classList.toggle('open')">
      <span class="badge ${rt.m}">${rt.m.toUpperCase()}</span>
      <span class="path">${rt.path}</span>
      <span class="desc">${rt.desc}</span>
      <span class="auth-pill">${rt.auth}</span>
      <span class="chev">▸</span>
    </button>
    <div class="body">
      <p class="d">${rt.desc}</p>
      <div class="url-line"><span class="m">${rt.m.toUpperCase()}</span> <span class="url-full" data-path="${rt.path}">${ENV[currentEnv]}${rt.path}</span></div>
      ${rt.isForm
        ? `<p class="d">Corpo: <code>multipart/form-data</code></p>`
        : (rt.reqBody ? `<p class="d">Corpo da requisição:</p><pre><code>${esc(json(rt.reqBody))}</code></pre>` : "")}
      <p class="d">Resposta:</p>
      <pre><code>${esc(json(rt.resBody))}</code></pre>
      <a class="issue-link" target="_blank" rel="noopener" href="${issueHref}">Encontrou um problema ou precisa de ajuste nesta rota?</a>
      <div class="tabs" data-tabs="${uid}">
        <button class="active" onclick="switchTab('${uid}','react',this)">Sabrina · React</button>
        <button onclick="switchTab('${uid}','android',this)">Manoela · Android</button>
      </div>
      <div class="panel active" data-panel="${uid}-react"><pre><code>${esc(rt.react)}</code></pre></div>
      <div class="panel" data-panel="${uid}-android"><pre><code>${esc(rt.android)}</code></pre></div>
      ${errosHTML}
    </div>
  </div>`;
}

const ROUTE_GUIDES = window.MINDU_ROUTE_GUIDES;

const FIELD_HELP = window.MINDU_FIELD_HELP;

function requestFieldsHTML(route) {
  let sample = route.reqBody;
  if (Array.isArray(sample)) sample = sample[0];
  if (!sample || typeof sample !== "object") return "";
  const key = route.m.toUpperCase() + " " + route.path;
  const isPatch = route.m === "patch";
  const optionalProfessionalFields = key === "POST /v1/profissionais";
  return '<h3>Campos do corpo</h3><ul>' + Object.keys(sample).map(name => {
    let note = FIELD_HELP[name] || "Use o valor e formato ilustrados no exemplo.";
    if (optionalProfessionalFields && ["tipo", "tags", "fotoCarteirinha"].includes(name)) note += " Opcional no cadastro inicial.";
    else if (isPatch) note += " Omitir mantém o valor atual.";
    return '<li><code>' + esc(name) + '</code> — ' + esc(note) + '</li>';
  }).join("") + '</ul>';
}

function routeGuideHTML(route) {
  const key = route.m.toUpperCase() + " " + route.path;
  const guide = ROUTE_GUIDES[key] || {};
  const steps = guide.steps || [
    "Confira o ambiente selecionado e substitua parâmetros como {id} por valores reais.",
    route.auth === "Público" ? "A rota é pública; não precisa token." : "Envie Authorization: Bearer <token> obtido no login.",
    route.reqBody ? (route.isForm ? "Envie os campos no formato multipart/form-data." : "Envie JSON com Content-Type: application/json.") : "Não há corpo JSON; confira parâmetros de query no caminho."
  ];
  const notes = guide.notes || [];
  const authText = route.auth === "Público" ? "Autenticação não necessária." : "Authorization: Bearer <token>.";
  const formatText = route.isForm ? "multipart/form-data; deixe o navegador montar o boundary." : (route.reqBody ? "application/json" : "Sem corpo JSON.");
  const paramText = route.path.includes("{") ? "Troque {id} pelo ID real, sem as chaves." : "";
  return '<section class="route-guide">' +
    '<h3>Quando usar</h3><p>' + esc(guide.summary || route.desc) + '</p>' +
    '<h3>Passo a passo</h3><ol>' + steps.map(item => '<li>' + esc(item) + '</li>').join("") + '</ol>' +
    '<h3>Autenticação e formato</h3><ul><li>' + esc(authText) + '</li><li>' + esc(formatText) + '</li>' +
    (paramText ? '<li>' + esc(paramText) + '</li>' : '') + '</ul>' +
    requestFieldsHTML(route) +
    (notes.length ? '<h3>Observações</h3><ul>' + notes.map(item => '<li>' + esc(item) + '</li>').join("") + '</ul>' : '') +
    '</section>';
}

function renderRouteDetail() {
  const mount = document.getElementById("route-detail");
  const selected = new URLSearchParams(location.search).get("rota");
  let found = null;
  RESOURCES.forEach(resource => resource.rotas.forEach((route, index) => {
    if (route.m.toUpperCase() + " " + route.path === selected) found = { resource, route, index };
  }));
  if (!found) {
    mount.innerHTML = '<a class="back-link" href="index.html">← Todas as rotas</a><h2>Rota não encontrada</h2><p>Volte ao catálogo e abra o guia da rota desejada.</p>';
    return;
  }
  const title = found.route.m.toUpperCase() + " " + found.route.path;
  document.title = title + " · API MindU";
  mount.innerHTML = '<a class="back-link" href="index.html">← Todas as rotas</a>' +
    '<p class="eyebrow">' + esc(found.resource.nome) + ' · Guia de integração</p>' +
    '<h2 class="detail-title">' + esc(title) + '</h2>' +
    '<p class="detail-lead">' + esc(found.route.desc) + '</p>' +
    '<div id="detail-card">' + routeHTML(found.resource.id, found.route, found.index) + '</div>';
  const card = mount.querySelector(".route");
  card.classList.add("open", "detail-route");
  card.querySelector(".body").prepend(document.createRange().createContextualFragment(routeGuideHTML(found.route)));
}

function switchTab(uid, which, button) {
  document.querySelectorAll(`[data-tabs="${uid}"] button`).forEach(tab => tab.classList.remove("active"));
  button.classList.add("active");
  document.querySelector(`[data-panel="${uid}-react"]`).classList.toggle("active", which === "react");
  document.querySelector(`[data-panel="${uid}-android"]`).classList.toggle("active", which === "android");
}

/* ========== Eventos ========== */
document.addEventListener("click", event => {
  if (event.target.closest("#theme-toggle")) {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    setTheme(nextTheme, true);
    return;
  }

  // funciona se os botões Local/Web usarem data-env (se usarem onclick, também funciona)
  const envButton = event.target.closest("[data-env]");
  if (envButton) {
    setEnv(envButton.dataset.env);
  }
});

function setupTabs() {
  document.querySelectorAll("[data-setuptabs] button").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-setuptabs] button").forEach(tab => tab.classList.remove("active"));
      button.classList.add("active");
      document.querySelectorAll(".setup .panel").forEach(panel => {
        panel.classList.toggle("active", panel.dataset.panel === button.dataset.tab);
      });
    });
  });
}

function syncTopbar() {
  const topbar = document.querySelector(".topbar");
  if (!topbar) return;
  const update = () => document.documentElement.style.setProperty("--topbar-h", topbar.offsetHeight + "px");
  new ResizeObserver(update).observe(topbar);
  update();
}

/* ========== Inicialização ========== */
function init() {
  const reqRoute = document.getElementById("req-route");
  if (reqRoute) {
    reqRoute.href = issueURL(
      "[Nova rota] ",
      `**Quem pede:** Sabrina / Manoela

**Método e caminho sugerido:** (ex.: DELETE /v1/agendamentos/{id})

**Para que serve na tela/app:**

**Corpo da requisição (se houver):**

**Resposta esperada:**
`
    );
  }

  syncTopbar();
  if (document.getElementById("routes")) {
    buildNav();
    buildRoutes();
  }
  if (document.getElementById("route-detail")) renderRouteDetail();
  setupTabs();
  setEnv("local");
  initializeTheme();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
