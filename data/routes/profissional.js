window.MINDU_ROUTE_GROUPS = window.MINDU_ROUTE_GROUPS || [];
window.MINDU_ROUTE_GROUPS.push(
{ id: "profissional", nome: "Profissional", rotas: [
    { m: "post", path: "/v1/profissionais", auth: "Público", desc: "Cadastro — multipart/form-data (campos soltos + foto)", isForm: true,
      reqBody: { nome: "João Lima", email: "joao@mindu.com", senha: "Senha@1234", tipo: "(opcional)", tags: "(opcional)", fotoCarteirinha: "(opcional)" },
      resBody: { id: "<uuid>", status: "PENDENTE" },
      react: `const form = new FormData();
form.append("nome", nome);
form.append("email", email);
form.append("senha", senha);
if (tipo) form.append("tipo", tipo); // opcional no cadastro inicial
tags.forEach(t => form.append("tags", t)); // opcional; repita a chave por tag
if (arquivoInput.files[0]) form.append("fotoCarteirinha", arquivoInput.files[0]);

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
    { m: "get", path: "/v1/profissionais/conta/perfil", auth: "Profissional", desc: "Consultar perfil da conta profissional autenticada",
      reqBody: null, resBody: { id: "<uuid>", nome: "João Lima", bio: "Atendimento acolhedor", tipo: "PSICOLOGO", tags: ["ansiedade"], status: "PENDENTE" },
      react: `const perfil = await api("/v1/profissionais/conta/perfil");`,
      android: `@GET("v1/profissionais/conta/perfil")
Call<ProfissionalResponse> meuPerfil();` },
    { m: "patch", path: "/v1/profissionais/{id}", auth: "Profissional", desc: "Atualizar dados textuais do próprio perfil",
      reqBody: { nome: "João Lima", telefone: "11999990000", bio: "Atendimento acolhedor", tipo: "PSICOLOGO", tags: ["ansiedade"] },
      resBody: { id: "<uuid>", nome: "João Lima", bio: "Atendimento acolhedor", tags: ["ansiedade"] },
      react: `await api("/v1/profissionais/" + id, { method: "PATCH", body: dadosPerfil });`,
      android: `@PATCH("v1/profissionais/{id}")
Call<ProfissionalResponse> atualizarPerfil(@Path("id") String id, @Body ProfissionalPerfilRequest body);` },
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
    { m: "patch", path: "/v1/profissionais/{id}/perfil", auth: "Profissional", desc: "Enviar foto/banner: PNG ou JPEG até 5 MB cada", isForm: true,
      reqBody: { foto: "(arquivo opcional)", fotoBanner: "(arquivo opcional)" },
      resBody: { id: "<uuid>", nome: "João Lima", status: "APROVADO" },
      react: `const form = new FormData();
if (foto) form.append("foto", foto);
if (banner) form.append("fotoBanner", banner);
await api("/v1/profissionais/" + id + "/perfil", { method: "PATCH", body: form, isFormData: true });`,
      android: `@Multipart
@PATCH("v1/profissionais/{id}/perfil")
Call<ProfissionalResponse> enviarImagens(@Path("id") String id,
    @Part MultipartBody.Part foto, @Part MultipartBody.Part fotoBanner);` },
    { m: "get", path: "/v1/profissionais", auth: "Público", desc: "Buscar profissionais aprovados (?modalidade=&nome=&especialidade=)",
      reqBody: null,
      resBody: [{ id: "<uuid>", nome: "Dr. João Lima", tipo: "PSICOLOGO", tags: ["ansiedade"], modalidades: ["VIRTUAL", "PRESENCIAL"] }],
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
      resBody: "Imagem PNG em bytes (resposta binária, não é JSON)",
      react: `const fotoUrl = BASE_URL + "/v1/profissionais/" + profissionalId + "/foto";`,
      android: `@GET("v1/profissionais/{id}/foto")
Call<ResponseBody> foto(@Path("id") String id);` },
    { m: "get", path: "/v1/profissionais/{id}/banner", auth: "Público", desc: "Baixar o banner do profissional aprovado",
      reqBody: null,
      resBody: "Imagem PNG em bytes (resposta binária, não é JSON)",
      react: `const bannerUrl = BASE_URL + "/v1/profissionais/" + profissionalId + "/banner";`,
      android: `@GET("v1/profissionais/{id}/banner")
Call<ResponseBody> banner(@Path("id") String id);` }
  ]}
);
