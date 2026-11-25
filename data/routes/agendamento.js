window.MINDU_ROUTE_GROUPS = window.MINDU_ROUTE_GROUPS || [];
window.MINDU_ROUTE_GROUPS.push(
{ id: "agendamento", nome: "Agendamento", rotas: [
    { m: "post", path: "/v1/agendamentos", auth: "Cliente", desc: "Agendar uma consulta",
      reqBody: { profissionalId: "<uuid>", dataHora: "2026-10-20T09:00:00", modalidade: "VIRTUAL" },
      resBody: { id: "<uuid>", clienteId: "<uuid>", clienteNome: "Maria Silva", profissionalId: "<uuid>", profissionalNome: "Dr. João Lima", status: "AGENDADO", dataHora: "2026-10-20T09:00:00", modalidade: "VIRTUAL" },
      react: `await api("/v1/agendamentos", { method: "POST", body: dadosAgendamento });`,
      android: `@POST("v1/agendamentos")
Call<AgendamentoResponse> agendar(@Body AgendamentoRequest body);` },
    { m: "get", path: "/v1/agendamentos/meus", auth: "Cliente", desc: "Meus agendamentos; filtro mensal opcional ?data=2026-10",
      reqBody: null,
      resBody: [{ id: "<uuid>", clienteId: "<uuid>", clienteNome: "Maria Silva", profissionalId: "<uuid>", profissionalNome: "Dr. João Lima", status: "AGENDADO", dataHora: "2026-10-05T10:00:00" }],
      react: `const meus = await api("/v1/agendamentos/meus?data=2026-10");`,
      android: `@GET("v1/agendamentos/meus")
Call<List<AgendamentoResponse>> meusAgendamentos(@Query("data") String anoMes);` },
    { m: "get", path: "/v1/agendamentos/minha-agenda", auth: "Profissional", desc: "Agenda própria; filtro mensal opcional ?data=2026-10",
      reqBody: null,
      resBody: [{ id: "<uuid>", clienteId: "<uuid>", clienteNome: "Maria Silva", profissionalId: "<uuid>", profissionalNome: "Dr. João Lima", status: "AGENDADO", dataHora: "2026-10-20T09:00:00" }],
      react: `const agenda = await api("/v1/agendamentos/minha-agenda?data=2026-10");`,
      android: `@GET("v1/agendamentos/minha-agenda")
Call<List<AgendamentoResponse>> minhaAgenda(@Query("data") String anoMes);` },
    { m: "patch", path: "/v1/agendamentos/{id}/cancelamento", auth: "Cliente/Profissional/Admin", desc: "Cancelar um agendamento",
      reqBody: null,
      resBody: { id: "<uuid>", status: "CANCELADO" },
      react: `await api("/v1/agendamentos/" + id + "/cancelamento", { method: "PATCH" });`,
      android: `@PATCH("v1/agendamentos/{id}/cancelamento")
Call<AgendamentoResponse> cancelar(@Path("id") String id);` },
    { m: "patch", path: "/v1/agendamentos/{id}/horario", auth: "Cliente/Profissional/Admin", desc: "Reagendar uma consulta; novo horário vai no body",
      reqBody: { dataHora: "2026-10-21T09:00:00" },
      resBody: { id: "<uuid>", status: "AGENDADO", dataHora: "2026-10-21T09:00:00" },
      react: `await api("/v1/agendamentos/" + id + "/horario", {
  method: "PATCH",
  body: { dataHora: "2026-10-21T09:00:00" }
});`,
      android: `@PATCH("v1/agendamentos/{id}/horario")
Call<AgendamentoResponse> reagendar(@Path("id") String id, @Body ReagendarRequest body);` },
    { m: "patch", path: "/v1/agendamentos/{id}/realizacao", auth: "Profissional/Admin", desc: "Marcar consulta como realizada; permitido ao profissional dono do agendamento ou Admin. Só funciona quando o status atual é AGENDADO.",
      reqBody: null,
      resBody: { id: "<uuid>", clienteId: "<uuid>", clienteNome: "Maria Silva", profissionalId: "<uuid>", profissionalNome: "Dr. João Lima", status: "REALIZADO", dataHora: "2026-10-20T09:00:00", modalidade: "VIRTUAL", linkOnline: "https://consulta.exemplo" },
      react: `const realizado = await api("/v1/agendamentos/" + id + "/realizacao", { method: "PATCH" });`,
      android: `@PATCH("v1/agendamentos/{id}/realizacao")
Call<AgendamentoResponse> marcarRealizado(@Path("id") String id);` },
    { m: "patch", path: "/v1/agendamentos/{id}/link-online", auth: "Profissional/Admin", desc: "Definir link HTTPS para consulta virtual; profissional dono do agendamento ou Admin.", reqBody: { linkOnline: "https://consulta.exemplo.test/sala" }, resBody: { id: "<uuid>", linkOnline: "https://consulta.exemplo.test/sala" }, react: `await api("/v1/agendamentos/" + id + "/link-online", { method: "PATCH", body: { linkOnline: "https://consulta.exemplo.test/sala" } });`, android: `@PATCH("v1/agendamentos/{id}/link-online")\nCall<AgendamentoResponse> definirLinkOnline(@Path("id") String id, @Body LinkOnlineRequest body);` }
  ]}
);


