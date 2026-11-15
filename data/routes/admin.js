window.MINDU_ROUTE_GROUPS = window.MINDU_ROUTE_GROUPS || [];
window.MINDU_ROUTE_GROUPS.push(
{ id: "admin", nome: "Admin", rotas: [
    { m: "get", path: "/v1/admin/profissionais", auth: "Admin", desc: "Listar profissionais; filtros opcionais status e ativo. Paginação opcional com page (inicia em 0) e size (1–100); sem esses parâmetros, retorna a lista completa. Quando paginado, consulte X-Total-Count, X-Page, X-Page-Size e X-Total-Pages nos headers.",
      reqBody: null,
      resBody: [{ id: "<uuid>", nome: "Dr. João Lima", status: "PENDENTE", ativo: true }],
      react: `const profissionais = await api("/v1/admin/profissionais?status=PENDENTE&ativo=true&page=0&size=20");`,
      android: `@GET("v1/admin/profissionais")
Call<List<ProfissionalResponse>> listarProfissionais(@Query("status") String status,
    @Query("ativo") Boolean ativo, @Query("page") Integer page, @Query("size") Integer size);
// Headers de paginação: X-Total-Count, X-Page, X-Page-Size, X-Total-Pages.` },
    { m: "get", path: "/v1/admin/profissionais/{id}/carteirinha", auth: "Admin", desc: "Visualizar a carteirinha enviada pelo profissional, inclusive quando estiver pendente",
      reqBody: null,
      resBody: "Imagem PNG em bytes (resposta binária, não é JSON)",
      react: `const resposta = await fetch(BASE_URL + "/v1/admin/profissionais/" + id + "/carteirinha", {
  headers: { Authorization: "Bearer " + token }
});
if (!resposta.ok) throw new Error("Não foi possível carregar a carteirinha");
const imagemUrl = URL.createObjectURL(await resposta.blob());`,
      android: `@GET("v1/admin/profissionais/{id}/carteirinha")
Call<ResponseBody> carteirinha(@Path("id") String id);
// O interceptor do Retrofit deve enviar Authorization: Bearer <token>.` },
    { m: "get", path: "/v1/admin/profissionais/{id}/foto", auth: "Admin", desc: "Visualizar foto de perfil para análise administrativa, inclusive antes da aprovação do profissional",
      reqBody: null,
      resBody: "Imagem PNG em bytes (resposta binária, não é JSON)",
      react: `const resposta = await fetch(BASE_URL + "/v1/admin/profissionais/" + id + "/foto", {
  headers: { Authorization: "Bearer " + token }
});
if (!resposta.ok) throw new Error("Não foi possível carregar a foto");
const imagemUrl = URL.createObjectURL(await resposta.blob());`,
      android: `@GET("v1/admin/profissionais/{id}/foto")
Call<ResponseBody> fotoProfissional(@Path("id") String id);
// O interceptor do Retrofit deve enviar Authorization: Bearer <token>.` },
    { m: "get", path: "/v1/admin/profissionais/pendentes", auth: "Admin", desc: "Listar profissionais aguardando aprovação; paginação opcional com page (inicia em 0) e size (1–100)",
      reqBody: null,
      resBody: [{ id: "<uuid>", nome: "Dr. João Lima", status: "PENDENTE", ativo: true }],
      react: `const pendentes = await api("/v1/admin/profissionais/pendentes?page=0&size=20");`,
      android: `@GET("v1/admin/profissionais/pendentes")
Call<List<ProfissionalResponse>> profissionaisPendentes(@Query("page") Integer page,
    @Query("size") Integer size);` },
    { m: "get", path: "/v1/admin/clientes", auth: "Admin", desc: "Listar clientes; filtros opcionais status, empresaId e ativo. Paginação opcional com page (inicia em 0) e size (1–100); sem paginação retorna a lista completa. Respostas paginadas trazem metadados nos headers X-Total-Count, X-Page, X-Page-Size e X-Total-Pages.",
      reqBody: null,
      resBody: [{ id: "<uuid>", nome: "Maria Silva", empresaId: "<uuid>", status: "APROVADO", ativo: true, dataCadastro: "2026-11-15T10:30:00" }],
      react: `const clientes = await api("/v1/admin/clientes?empresaId=" + empresaId + "&ativo=true&page=0&size=20");`,
      android: `@GET("v1/admin/clientes")
Call<List<ClienteResponse>> listarClientes(@Query("status") String status,
    @Query("empresaId") String empresaId, @Query("ativo") Boolean ativo,
    @Query("page") Integer page, @Query("size") Integer size);` },
    { m: "get", path: "/v1/admin/empresas", auth: "Admin", desc: "Listar empresas; filtro opcional ativo e paginação opcional com page (inicia em 0) e size (1–100)",
      reqBody: null,
      resBody: [{ id: "<uuid>", razaoSocial: "Acme Ltda", plano: "Plano Start", ativo: true }],
      react: `const empresas = await api("/v1/admin/empresas?ativo=true&page=0&size=20");`,
      android: `@GET("v1/admin/empresas")
Call<List<EmpresaResponse>> listarEmpresas(@Query("ativo") Boolean ativo,
    @Query("page") Integer page, @Query("size") Integer size);` },
    { m: "get", path: "/v1/admin/solicitacoes-exclusao", auth: "Admin", desc: "Listar solicitações; filtro opcional status e paginação opcional com page (inicia em 0) e size (1–100)",
      reqBody: null,
      resBody: [{ id: "<uuid>", usuarioId: "<uuid>", email: "maria@email.com", tipoConta: "CLIENTE", status: "PENDENTE", solicitadaEm: "2026-11-15T10:30:00" }],
      react: `const solicitacoes = await api("/v1/admin/solicitacoes-exclusao?status=PENDENTE&page=0&size=20");`,
      android: `@GET("v1/admin/solicitacoes-exclusao")
Call<List<SolicitacaoExclusaoResponse>> listarSolicitacoes(
    @Query("status") String status, @Query("page") Integer page, @Query("size") Integer size);` },
    { m: "get", path: "/v1/admin/agendamentos", auth: "Admin", desc: "Listar agendamentos; filtros opcionais status, clienteId e profissionalId. Paginação opcional com page (inicia em 0) e size (1–100)",
      reqBody: null,
      resBody: [{ id: "<uuid>", clienteId: "<uuid>", clienteNome: "Maria Silva", profissionalId: "<uuid>", profissionalNome: "Dr. João Lima", status: "AGENDADO" }],
      react: `const agendamentos = await api("/v1/admin/agendamentos?status=AGENDADO&clienteId=" + clienteId + "&page=0&size=20");`,
      android: `@GET("v1/admin/agendamentos")
Call<List<AgendamentoResponse>> listarAgendamentos(@Query("status") String status,
    @Query("clienteId") String clienteId, @Query("profissionalId") String profissionalId,
    @Query("page") Integer page, @Query("size") Integer size);` },
    { m: "delete", path: "/v1/admin/empresas/{id}", auth: "Admin", desc: "Desativar a conta da empresa e invalidar seus tokens atuais",
      reqBody: null, resBody: "204 No Content",
      react: `await api("/v1/admin/empresas/" + empresaId, { method: "DELETE" });`,
      android: `@DELETE("v1/admin/empresas/{id}")
Call<Void> excluirEmpresa(@Path("id") String empresaId);` },
    { m: "patch", path: "/v1/admin/empresas/{id}/reativacao", auth: "Admin", desc: "Reativar uma empresa desativada; invalida tokens anteriores. Operação idempotente.",
      reqBody: null, resBody: "204 No Content",
      react: `await api("/v1/admin/empresas/" + empresaId + "/reativacao", { method: "PATCH" });`,
      android: `@PATCH("v1/admin/empresas/{id}/reativacao")
Call<Void> reativarEmpresa(@Path("id") String id);` },
    { m: "delete", path: "/v1/admin/profissionais/{id}", auth: "Admin", desc: "Desativar a conta profissional e invalidar seus tokens atuais",
      reqBody: null, resBody: "204 No Content",
      react: `await api("/v1/admin/profissionais/" + profissionalId, { method: "DELETE" });`,
      android: `@DELETE("v1/admin/profissionais/{id}")
Call<Void> excluirProfissional(@Path("id") String profissionalId);` },
    { m: "patch", path: "/v1/admin/profissionais/{id}/reativacao", auth: "Admin", desc: "Reativar uma conta profissional desativada; invalida tokens anteriores. Operação idempotente.",
      reqBody: null, resBody: "204 No Content",
      react: `await api("/v1/admin/profissionais/" + profissionalId + "/reativacao", { method: "PATCH" });`,
      android: `@PATCH("v1/admin/profissionais/{id}/reativacao")
Call<Void> reativarProfissional(@Path("id") String id);` },
    { m: "delete", path: "/v1/admin/clientes/{id}", auth: "Admin", desc: "Desativar a conta do cliente e invalidar seus tokens atuais",
      reqBody: null, resBody: "204 No Content",
      react: `await api("/v1/admin/clientes/" + clienteId, { method: "DELETE" });`,
      android: `@DELETE("v1/admin/clientes/{id}")
Call<Void> excluirCliente(@Path("id") String clienteId);` },
    { m: "patch", path: "/v1/admin/clientes/{id}/reativacao", auth: "Admin", desc: "Reativar uma conta de cliente desativada; invalida tokens anteriores. Operação idempotente.",
      reqBody: null, resBody: "204 No Content",
      react: `await api("/v1/admin/clientes/" + clienteId + "/reativacao", { method: "PATCH" });`,
      android: `@PATCH("v1/admin/clientes/{id}/reativacao")
Call<Void> reativarCliente(@Path("id") String id);` }
  ]}
);
