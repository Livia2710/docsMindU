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
