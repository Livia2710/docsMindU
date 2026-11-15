window.MINDU_ROUTE_GROUPS = window.MINDU_ROUTE_GROUPS || [];
window.MINDU_ROUTE_GROUPS.push(
{ id: "chat", nome: "Chatbot Mila", rotas: [
    { m: "post", path: "/v1/chat", auth: "Autenticado", desc: "Envia uma mensagem de texto à Mila. Requer JWT; histórico é enviado pelo próprio cliente e não fica salvo no servidor.",
      reqBody: { message: "O que é o MindU?", history: [{ role: "user", content: "Olá" }, { role: "assistant", content: "Oi! Como posso ajudar?" }] },
      resBody: { response: "O MindU é...", intent: "sobre_mindu", sources: [], missing_info: false, debug_info: {}, transcription: null },
      react: `const resultado = await api("/v1/chat", {
  method: "POST",
  body: { message: texto, history }
});
mostrarMensagemMila(resultado.response);`,
      android: `@POST("v1/chat")
Call<ChatResponse> enviarMensagem(@Body ChatRequest body);

// ChatRequest: message (String), history (List<ChatTurn>).
// Inclua o JWT no interceptor de autenticação já usado pelo app.` },
    { m: "post", path: "/v1/chat/audio", auth: "Autenticado", desc: "Envia áudio para transcrição e resposta da Mila. multipart/form-data com file obrigatório, message e history opcionais. Imagens e PDFs não são suportados.",
      isForm: true, reqBody: { file: "arquivo de áudio", message: "(opcional) texto adicional", history: "(opcional) histórico em JSON" },
      resBody: { response: "...", intent: "normal", sources: [], missing_info: false, debug_info: {}, transcription: "texto reconhecido" },
      react: `const form = new FormData();
form.append("file", arquivoAudio);
form.append("history", JSON.stringify(history));
const resultado = await api("/v1/chat/audio", {
  method: "POST", body: form, isFormData: true
});
// Não defina Content-Type manualmente; o navegador inclui o boundary.`,
      android: `@Multipart
@POST("v1/chat/audio")
Call<ChatResponse> enviarAudio(
    @Part MultipartBody.Part file,
    @Part("message") RequestBody message,
    @Part("history") RequestBody historyJson
);

// historyJson é a lista de turnos serializada como JSON.
// Não inclua chave interna da Mila no app.` }
  ]}
);
