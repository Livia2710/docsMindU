window.MINDU_ROUTE_GROUPS = window.MINDU_ROUTE_GROUPS || [];
window.MINDU_ROUTE_GROUPS.push(
{ id: "auth", nome: "Autenticação", rotas: [
    { m: "post", path: "/v1/auth/login", auth: "Público", desc: "Login — normaliza o e-mail (trim + minúsculas) e retorna JWT válido por 1 hora; não há refresh token",
      reqBody: { email: "cliente@empresa.com", senha: "Senha@1234" },
      resBody: { token: "eyJhbGciOiJIUzI1NiJ9...", tipo: "CLIENTE" },
      react: `const { token, tipo } = await api("/v1/auth/login", {
  method: "POST",
  body: { email, senha }
});
localStorage.setItem("mindu_token", token);

// O login retorna token/tipo. Busque nome e ID com o token recém-salvo.
const conta = await api("/v1/auth/me");
// use conta.id, conta.nome, conta.email para preencher o app`,
      android: `@POST("v1/auth/login")
Call<LoginResponse> login(@Body LoginRequest body);

// uso:
api.login(new LoginRequest(email, senha)).enqueue(new Callback<>() {
    public void onResponse(Call<LoginResponse> call, Response<LoginResponse> res) {
        String token = res.body().getToken();
        SharedPreferences securePrefs = RetrofitClient.getSecurePreferences(context);
        securePrefs.edit().putString("token", token).apply();
        api.minhaConta().enqueue(new Callback<>() {
            public void onResponse(Call<MinhaContaResponse> call, Response<MinhaContaResponse> perfil) {
                if (perfil.isSuccessful()) {
                    MinhaContaResponse conta = perfil.body(); // id, nome, email, tipo
                }
            }
            public void onFailure(Call<MinhaContaResponse> call, Throwable error) { }
        });
    }
});` },
    { m: "post", path: "/v1/auth/esqueci-senha", auth: "Público", desc: "Solicitar link de recuperação. A resposta é igual para e-mails existentes e inexistentes; conta ativa recebe link de uso único válido por 15 minutos.",
      reqBody: { email: "usuario@email.com" },
      resBody: { mensagem: "Se o e-mail estiver cadastrado, enviaremos um link para redefinir sua senha." },
      react: `const resposta = await api("/v1/auth/esqueci-senha", {
  method: "POST",
  body: { email }
});
// Sempre mostre a mensagem genérica da API; ela não confirma se a conta existe.
setMensagem(resposta.mensagem);`,
      android: `@POST("v1/auth/esqueci-senha")
Call<MensagemResponse> solicitarRecuperacao(@Body SolicitarRecuperacaoRequest body);

// MensagemResponse contém o campo String mensagem.
api.solicitarRecuperacao(new SolicitarRecuperacaoRequest(email)).enqueue(callback);` },
    { m: "post", path: "/v1/auth/redefinir-senha", auth: "Público", desc: "Definir nova senha usando o token recebido no link por e-mail; sucesso retorna 204 No Content.",
      reqBody: { token: "token-recebido-no-link", novaSenha: "NovaSenha123!" },
      resBody: null,
      react: `const token = new URLSearchParams(window.location.search).get("token");
if (!token) throw new Error("Link de recuperação inválido");

await api("/v1/auth/redefinir-senha", {
  method: "POST",
  body: { token, novaSenha }
});
// A resposta é 204; depois do sucesso, encaminhe para o login.`,
      android: `@POST("v1/auth/redefinir-senha")
Call<Void> redefinirSenha(@Body RedefinirSenhaRequest body);

// Extraia "token" do link/deep link e envie junto com a nova senha.
api.redefinirSenha(new RedefinirSenhaRequest(token, novaSenha)).enqueue(callback);` },
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
  ]}
);
