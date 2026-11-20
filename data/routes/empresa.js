window.MINDU_ROUTE_GROUPS = window.MINDU_ROUTE_GROUPS || [];
window.MINDU_ROUTE_GROUPS.push(
{ id: "empresa", nome: "Empresa", rotas: [
    { m: "post", path: "/v1/empresas", auth: "Público", desc: "Cadastrar empresa",
      reqBody: { razaoSocial: "Acme Ltda", nomeFantasia: "Acme", inscricaoEstadual: "123456789", cnpj: "00000000000191", responsavel: "Ana Souza", cep: "01001000", logradouro: "Praça da Sé", numero: "100", complemento: "Sala 1", bairro: "Sé", cidade: "São Paulo", estado: "SP", email: "acme@empresa.com", telefone: "11999990000", senha: "Senha@1234", planoId: "<uuid do plano>" },
      resBody: { id: "<uuid>", razaoSocial: "Acme Ltda", plano: "Start" },
      react: `await api("/v1/empresas", { method: "POST", body: dadosEmpresa });`,
      android: `@POST("v1/empresas")
Call<EmpresaResponse> cadastrarEmpresa(@Body EmpresaRequest body);` },
    { m: "get", path: "/v1/empresas/validar-matricula", auth: "Público", desc: "Validar matrícula antes do cadastro (?codigo=A1B2C3)",
      reqBody: null, resBody: { empresaId: "<uuid>", nomeFantasia: "Acme" },
      react: `const empresa = await api("/v1/empresas/validar-matricula?codigo=" + encodeURIComponent(codigo));`,
      android: `@GET("v1/empresas/validar-matricula")
Call<EmpresaDaMatriculaResponse> validarMatricula(@Query("codigo") String codigo);` },
    { m: "get", path: "/v1/empresas/me", auth: "Empresa", desc: "Obter perfil completo da empresa autenticada",
      reqBody: null, resBody: { id: "<uuid>", nomeFantasia: "Acme", email: "acme@empresa.com", telefone: "11999990000", responsavel: "Ana Souza", cidade: "São Paulo" },
      react: `const empresa = await api("/v1/empresas/me");`,
      android: `@GET("v1/empresas/me")
Call<EmpresaResponse> minhaEmpresa();` },
    { m: "get", path: "/v1/empresas/{id}", auth: "Empresa/Admin", desc: "Consultar empresa por ID; a API valida a titularidade",
      reqBody: null, resBody: { id: "<uuid>", nomeFantasia: "Acme", email: "acme@empresa.com", telefone: "11999990000" },
      react: `const empresa = await api("/v1/empresas/" + empresaId);`,
      android: `@GET("v1/empresas/{id}")
Call<EmpresaResponse> empresa(@Path("id") String id);` },
    { m: "patch", path: "/v1/empresas/me", auth: "Empresa", desc: "Atualizar contato/endereço da empresa autenticada",
      reqBody: { nomeFantasia: "Acme Saúde", responsavel: "Ana Souza", telefone: "11999990000", cidade: "São Paulo" },
      resBody: { id: "<uuid>", nomeFantasia: "Acme Saúde", telefone: "11999990000" },
      react: `await api("/v1/empresas/me", { method: "PATCH", body: alteracoes });`,
      android: `@PATCH("v1/empresas/me")
Call<EmpresaResponse> atualizarEmpresa(@Body EmpresaPerfilRequest body);` },
    { m: "patch", path: "/v1/empresas/{id}", auth: "Empresa/Admin", desc: "Atualizar empresa por ID; a API valida a titularidade",
      reqBody: { telefone: "11999990000", responsavel: "Ana Souza" },
      resBody: { id: "<uuid>", telefone: "11999990000" },
      react: `await api("/v1/empresas/" + id, { method: "PATCH", body: alteracoes });`,
      android: `@PATCH("v1/empresas/{id}")
Call<EmpresaResponse> atualizarEmpresa(@Path("id") String id, @Body EmpresaPerfilRequest body);` },
    { m: "post", path: "/v1/empresas/{id}/matriculas", auth: "Empresa/Admin", desc: "Gerar matrículas (?quantidade=5); resposta 201 Created",
      reqBody: null,
      resBody: [{ id: "<uuid>", codigo: "A1B2C3", utilizada: false, beneficiarioId: null, beneficiarioNome: null }],
      react: `await api("/v1/empresas/" + empresaId + "/matriculas?quantidade=5", { method: "POST" });`,
      android: `@POST("v1/empresas/{id}/matriculas")
Call<List<MatriculaResponse>> gerarMatriculas(@Path("id") String empresaId, @Query("quantidade") int quantidade);` },
    { m: "post", path: "/v1/empresas/me/matriculas", auth: "Empresa", desc: "Gerar matrículas da empresa autenticada (?quantidade=5); resposta 201 Created",
      reqBody: null,
      resBody: [{ id: "<uuid>", codigo: "A1B2C3", utilizada: false, beneficiarioId: null, beneficiarioNome: null }],
      react: `const matriculas = await api("/v1/empresas/me/matriculas?quantidade=5", { method: "POST" });`,
      android: `@POST("v1/empresas/me/matriculas")
Call<List<MatriculaResponse>> gerarMinhasMatriculas(@Query("quantidade") int quantidade);` },
    { m: "get", path: "/v1/empresas/me/matriculas", auth: "Empresa", desc: "Listar todas as matrículas da empresa autenticada, inclusive após atualizar a página",
      reqBody: null,
      resBody: [{ id: "<uuid>", codigo: "A1B2C3", utilizada: true, beneficiarioId: "<uuid>", beneficiarioNome: "Maria Silva" }],
      react: `const matriculas = await api("/v1/empresas/me/matriculas");`,
      android: `@GET("v1/empresas/me/matriculas")
Call<List<MatriculaResponse>> minhasMatriculas();` },
    { m: "get", path: "/v1/empresas/{id}/matriculas", auth: "Empresa/Admin", desc: "Listar matrículas da empresa; a API valida a titularidade",
      reqBody: null,
      resBody: [{ id: "<uuid>", codigo: "A1B2C3", utilizada: true, beneficiarioId: "<uuid>", beneficiarioNome: "Maria Silva" }],
      react: `const matriculas = await api("/v1/empresas/" + empresaId + "/matriculas");`,
      android: `@GET("v1/empresas/{id}/matriculas")
Call<List<MatriculaResponse>> listarMatriculas(@Path("id") String empresaId);` },
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
Call<DashboardResponse> getDashboard(@Path("id") String empresaId);` },
    { m: "delete", path: "/v1/clientes/{id}", auth: "Empresa", desc: "Excluir um funcionário da própria empresa; remove também os agendamentos dele",
      reqBody: null, resBody: "204 No Content",
      react: `await api("/v1/clientes/" + clienteId, { method: "DELETE" });`,
      android: `@DELETE("v1/clientes/{id}")
Call<Void> excluirFuncionario(@Path("id") String clienteId);` }
  ]}
);
