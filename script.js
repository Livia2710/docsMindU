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
});` },
    { m: "get", path: "/v1/auth/me", auth: "Autenticado", desc: "Obter sua conta e tipo pelo token; não envie seu próprio ID na URL",
      reqBody: null,
      resBody: { id: "<uuid>", nome: "Maria Silva", email: "maria@email.com", tipo: "CLIENTE", status: "APROVADO" },
      react: `const minhaConta = await api("/v1/auth/me");`,
      android: `@GET("v1/auth/me")
Call<MinhaContaResponse> minhaConta();` },
    { m: "put", path: "/v1/auth/senha", auth: "Autenticado", desc: "Trocar senha informando a senha atual",
      reqBody: { senhaAtual: "Senha@1234", novaSenha: "NovaSenha@1234" },
      resBody: null,
      react: `await api("/v1/auth/senha", { method: "PUT", body: { senhaAtual, novaSenha } });`,
      android: `@PUT("v1/auth/senha")
Call<Void> trocarSenha(@Body TrocaSenhaRequest body);` }
  ]},
  { id: "planos", nome: "Planos", rotas: [
    { m: "get", path: "/v1/planos", auth: "Público", desc: "Listar planos disponíveis — use o id retornado em planoId ao cadastrar uma empresa",
      reqBody: null,
      resBody: [{ id: "<uuid do plano>", nome: "Plano Start", vagasTotais: 30, porteIndicado: "Pequeno" }],
      react: `const planos = await api("/v1/planos");
// Selecione um plano e envie o ID no cadastro da empresa:
const planoId = planos[0].id;
await api("/v1/empresas", {
  method: "POST",
  body: { ...dadosEmpresa, planoId }
});`,
      android: `@GET("v1/planos")
Call<List<PlanoResponse>> listarPlanos();

