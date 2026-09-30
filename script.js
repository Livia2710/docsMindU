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
const RESOURCES = [
  { id: "auth", nome: "Autenticação", rotas: [
    { m: "post", path: "/v1/auth/login", auth: "Público", desc: "Login — retorna o token JWT",
      reqBody: { email: "cliente@empresa.com", senha: "Senha@1234" },
      resBody: { token: "eyJhbGciOiJIUzI1NiJ9...", tipo: "CLIENTE" },
      react: `const { token, tipo } = await api("/v1/auth/login", {
  method: "POST",
  body: { email, senha }
});
localStorage.setItem("mindu_token", token);`,
      android: `@POST("v1/auth/login")
Call<LoginResponse> login(@Body LoginRequest body);

// uso:
api.login(new LoginRequest(email, senha)).enqueue(new Callback<>() {
    public void onResponse(Call<LoginResponse> call, Response<LoginResponse> res) {
        String token = res.body().getToken();
        prefs.edit().putString("token", token).apply();
    }
});` }
  ]},
  { id: "empresa", nome: "Empresa", rotas: [
    { m: "post", path: "/v1/empresas", auth: "Público", desc: "Cadastrar empresa",
      reqBody: { razaoSocial: "Acme Ltda", nomeFantasia: "Acme", inscricaoEstadual: "123456789", cnpj: "00000000000191", responsavel: "Ana Souza", cep: "01001000", logradouro: "Praça da Sé", numero: "100", complemento: "Sala 1", bairro: "Sé", cidade: "São Paulo", estado: "SP", email: "acme@empresa.com", telefone: "11999990000", senha: "Senha@1234", planoId: "<uuid do plano>" },
      resBody: { id: "<uuid>", razaoSocial: "Acme Ltda", plano: "Start" },
      react: `await api("/v1/empresas", { method: "POST", body: dadosEmpresa });`,
      android: `@POST("v1/empresas")
Call<EmpresaResponse> cadastrarEmpresa(@Body EmpresaRequest body);` },
    { m: "post", path: "/v1/empresas/{id}/matriculas", auth: "Empresa", desc: "Gerar matrículas (?quantidade=5)",
      reqBody: null,
      resBody: [{ id: "<uuid>", codigo: "A1B2C3", utilizada: false }],
      react: `await api("/v1/empresas/" + empresaId + "/matriculas?quantidade=5", { method: "POST" });`,
      android: `@POST("v1/empresas/{id}/matriculas")
Call<List<MatriculaResponse>> gerarMatriculas(@Path("id") String empresaId, @Query("quantidade") int quantidade);` },
    { m: "get", path: "/v1/empresas/{id}/dashboard", auth: "Empresa", desc: "Contadores do painel da empresa",
      reqBody: null,
      resBody: { matriculasDisponiveis: 25, matriculasUsadas: 5, clientesAprovados: 4 },
      react: `const dash = await api("/v1/empresas/" + empresaId + "/dashboard");`,
      android: `@GET("v1/empresas/{id}/dashboard")
Call<DashboardResponse> getDashboard(@Path("id") String empresaId);` }
  ]},
  { id: "cliente", nome: "Cliente", rotas: [
    { m: "post", path: "/v1/clientes", auth: "Público", desc: "Cadastro — etapa 1 (com matrícula)",
      reqBody: { nome: "Maria Silva", email: "maria@email.com", senha: "Senha@1234", empresaId: "<uuid>", matricula: "A1B2C3" },
      resBody: { id: "<uuid>", status: "AGUARDANDO_APROVACAO" },
      react: `await api("/v1/clientes", { method: "POST", body: dadosCliente });`,
      android: `@POST("v1/clientes")
Call<ClienteResponse> cadastrarCliente(@Body ClienteRequest body);` },
    { m: "patch", path: "/v1/clientes/{id}/aprovacao", auth: "Empresa", desc: "Aprovar ou rejeitar o cliente (?aprovado=true)",
      reqBody: null,
      resBody: { id: "<uuid>", status: "APROVADO" },
      react: `await api("/v1/clientes/" + id + "/aprovacao?aprovado=true", { method: "PATCH" });`,
      android: `@PATCH("v1/clientes/{id}/aprovacao")
Call<ClienteResponse> aprovarCliente(@Path("id") String id, @Query("aprovado") boolean aprovado);` },
    { m: "patch", path: "/v1/clientes/{id}/dados-sensiveis", auth: "Cliente", desc: "Cadastro — etapa 2 (CNS, nascimento, gênero)",
      reqBody: { cns: "898001234567890", dataNascimento: "1995-03-20", nomeMae: "Ana Silva", genero: "FEMININO" },
      resBody: { id: "<uuid>", status: "APROVADO" },
      react: `await api("/v1/clientes/" + id + "/dados-sensiveis", { method: "PATCH", body: dados });`,
      android: `@PATCH("v1/clientes/{id}/dados-sensiveis")
Call<ClienteResponse> enviarDadosSensiveis(@Path("id") String id, @Body DadosSensiveisRequest body);` },
    { m: "get", path: "/v1/clientes", auth: "Empresa", desc: "Listar clientes da empresa (?empresaId=)",
      reqBody: null,
      resBody: [{ id: "<uuid>", nome: "Maria Silva", status: "APROVADO" }],
      react: `const clientes = await api("/v1/clientes?empresaId=" + empresaId);`,
      android: `@GET("v1/clientes")
Call<List<ClienteResponse>> listarClientes(@Query("empresaId") String empresaId);` }
  ]},
  { id: "profissional", nome: "Profissional", rotas: [
    { m: "post", path: "/v1/profissionais", auth: "Público", desc: "Cadastro — multipart/form-data (campos soltos + foto)", isForm: true,
      reqBody: { nome: "Dr. João Lima", email: "joao@mindu.com", senha: "Senha@1234", tipo: "PSICOLOGO", tags: ["ansiedade", "TCC"], fotoCarteirinha: "(arquivo)" },
      resBody: { id: "<uuid>", status: "PENDENTE" },
      react: `const form = new FormData();
form.append("nome", nome);
form.append("email", email);
form.append("senha", senha);
form.append("tipo", tipo); // PSICOLOGO | PSIQUIATRA | TERAPEUTA
tags.forEach(t => form.append("tags", t)); // repita a chave por tag
form.append("fotoCarteirinha", arquivoInput.files[0]);

await api("/v1/profissionais", { method: "POST", body: form, isFormData: true });`,
      android: `@Multipart
@POST("v1/profissionais")
Call<ProfissionalResponse> cadastrar(
    @Part("nome") RequestBody nome,
    @Part("email") RequestBody email,
    @Part("senha") RequestBody senha,
    @Part("tipo") RequestBody tipo,
    @Part("tags") List<RequestBody> tags,
    @Part MultipartBody.Part fotoCarteirinha
);

// montando a foto a partir de um File:
RequestBody fotoBody = RequestBody.create(arquivoFoto, MediaType.parse("image/jpeg"));
MultipartBody.Part foto = MultipartBody.Part.createFormData("fotoCarteirinha", arquivoFoto.getName(), fotoBody);` },
    { m: "patch", path: "/v1/profissionais/{id}/aprovacao", auth: "Admin", desc: "Aprovar ou rejeitar profissional (?aprovado=true)",
      reqBody: null,
      resBody: { id: "<uuid>", status: "APROVADO" },
      react: `await api("/v1/profissionais/" + id + "/aprovacao?aprovado=true", { method: "PATCH" });`,
      android: `@PATCH("v1/profissionais/{id}/aprovacao")
Call<ProfissionalResponse> aprovarProfissional(@Path("id") String id, @Query("aprovado") boolean aprovado);` },
    { m: "post", path: "/v1/profissionais/{id}/locais", auth: "Profissional", desc: "Adicionar local de atendimento",
      reqBody: { modalidade: "PRESENCIAL", cep: "01001000", logradouro: "Av. Paulista", numero: "1000", bairro: "Bela Vista", cidade: "São Paulo", estado: "SP" },
      resBody: { id: "<uuid>", modalidade: "PRESENCIAL" },
      react: `await api("/v1/profissionais/" + id + "/locais", { method: "POST", body: local });`,
      android: `@POST("v1/profissionais/{id}/locais")
Call<LocalResponse> adicionarLocal(@Path("id") String id, @Body LocalRequest body);` },
    { m: "put", path: "/v1/profissionais/{id}/disponibilidade", auth: "Profissional", desc: "Definir os horários da semana",
      reqBody: [{ diaSemana: "SEGUNDA", horaInicio: "08:00", horaFim: "12:00" }],
      resBody: [{ diaSemana: "SEGUNDA", horaInicio: "08:00", horaFim: "12:00" }],
      react: `await api("/v1/profissionais/" + id + "/disponibilidade", { method: "PUT", body: janelas });`,
      android: `@PUT("v1/profissionais/{id}/disponibilidade")
Call<List<DisponibilidadeResponse>> definirDisponibilidade(@Path("id") String id, @Body List<DisponibilidadeRequest> body);` },
    { m: "get", path: "/v1/profissionais", auth: "Autenticado", desc: "Buscar profissionais (?modalidade=&nome=&especialidade=)",
      reqBody: null,
      resBody: [{ id: "<uuid>", nome: "Dr. João Lima", tipo: "PSICOLOGO", tags: ["ansiedade"] }],
      react: `const resultado = await api("/v1/profissionais?especialidade=ansiedade");`,
      android: `@GET("v1/profissionais")
Call<List<ProfissionalResponse>> buscar(@Query("modalidade") String modalidade,
                                        @Query("nome") String nome,
                                        @Query("especialidade") String especialidade);` }
  ]},
  { id: "agendamento", nome: "Agendamento", rotas: [
    { m: "post", path: "/v1/agendamentos", auth: "Cliente", desc: "Agendar uma consulta",
      reqBody: { clienteId: "<uuid>", profissionalId: "<uuid>", dataHora: "2026-10-05T10:00:00" },
      resBody: { id: "<uuid>", status: "AGENDADO" },
      react: `await api("/v1/agendamentos", { method: "POST", body: dadosAgendamento });`,
      android: `@POST("v1/agendamentos")
Call<AgendamentoResponse> agendar(@Body AgendamentoRequest body);` },
    { m: "get", path: "/v1/agendamentos/meus", auth: "Cliente", desc: "Listar meus agendamentos (?clienteId=)",
      reqBody: null,
      resBody: [{ id: "<uuid>", status: "AGENDADO", dataHora: "2026-10-05T10:00:00" }],
      react: `const meus = await api("/v1/agendamentos/meus?clienteId=" + clienteId);`,
      android: `@GET("v1/agendamentos/meus")
Call<List<AgendamentoResponse>> meusAgendamentos(@Query("clienteId") String clienteId);` },
    { m: "patch", path: "/v1/agendamentos/{id}/cancelamento", auth: "Cliente/Profissional", desc: "Cancelar um agendamento",
      reqBody: null,
      resBody: { id: "<uuid>", status: "CANCELADO" },
      react: `await api("/v1/agendamentos/" + id + "/cancelamento", { method: "PATCH" });`,
      android: `@PATCH("v1/agendamentos/{id}/cancelamento")
Call<AgendamentoResponse> cancelar(@Path("id") String id);` }
  ]}
];

