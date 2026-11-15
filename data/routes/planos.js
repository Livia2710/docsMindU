window.MINDU_ROUTE_GROUPS = window.MINDU_ROUTE_GROUPS || [];
window.MINDU_ROUTE_GROUPS.push(
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
  ]}
);