// PlanoResponse deve ter: id, nome, vagasTotais, porteIndicado.
// Envie o id selecionado como planoId em EmpresaRequest.` }
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
    { m: "post", path: "/v1/empresas/me/matriculas", auth: "Empresa", desc: "Gerar matrículas da empresa autenticada (?quantidade=5)",
      reqBody: null,
      resBody: [{ id: "<uuid>", codigo: "A1B2C3", utilizada: false }],
      react: `const matriculas = await api("/v1/empresas/me/matriculas?quantidade=5", { method: "POST" });`,
      android: `@POST("v1/empresas/me/matriculas")
Call<List<MatriculaResponse>> gerarMinhasMatriculas(@Query("quantidade") int quantidade);` },
    { m: "get", path: "/v1/empresas/me/dashboard", auth: "Empresa", desc: "Dashboard da empresa autenticada; identidade vem do token",
      reqBody: null,
      resBody: { matriculasDisponiveis: 25, matriculasUsadas: 5 },
      react: `const dashboard = await api("/v1/empresas/me/dashboard");`,
      android: `@GET("v1/empresas/me/dashboard")
Call<DashboardResponse> meuDashboard();` },
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
    { m: "get", path: "/v1/clientes/me", auth: "Cliente", desc: "Obter meu perfil sem enviar o ID na URL",
      reqBody: null,
      resBody: { id: "<uuid>", nome: "Maria Silva", email: "maria@email.com", status: "APROVADO" },
      react: `const perfil = await api("/v1/clientes/me");`,
      android: `@GET("v1/clientes/me")
Call<ClienteResponse> meuPerfil();` },
    { m: "patch", path: "/v1/clientes/me/dados-sensiveis", auth: "Cliente", desc: "Enviar dados sensíveis do próprio perfil; identidade vem do token",
      reqBody: { cns: "898001234567890", dataNascimento: "1995-03-20", nomeMae: "Ana Silva", genero: "FEMININO" },
      resBody: { id: "<uuid>", status: "APROVADO" },
      react: `await api("/v1/clientes/me/dados-sensiveis", { method: "PATCH", body: dados });`,
      android: `@PATCH("v1/clientes/me/dados-sensiveis")
Call<ClienteResponse> completarMeuPerfil(@Body DadosSensiveisRequest body);` },
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
    { m: "get", path: "/v1/clientes", auth: "Empresa/Admin", desc: "Listar clientes da empresa autenticada (opcional: ?status=APROVADO)",
      reqBody: null,
      resBody: [{ id: "<uuid>", nome: "Maria Silva", status: "APROVADO" }],
      react: `const clientes = await api("/v1/clientes?status=AGUARDANDO_APROVACAO");`,
      android: `@GET("v1/clientes")
Call<List<ClienteResponse>> listarClientes(@Query("status") String status);` }
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
    { m: "get", path: "/v1/profissionais", auth: "Público", desc: "Buscar profissionais aprovados (?modalidade=&nome=&especialidade=)",
      reqBody: null,
      resBody: [{ id: "<uuid>", nome: "Dr. João Lima", tipo: "PSICOLOGO", tags: ["ansiedade"] }],
      react: `const resultado = await api("/v1/profissionais?especialidade=ansiedade");`,
      android: `@GET("v1/profissionais")
Call<List<ProfissionalResponse>> buscar(@Query("modalidade") String modalidade,
                                        @Query("nome") String nome,
                                        @Query("especialidade") String especialidade);` },
    { m: "get", path: "/v1/profissionais/{id}", auth: "Público", desc: "Detalhes públicos do profissional, locais e disponibilidade semanal",
      reqBody: null,
      resBody: { id: "<uuid>", nome: "Dr. João Lima", tipo: "PSICOLOGO", tags: ["ansiedade"], locais: [], disponibilidadeSemanal: [], fotoUrl: "/v1/profissionais/<uuid>/foto", bannerUrl: "/v1/profissionais/<uuid>/banner" },
      react: `const profissional = await api("/v1/profissionais/" + profissionalId);`,
      android: `@GET("v1/profissionais/{id}")
Call<ProfissionalDetalheResponse> detalhes(@Path("id") String id);` },
    { m: "post", path: "/v1/profissionais/{id}/horarios-disponiveis", auth: "Público", desc: "Consultar slots livres; data vai no body; padrão 50 min e fuso America/Sao_Paulo (configuráveis por ambiente)",
      reqBody: { data: "2026-10-20" },
      resBody: ["2026-10-20T09:00:00", "2026-10-20T09:50:00"],
      react: `const horarios = await api("/v1/profissionais/" + profissionalId + "/horarios-disponiveis", {
  method: "POST",
  body: { data: "2026-10-20" }
});`,
      android: `@POST("v1/profissionais/{id}/horarios-disponiveis")
Call<List<LocalDateTime>> horarios(@Path("id") String id, @Body ConsultaHorariosRequest body);` },
    { m: "get", path: "/v1/profissionais/{id}/foto", auth: "Público", desc: "Baixar a foto de perfil do profissional aprovado",
      reqBody: null,
      resBody: null,
      react: `const fotoUrl = BASE_URL + "/v1/profissionais/" + profissionalId + "/foto";`,
      android: `@GET("v1/profissionais/{id}/foto")
Call<ResponseBody> foto(@Path("id") String id);` },
    { m: "get", path: "/v1/profissionais/{id}/banner", auth: "Público", desc: "Baixar o banner do profissional aprovado",
      reqBody: null,
      resBody: null,
      react: `const bannerUrl = BASE_URL + "/v1/profissionais/" + profissionalId + "/banner";`,
      android: `@GET("v1/profissionais/{id}/banner")
Call<ResponseBody> banner(@Path("id") String id);` }
  ]},
  { id: "admin", nome: "Admin", rotas: [
    { m: "get", path: "/v1/admin/profissionais", auth: "Admin", desc: "Listar profissionais; filtro opcional por status",
      reqBody: null,
      resBody: [{ id: "<uuid>", nome: "Dr. João Lima", status: "PENDENTE" }],
      react: `const profissionais = await api("/v1/admin/profissionais?status=PENDENTE");`,
      android: `@GET("v1/admin/profissionais")
Call<List<ProfissionalResponse>> listarProfissionais(@Query("status") String status);` },
    { m: "get", path: "/v1/admin/profissionais/pendentes", auth: "Admin", desc: "Listar profissionais aguardando aprovação",
      reqBody: null,
      resBody: [{ id: "<uuid>", nome: "Dr. João Lima", status: "PENDENTE" }],
      react: `const pendentes = await api("/v1/admin/profissionais/pendentes");`,
      android: `@GET("v1/admin/profissionais/pendentes")
Call<List<ProfissionalResponse>> profissionaisPendentes();` },
    { m: "get", path: "/v1/admin/clientes", auth: "Admin", desc: "Listar todos os clientes; filtro opcional por status",
      reqBody: null,
      resBody: [{ id: "<uuid>", nome: "Maria Silva", status: "APROVADO" }],
      react: `const clientes = await api("/v1/admin/clientes");`,
      android: `@GET("v1/admin/clientes")
Call<List<ClienteResponse>> listarClientes(@Query("status") String status);` },
    { m: "get", path: "/v1/admin/empresas", auth: "Admin", desc: "Listar empresas cadastradas",
      reqBody: null,
      resBody: [{ id: "<uuid>", razaoSocial: "Acme Ltda", plano: "Plano Start" }],
      react: `const empresas = await api("/v1/admin/empresas");`,
      android: `@GET("v1/admin/empresas")
Call<List<EmpresaResponse>> listarEmpresas();` },
    { m: "get", path: "/v1/admin/agendamentos", auth: "Admin", desc: "Listar agendamentos da plataforma",
      reqBody: null,
      resBody: [{ id: "<uuid>", clienteNome: "Maria Silva", profissionalNome: "Dr. João Lima", status: "AGENDADO" }],
      react: `const agendamentos = await api("/v1/admin/agendamentos");`,
      android: `@GET("v1/admin/agendamentos")
Call<List<AgendamentoResponse>> listarAgendamentos();` }
  ]},
  { id: "agendamento", nome: "Agendamento", rotas: [
    { m: "post", path: "/v1/agendamentos", auth: "Cliente", desc: "Agendar uma consulta",
      reqBody: { profissionalId: "<uuid>", dataHora: "2026-10-20T09:00:00" },
      resBody: { id: "<uuid>", status: "AGENDADO" },
      react: `await api("/v1/agendamentos", { method: "POST", body: dadosAgendamento });`,
      android: `@POST("v1/agendamentos")
Call<AgendamentoResponse> agendar(@Body AgendamentoRequest body);` },
    { m: "get", path: "/v1/agendamentos/meus", auth: "Cliente", desc: "Listar meus agendamentos; cliente é identificado pelo token",
      reqBody: null,
      resBody: [{ id: "<uuid>", status: "AGENDADO", dataHora: "2026-10-05T10:00:00" }],
      react: `const meus = await api("/v1/agendamentos/meus");`,
      android: `@GET("v1/agendamentos/meus")
Call<List<AgendamentoResponse>> meusAgendamentos();` },
    { m: "get", path: "/v1/agendamentos/minha-agenda", auth: "Profissional", desc: "Listar agendamentos do profissional autenticado",
      reqBody: null,
      resBody: [{ id: "<uuid>", clienteNome: "Maria Silva", status: "AGENDADO", dataHora: "2026-10-20T09:00:00" }],
      react: `const agenda = await api("/v1/agendamentos/minha-agenda");`,
      android: `@GET("v1/agendamentos/minha-agenda")
Call<List<AgendamentoResponse>> minhaAgenda();` },
    { m: "patch", path: "/v1/agendamentos/{id}/cancelamento", auth: "Cliente/Profissional", desc: "Cancelar um agendamento",
      reqBody: null,
      resBody: { id: "<uuid>", status: "CANCELADO" },
      react: `await api("/v1/agendamentos/" + id + "/cancelamento", { method: "PATCH" });`,
      android: `@PATCH("v1/agendamentos/{id}/cancelamento")
Call<AgendamentoResponse> cancelar(@Path("id") String id);` },
    { m: "patch", path: "/v1/agendamentos/{id}/horario", auth: "Cliente/Profissional", desc: "Reagendar uma consulta; novo horário vai no body",
      reqBody: { dataHora: "2026-10-21T09:00:00" },
      resBody: { id: "<uuid>", status: "AGENDADO", dataHora: "2026-10-21T09:00:00" },
      react: `await api("/v1/agendamentos/" + id + "/horario", {
  method: "PATCH",
  body: { dataHora: "2026-10-21T09:00:00" }
});`,
      android: `@PATCH("v1/agendamentos/{id}/horario")
Call<AgendamentoResponse> reagendar(@Path("id") String id, @Body ReagendarRequest body);` }
  ]}
];

