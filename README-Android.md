# MindUApp Android

Guia local do aplicativo Android. Este documento descreve a integração existente; não atualize Gradle, AGP nem dependências para seguir estes passos.

## Pré-requisitos

- Android Studio compatível com o AGP do projeto (`9.0.0`, declarado em `gradle/libs.versions.toml`). A tabela oficial de compatibilidade lista Android Studio Otter 3 Feature Drop (2025.2.3) como versão mínima que aceita AGP 9.0. O repositório não registra qual versão é a mais antiga efetivamente usada pelo grupo; confirme essa informação com a equipe antes de padronizar a instalação.
- JDK e SDK Android configurados pelo Android Studio; SDK de compilação 36 e `minSdk 25`.
- Um emulador Android com câmera virtual habilitada ou um dispositivo físico.

Consulte a [compatibilidade oficial Android Studio/AGP](https://developer.android.com/build/releases/about-agp#android_gradle_plugin_and_android_studio_compatibility). Ao abrir o projeto, recuse sugestões automáticas para atualizar versões do build.

## Backend local

Suba API e banco no computador de desenvolvimento com `docker compose -f docker-compose.local.yml up --build`. A base usada no emulador é `http://10.0.2.2:8080/`; `localhost` dentro do emulador aponta para o próprio emulador. A hospedagem Render está indisponível no momento. O projeto Android usa essa base local em `RetrofitClient`.

O `RetrofitClient` existente adiciona `Authorization: Bearer` nas chamadas autenticadas. O JWT vence em uma hora e não há refresh; a camada de rede encerra a sessão em 401. Em 429, respeite `Retry-After`; chamadas de login/chat também tratam o limite na tela.

## Contas e aprovação

Seeds locais de Admin (e-mails): `livia@mindu.local`, `sabrina@mindu.local`, `manuela@mindu.local`, `tinin@mindu.local`. A senha é configurada fora do repositório por `MINDU_ADMIN_SENHA`; nunca coloque-a neste arquivo.

- Empresa: cadastro → aprovação por Admin → login → criação de matrículas.
- Cliente: cadastro vinculado a uma Empresa com matrícula → aprovação pela Empresa → login. Preencha os dados solicitados pelo fluxo do app.
- Profissional: cadastro com carteirinha → aprovação por Admin → login → perfil, locais e disponibilidade.
- Admin: login → revisão de empresas, profissionais e clientes.

Use contas fictícias criadas no banco local. O cadastro de clientes depende de uma Empresa ativa e de matrícula válida; o de profissionais depende de aprovação do Admin.

## Câmera, imagens e áudio

No emulador, abra **Extended controls → Camera** e escolha uma webcam ou cena virtual. Se a câmera estiver escura, habilite uma fonte de câmera nas configurações do emulador. O app pede permissão de câmera em runtime; também é possível escolher pela galeria/seletor do sistema.

Fotos de perfil de Cliente, Empresa e Admin ficam somente no armazenamento interno do app (`filesDir`), em arquivo associado ao `id` recebido em `/v1/auth/me`. Logout mantém a foto; “Remover foto” apaga. Esses perfis não têm rota de imagem na API. Profissional continua usando a foto da API (`PATCH /v1/profissionais/{id}/perfil` e `GET /v1/profissionais/{id}/foto`). A carteirinha profissional é enviada como multipart PNG/JPEG até 5 MB. O chat Android envia áudio M4A/MP4 até 10 MB.

## Compilar

No PowerShell, na raiz do app: `.\gradlew.bat assembleDebug`. Os detalhes da API e da coleção Postman estão no [inventário de rotas](docs/api-inventario.html) e [tutorial](tutorial.html).
