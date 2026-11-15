window.MINDU_ROUTE_GROUPS = window.MINDU_ROUTE_GROUPS || [];
window.MINDU_ROUTE_GROUPS.push(
{ id: "cliente", nome: "Cliente", rotas: [
    { m: "post", path: "/v1/clientes", auth: "Público", desc: "Cadastro — etapa 1 (com matrícula)",
      reqBody: { nome: "Maria Silva", email: "maria@email.com", senha: "Senha@1234", empresaId: "<uuid>", matricula: "A1B2C3" },
      resBody: { id: "<uuid>", empresaId: "<uuid>", status: "AGUARDANDO_APROVACAO", ativo: true, dataCadastro: "2026-11-15T10:30:00" },
      react: `await api("/v1/clientes", { method: "POST", body: dadosCliente });`,
      android: `@POST("v1/clientes")
Call<ClienteResponse> cadastrarCliente(@Body ClienteRequest body);` },
    { m: "get", path: "/v1/clientes/me", auth: "Cliente", desc: "Obter meu perfil sem enviar o ID na URL",
      reqBody: null,
      resBody: { id: "<uuid>", nome: "Maria Silva", email: "maria@email.com", empresaId: "<uuid>", status: "APROVADO", ativo: true, dataCadastro: "2026-11-15T10:30:00" },
      react: `const perfil = await api("/v1/clientes/me");`,
      android: `@GET("v1/clientes/me")
Call<ClienteResponse> meuPerfil();` },
    { m: "get", path: "/v1/clientes/me/dados-sensiveis", auth: "Cliente", desc: "Ler CNS, nascimento, nome da mãe e gênero do próprio perfil",
      reqBody: null,
      resBody: { cns: "898001234567890", dataNascimento: "1995-03-20", nomeMae: "Ana Silva", genero: "FEMININO" },
      react: `const dados = await api("/v1/clientes/me/dados-sensiveis");`,
      android: `@GET("v1/clientes/me/dados-sensiveis")
Call<DadosSensiveisResponse> meusDadosSensiveis();` },
    { m: "get", path: "/v1/clientes/{id}", auth: "Cliente/Admin", desc: "Consultar perfil por ID; cliente acessa apenas o próprio cadastro",
      reqBody: null, resBody: { id: "<uuid>", nome: "Maria Silva", email: "maria@email.com", telefone: "11999990000", empresaId: "<uuid>", status: "APROVADO", ativo: true, dataCadastro: "2026-11-15T10:30:00" },
      react: `const perfil = await api("/v1/clientes/" + id);`,
      android: `@GET("v1/clientes/{id}")
Call<ClienteResponse> cliente(@Path("id") String id);` },
    { m: "patch", path: "/v1/clientes/me", auth: "Cliente", desc: "Atualizar telefone/endereço do próprio perfil sem enviar ID",
      reqBody: { telefone: "11999990000", cep: "01001000", logradouro: "Praça da Sé", cidade: "São Paulo", estado: "SP" },
      resBody: { id: "<uuid>", telefone: "11999990000", cidade: "São Paulo", ativo: true, dataCadastro: "2026-11-15T10:30:00" },
      react: `await api("/v1/clientes/me", { method: "PATCH", body: contato });`,
      android: `@PATCH("v1/clientes/me")
Call<ClienteResponse> atualizarMeuPerfil(@Body ClientePerfilRequest body);` },
    { m: "patch", path: "/v1/clientes/me/dados-sensiveis", auth: "Cliente", desc: "Enviar dados sensíveis do próprio perfil; identidade vem do token",
      reqBody: { cns: "898001234567890", dataNascimento: "1995-03-20", nomeMae: "Ana Silva", genero: "FEMININO" },
      resBody: { id: "<uuid>", status: "APROVADO", ativo: true, dataCadastro: "2026-11-15T10:30:00" },
      react: `await api("/v1/clientes/me/dados-sensiveis", { method: "PATCH", body: dados });`,
      android: `@PATCH("v1/clientes/me/dados-sensiveis")
Call<ClienteResponse> completarMeuPerfil(@Body DadosSensiveisRequest body);` },
    { m: "patch", path: "/v1/clientes/{id}/aprovacao", auth: "Empresa", desc: "Aprovar ou rejeitar o cliente (?aprovado=true)",
      reqBody: null,
      resBody: { id: "<uuid>", status: "APROVADO", ativo: true, dataCadastro: "2026-11-15T10:30:00" },
      react: `await api("/v1/clientes/" + id + "/aprovacao?aprovado=true", { method: "PATCH" });`,
      android: `@PATCH("v1/clientes/{id}/aprovacao")
Call<ClienteResponse> aprovarCliente(@Path("id") String id, @Query("aprovado") boolean aprovado);` },
    { m: "patch", path: "/v1/clientes/{id}", auth: "Cliente/Admin", desc: "Atualizar telefone/endereço do cliente; a API valida titularidade",
      reqBody: { telefone: "11999990000", cep: "01001000", cidade: "São Paulo" },
      resBody: { id: "<uuid>", telefone: "11999990000", cidade: "São Paulo", ativo: true, dataCadastro: "2026-11-15T10:30:00" },
      react: `await api("/v1/clientes/" + id, { method: "PATCH", body: alteracoes });`,
      android: `@PATCH("v1/clientes/{id}")
Call<ClienteResponse> atualizarCliente(@Path("id") String id, @Body ClientePerfilRequest body);` },
    { m: "patch", path: "/v1/clientes/{id}/dados-sensiveis", auth: "Cliente/Admin", desc: "Cadastro — etapa 2 (CNS, nascimento, gênero)",
      reqBody: { cns: "898001234567890", dataNascimento: "1995-03-20", nomeMae: "Ana Silva", genero: "FEMININO" },
      resBody: { id: "<uuid>", status: "APROVADO", ativo: true, dataCadastro: "2026-11-15T10:30:00" },
      react: `await api("/v1/clientes/" + id + "/dados-sensiveis", { method: "PATCH", body: dados });`,
      android: `@PATCH("v1/clientes/{id}/dados-sensiveis")
Call<ClienteResponse> enviarDadosSensiveis(@Path("id") String id, @Body DadosSensiveisRequest body);` },
    { m: "get", path: "/v1/clientes", auth: "Empresa/Admin", desc: "Listar clientes da empresa autenticada (opcional: ?status=APROVADO)",
      reqBody: null,
      resBody: [{ id: "<uuid>", nome: "Maria Silva", empresaId: "<uuid>", status: "APROVADO", ativo: true, dataCadastro: "2026-11-15T10:30:00" }],
      react: `const clientes = await api("/v1/clientes?status=AGUARDANDO_APROVACAO");`,
      android: `@GET("v1/clientes")
Call<List<ClienteResponse>> listarClientes(@Query("status") String status);` }
  ]}
);