function codClasse(codigo) {
  return codigo.startsWith("5") ? "cod-5xx" : "cod-4xx";
}

const ERROS_COMUNS = {
  "GET /v1/auth/me": [
    { codigo: "401", motivo: "token ausente, inválido ou expirado", correcao: "faça login novamente em POST /v1/auth/login e envie o token Bearer" }
  ],
  "PUT /v1/auth/senha": [
    { codigo: "400", motivo: "senha atual incorreta ou nova senha menor que 8 caracteres", correcao: "confira a senha atual e envie uma nova senha com pelo menos 8 caracteres" }
  ],
  "GET /v1/planos": [
    { codigo: "lista vazia", motivo: "a API respondeu, mas não há planos cadastrados", correcao: "confirme que o seed de planos rodou ao iniciar a API e que a tabela plano tem registros" },
    { codigo: "CORS", motivo: "requisição bloqueada pelo navegador antes de chegar à API (só no React)", correcao: "confirme que a origem do site está na configuração CORS_ORIGENS do backend" },
    { codigo: "404", motivo: "rota não encontrada", correcao: "confirme que está usando GET /v1/planos e que a API implantada inclui a versão com essa rota" }
  ],
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
  "GET /v1/empresas/me/dashboard": [
    { codigo: "401", motivo: "token ausente ou inválido", correcao: "entre com a conta da empresa" }
  ],
  "POST /v1/empresas/me/matriculas": [
    { codigo: "400", motivo: "quantidade ultrapassa o limite de vagas do plano", correcao: "reduza a quantidade ou confira o limite contratado" },
    { codigo: "403", motivo: "token não é de uma empresa", correcao: "use a conta da empresa" }
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
  "PATCH /v1/clientes/me/dados-sensiveis": [
    { codigo: "403", motivo: "cliente ainda está AGUARDANDO_APROVACAO", correcao: "a empresa precisa aprovar a conta antes de enviar esses dados" },
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
  "GET /v1/profissionais/{id}": [
    { codigo: "404", motivo: "profissional inexistente ou ainda não aprovado", correcao: "confira o id; só perfis aprovados aparecem publicamente" }
  ],
  "POST /v1/profissionais/{id}/horarios-disponiveis": [
    { codigo: "400", motivo: "data ausente ou formato inválido", correcao: "envie no body a data no formato AAAA-MM-DD" },
    { codigo: "404", motivo: "profissional inexistente ou não aprovado", correcao: "confira o id do profissional aprovado" }
  ],
  "GET /v1/profissionais/{id}/foto": [
    { codigo: "404", motivo: "foto não cadastrada ou perfil não aprovado", correcao: "confira se o profissional já enviou a foto" }
  ],
  "GET /v1/profissionais/{id}/banner": [
    { codigo: "404", motivo: "banner não cadastrado ou perfil não aprovado", correcao: "confira se o profissional já enviou o banner" }
  ],
  "GET /v1/admin/profissionais/pendentes": [
    { codigo: "403", motivo: "token não é de uma conta Admin", correcao: "faça login com uma conta Admin seedada pela equipe" }
  ],
  "POST /v1/agendamentos": [
    { codigo: "409", motivo: "já existe um agendamento nesse horário (RN10)", correcao: "escolha outro horário, ou cancele o agendamento existente" },
    { codigo: "400", motivo: "horário fora da disponibilidade cadastrada pelo profissional", correcao: "confira a disponibilidade em PUT /disponibilidade" },
    { codigo: "404", motivo: "clienteId ou profissionalId inexistentes", correcao: "confira os dois ids enviados" }
  ],
  "GET /v1/agendamentos/meus": [
    { codigo: "lista vazia", motivo: "a conta autenticada ainda não tem agendamentos", correcao: "confirme se a conta cliente está correta e se já há consultas agendadas" }
  ],
  "GET /v1/agendamentos/minha-agenda": [
    { codigo: "403", motivo: "token não é de um profissional", correcao: "faça login com a conta profissional" }
  ],
  "PATCH /v1/agendamentos/{id}/cancelamento": [
    { codigo: "404", motivo: "agendamento não encontrado ou já cancelado", correcao: "confira o id e o status atual" }
  ],
  "PATCH /v1/agendamentos/{id}/horario": [
    { codigo: "400", motivo: "novo horário fora da agenda, de intervalo incorreto ou agendamento cancelado", correcao: "selecione um horário retornado por POST /v1/profissionais/{id}/horarios-disponiveis" },
    { codigo: "409", motivo: "novo horário acabou de ser ocupado", correcao: "consulte novamente os horários livres e escolha outro" },
    { codigo: "403", motivo: "agendamento não pertence à conta autenticada", correcao: "use a conta do cliente ou profissional envolvido" }
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
