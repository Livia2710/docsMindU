window.MINDU_ROUTE_GROUPS = window.MINDU_ROUTE_GROUPS || [];
window.MINDU_ROUTE_GROUPS.push({ id: "conta", nome: "Conta", rotas: [
  { m: "post", path: "/v1/conta/solicitacao-exclusao", auth: "Cliente/Empresa/Profissional", desc: "Solicitar exclusão da conta autenticada; desativa a conta imediatamente e cria solicitação para análise. Admin não pode chamar esta rota.", reqBody: null, resBody: { id: "<uuid>", status: "PENDENTE" }, react: `const solicitacao = await api("/v1/conta/solicitacao-exclusao", { method: "POST" });`, android: `@POST("v1/conta/solicitacao-exclusao")\nCall<SolicitacaoExclusaoResponse> solicitarExclusao();` }
]});
