# MindU · Documentação da API

Página de documentação para quem vai **consumir a API do MindU**: o site em React (Sabrina) e o aplicativo Android (Manoela).

Cada rota mostra o método, o caminho, quem pode chamar (público, cliente, empresa etc.), o corpo da requisição, um exemplo de resposta e um trecho de código pronto para copiar, com uma aba para React e outra para Android (Retrofit).

## Links

| O quê | Onde |
|---|---|
| **Documentação publicada (GitHub Pages)** | [Link do Pages](https://livia2710.github.io/docsMindU/) |
| **Repositório da API (backend)** | [Link do Repositório](https://github.com/Livia2710/javaMindU.git) |
| **API em produção (Web)** | https://mindu-api.onrender.com |


## Para que serve

- Consultar quais rotas existem e como chamá-las.
- Copiar o código de integração para React e Android.
- Alternar entre o ambiente **Local** e **Web** e ver todos os exemplos atualizarem de uma vez.
- Usar em modo claro ou escuro, seguindo o sistema ou escolhendo no botão do topo.
- Pedir novas rotas ou apontar problemas em rotas existentes, direto pelas Issues deste repositório.

## Ambientes

| Ambiente | Endereço | Observação |
|---|---|---|
| Local | `http://localhost:8080` | Precisa do backend rodando (`docker compose up`). No emulador Android, use `http://10.0.2.2:8080`. |
| Web | `https://mindu-api.onrender.com` | Sempre disponível, mas a primeira chamada do dia pode levar até 1 minuto, porque o serviço "dorme" quando fica sem uso. |

Toda rota, exceto as marcadas como **Público**, exige o cabeçalho `Authorization: Bearer <token>`, obtido no login.

## Como pedir uma nova rota ou reportar um problema

- **Falta uma rota** (por exemplo, um `DELETE`): clique em **＋ Pedir nova rota** no topo da página. Abre uma Issue já com um modelo para preencher.
- **Problema em uma rota existente**: abra a rota e clique em **Encontrou um problema ou precisa de ajuste nesta rota?**. A Issue já vem com o método e o caminho preenchidos.

As Issues servem também como lista do que ainda precisa ser implementado na API.

## Estrutura do projeto

```
.
├── index.html                      # estrutura da página
├── style.css                       # estilos e paleta (claro/escuro)
├── script.js                       # dados das rotas e montagem da página
├── mindu-modelagem.html            # artefato de modelagem (link de download no topo)
├── mindu-postman-collection.json   # coleção Postman (link de download no topo)
└── README.md
```

> Ajuste os nomes acima se algum arquivo do repositório tiver outro nome.

## Como rodar localmente

É uma página estática, sem build nem dependências. Basta servir a pasta:

- **VS Code:** extensão Live Server, botão direito em `index.html` → *Open with Live Server*.
- **Python:** `python -m http.server 5500` e abra `http://localhost:5500`.

## Como adicionar ou editar uma rota

Todas as rotas ficam no array `RESOURCES`, em `script.js`. Para adicionar uma, inclua um objeto no grupo certo:

```js
{
  m: "delete",                          // get | post | put | patch | delete
  path: "/v1/agendamentos/{id}",
  auth: "Cliente",                      // quem pode chamar
  desc: "Excluir um agendamento",
  reqBody: null,                        // objeto de exemplo, ou null
  resBody: null,                        // exemplo da resposta
  react: `await api("/v1/agendamentos/" + id, { method: "DELETE" });`,
  android: `@DELETE("v1/agendamentos/{id}")
Call<Void> excluir(@Path("id") String id);`
}
```

O menu lateral, os badges coloridos por método e o link de Issue da rota são gerados automaticamente.

## Publicação (GitHub Pages)

1. No repositório, vá em **Settings → Pages**.
2. Em *Build and deployment*, escolha **Deploy from a branch**.
3. Selecione a branch `main` e a pasta `/ (root)`, e salve.
4. Após alguns instantes, o site fica disponível no endereço mostrado nessa mesma tela. Cole esse endereço na tabela de links acima.

## Equipe

- **Sabrina**: front-end web (React)
- **Manoela**: aplicativo Android