function codClasse(codigo) {
  return codigo.startsWith("5") ? "cod-5xx" : "cod-4xx";
}

const ERROS_COMUNS = {
  "POST /v1/auth/login": [
    { codigo: "401", motivo: "e-mail ou senha incorretos", correcao: "confira as credenciais; se for logo após o deploy, confirme que o seed de admins rodou (variável MINDU_ADMIN_SENHA preenchida)" },
    { codigo: "423", motivo: "conta bloqueada após 5 tentativas erradas (RN07)", correcao: "aguarde 15 minutos, ou no banco: UPDATE usuario SET tentativas_login = 0, bloqueado_ate = NULL WHERE email = '...'" },
    { codigo: "CORS", motivo: "requisição bloqueada pelo navegador antes de chegar na API (só no React)", correcao: "confirme que a origem do site está em CORS_ORIGENS no Render" }
  ],
  "POST /v1/empresas": [
    { codigo: "409", motivo: "CNPJ ou razão social já cadastrados (RN02)", correcao: "use um CNPJ/razão social diferentes" },
    { codigo: "400", motivo: "planoId inválido ou inexistente", correcao: "confira o UUID: SELECT id, nome FROM plano;" }
  ],
  "POST /v1/empresas/{id}/matriculas": [
    { codigo: "400", motivo: "quantidade solicitada passa do limite de vagas do plano (RN09)", correcao: "peça uma quantidade menor ou confirme vagas_totais do plano" },
    { codigo: "401", motivo: "token ausente ou de outro perfil", correcao: "use o token da própria empresa (login em /v1/auth/login)" }
  ],
  "GET /v1/empresas/{id}/dashboard": [
    { codigo: "404", motivo: "id de empresa não encontrado", correcao: "confira o id usado na URL" },
    { codigo: "401", motivo: "token de um perfil que não é essa empresa", correcao: "use o token da empresa dona do dashboard" }
  ],
  "POST /v1/clientes": [
    { codigo: "409", motivo: "matrícula já usada ou e-mail já cadastrado (RN01)", correcao: "gere uma matrícula nova, ou use outro e-mail" },
    { codigo: "400", motivo: "matrícula pertence a outra empresa (RN04)", correcao: "confira o empresaId enviado" },
    { codigo: "400", motivo: "senha com menos de 8 caracteres (RN03)", correcao: "exija 8+ caracteres no formulário" }
  ],
  "PATCH /v1/clientes/{id}/aprovacao": [
    { codigo: "404", motivo: "id de cliente não encontrado", correcao: "confira o id" },
    { codigo: "401", motivo: "token que não é da empresa dona do cliente", correcao: "use o token da empresa" }
  ],
  "PATCH /v1/clientes/{id}/dados-sensiveis": [
    { codigo: "403", motivo: "cliente ainda está AGUARDANDO_APROVACAO (RN05)", correcao: "a empresa precisa aprovar o cliente antes desta chamada" },
    { codigo: "500", motivo: "chave de criptografia do CNS mal configurada", correcao: "MINDU_CRIPTOGRAFIA_CHAVE precisa ter exatamente 16, 24 ou 32 caracteres" }
  ],
  "GET /v1/clientes": [
    { codigo: "401", motivo: "rota exige token da empresa (evita vazar dados de clientes de terceiros)", correcao: "faça login como a empresa antes de listar" }
  ],
  "POST /v1/profissionais": [
    { codigo: "415", motivo: "campo \"dados\" chegando sem Content-Type application/json (comum em apps que enviam JSON dentro do form-data)", correcao: "envie os campos soltos no form-data (nome, email, senha, tipo, tags) em vez de um bloco JSON único" },
    { codigo: "400", motivo: "fotoCarteirinha ausente", correcao: "o campo é obrigatório — confirme que o arquivo foi anexado" }
  ],
  "PATCH /v1/profissionais/{id}/aprovacao": [
    { codigo: "401", motivo: "token que não é de um Admin", correcao: "faça login com um dos e-mails de admin do seed" },
    { codigo: "404", motivo: "id de profissional não encontrado", correcao: "confira o id" }
  ],
  "POST /v1/profissionais/{id}/locais": [
    { codigo: "400", motivo: "modalidade PRESENCIAL sem endereço (RF08)", correcao: "envie cep, logradouro, numero, bairro, cidade e estado para locais presenciais" },
    { codigo: "401", motivo: "token de um profissional diferente do dono do local", correcao: "use o próprio token do profissional" }
  ],
  "PUT /v1/profissionais/{id}/disponibilidade": [
    { codigo: "400", motivo: "horaInicio depois de horaFim, ou formato de hora inválido", correcao: "use o formato HH:mm e horaInicio antes de horaFim" }
  ],
  "GET /v1/profissionais": [
    { codigo: "lista vazia", motivo: "o profissional existe mas ainda está PENDENTE (RN06 — some da busca até ser aprovado)", correcao: "aprove o profissional antes de buscar" }
  ],
  "POST /v1/agendamentos": [
    { codigo: "409", motivo: "já existe um agendamento nesse horário (RN10)", correcao: "escolha outro horário, ou cancele o agendamento existente" },
    { codigo: "400", motivo: "horário fora da disponibilidade cadastrada pelo profissional", correcao: "confira a disponibilidade em PUT /disponibilidade" },
    { codigo: "404", motivo: "clienteId ou profissionalId inexistentes", correcao: "confira os dois ids enviados" }
  ],
  "GET /v1/agendamentos/meus": [
    { codigo: "lista vazia", motivo: "clienteId enviado não é o dono do token, ou não há agendamentos ainda", correcao: "confirme que o clienteId é o mesmo do usuário logado" }
  ],
  "PATCH /v1/agendamentos/{id}/cancelamento": [
    { codigo: "404", motivo: "agendamento não encontrado ou já cancelado", correcao: "confira o id e o status atual" }
  ]
};

/* ========== Helpers ========== */
function esc(value) {
  return String(value).replace(/[&<>]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[character]));
}

function json(value) {
  return value === null ? null : JSON.stringify(value, null, 2);
}

function anchorId(resId, path) {
  return `${resId}-${path.replace(/[/{}]/g, "")}`;
}

/* ========== Construção da página ========== */
function buildNav() {
  const nav = document.getElementById("sidenav");
  nav.innerHTML = RESOURCES.map(resource =>
    `<div class="grp">${resource.nome}</div>` +
    resource.rotas.map(route =>
      `<a href="#${anchorId(resource.id, route.path)}"><span class="nm ${route.m}">${route.m.toUpperCase()}</span><span class="np">${route.path}</span></a>`
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
}

function routeHTML(resId, rt, i) {
  const anchor = anchorId(resId, rt.path);
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
  buildNav();
  buildRoutes();
  setupTabs();
  setEnv("local");
  initializeTheme();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
