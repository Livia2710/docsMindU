# Inventário de rotas MindU

Fonte: controllers Spring. 70 mappings.

## Disponíveis, ainda não integradas no app

- `GET /v1/admin/profissionais/{id}/carteirinha`
- `GET /v1/admin/profissionais/{id}/foto`
- `GET /v1/admin/solicitacoes-exclusao`
- `PATCH /v1/admin/empresas/{id}/reativacao`
- `PATCH /v1/admin/profissionais/{id}/reativacao`
- `DELETE /v1/admin/clientes/{id}`
- `PATCH /v1/admin/clientes/{id}/reativacao`
- `PATCH /v1/admin/empresas/{id}/contrato`
- `PATCH /v1/admin/solicitacoes-exclusao/{id}`
- `POST /v1/auth/esqueci-senha`
- `POST /v1/auth/redefinir-senha`
- `GET /v1/clientes/{id}`
- `PATCH /v1/clientes/me`
- `PATCH /v1/clientes/{id}`
- `POST /v1/conta/solicitacao-exclusao`
- `GET /v1/empresas/{id}`
- `PATCH /v1/empresas/me`
- `PATCH /v1/empresas/{id}`
- `GET /v1/empresas/{id}/matriculas`
- `GET /v1/profissionais/conta/perfil`
- `POST /v1/profissionais/{id}/horarios-disponiveis`
- `PATCH /v1/profissionais/{id}/carteirinha`

Fotos de Cliente, Empresa e Admin ficam localmente em filesDir, por id de usuário; não há rota de foto. Profissional usa API.

| Método | Rota | Autorização | Request | Response | Erros possíveis | docs | Postman | Android |
|---|---|---|---|---|---|---|---|---|
| GET | `/v1/admin/profissionais` | Admin | Sem corpo; consulte query/rota; Listar profissionais; filtros opcionais status e ativo. Paginação opcional com page (inicia em 0) e size (1–100); sem esses parâmetros, retorna a lista completa. Quando paginado, leia X-Total-Count, X-Page, X-Page-Size e X-Total-Pages no JavaScript; estão expostos via CORS. | [{"id":"<uuid>","nome":"Dr. João Lima","status":"PENDENTE","ativo":true}] | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Sim (callsite) |
| GET | `/v1/admin/profissionais/{id}/carteirinha` | Admin | Sem corpo; consulte query/rota; Visualizar a carteirinha enviada pelo profissional, inclusive quando estiver pendente | "Imagem PNG em bytes (resposta binária, não é JSON)" | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Não |
| GET | `/v1/admin/profissionais/{id}/foto` | Admin | Sem corpo; consulte query/rota; Visualizar foto de perfil para análise administrativa, inclusive antes da aprovação do profissional | "Imagem PNG em bytes (resposta binária, não é JSON)" | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Não |
| GET | `/v1/admin/profissionais/pendentes` | Admin | Sem corpo; consulte query/rota; Listar profissionais aguardando aprovação; paginação opcional com page (inicia em 0) e size (1–100). Headers X-Total-Count, X-Page, X-Page-Size e X-Total-Pages estão expostos via CORS. | [{"id":"<uuid>","nome":"Dr. João Lima","status":"PENDENTE","ativo":true}] | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Sim (callsite) |
| GET | `/v1/admin/clientes` | Admin | Sem corpo; consulte query/rota; Listar clientes; filtros opcionais status, empresaId e ativo. Paginação opcional com page (inicia em 0) e size (1–100); sem paginação retorna a lista completa. Headers X-Total-Count, X-Page, X-Page-Size e X-Total-Pages são expostos via CORS. | [{"id":"<uuid>","nome":"Maria Silva","empresaId":"<uuid>","status":"APROVADO","ativo":true,"dataCadastro":"2026-11-15T10:30:00"}] | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Sim (callsite) |
| GET | `/v1/admin/empresas` | Admin | Sem corpo; consulte query/rota; Listar empresas; filtro opcional ativo e paginação opcional com page (inicia em 0) e size (1–100). Headers X-Total-Count, X-Page, X-Page-Size e X-Total-Pages estão expostos via CORS. | [{"id":"<uuid>","razaoSocial":"Acme Ltda","plano":"Plano Start","ativo":true}] | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Sim (callsite) |
| GET | `/v1/admin/solicitacoes-exclusao` | Admin | Sem corpo; consulte query/rota; Listar solicitações; filtro opcional status e paginação opcional com page (inicia em 0) e size (1–100). Headers X-Total-Count, X-Page, X-Page-Size e X-Total-Pages estão expostos via CORS. | [{"id":"<uuid>","usuarioId":"<uuid>","email":"maria@email.com","tipoConta":"CLIENTE","status":"PENDENTE","solicitadaEm":"2026-11-15T10:30:00"}] | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Não |
| GET | `/v1/admin/agendamentos` | Admin | Sem corpo; consulte query/rota; Listar agendamentos; filtros opcionais status, clienteId e profissionalId. Paginação opcional com page (inicia em 0) e size (1–100). Headers X-Total-Count, X-Page, X-Page-Size e X-Total-Pages estão expostos via CORS. | [{"id":"<uuid>","clienteId":"<uuid>","clienteNome":"Maria Silva","profissionalId":"<uuid>","profissionalNome":"Dr. João Lima","status":"AGENDADO"}] | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Sim (callsite) |
| DELETE | `/v1/admin/empresas/{id}` | Admin | Sem corpo; consulte query/rota; Desativar a conta da empresa e invalidar seus tokens atuais | "204 No Content" | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Sim (callsite) |
| PATCH | `/v1/admin/empresas/{id}/reativacao` | Admin | Sem corpo; consulte query/rota; Reativar uma empresa desativada; invalida tokens anteriores. Operação idempotente. | "204 No Content" | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Não |
| DELETE | `/v1/admin/profissionais/{id}` | Admin | Sem corpo; consulte query/rota; Desativar a conta profissional e invalidar seus tokens atuais | "204 No Content" | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Interface Retrofit; callsite não localizado |
| PATCH | `/v1/admin/profissionais/{id}/reativacao` | Admin | Sem corpo; consulte query/rota; Reativar uma conta profissional desativada; invalida tokens anteriores. Operação idempotente. | "204 No Content" | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Não |
| DELETE | `/v1/admin/clientes/{id}` | Admin | Sem corpo; consulte query/rota; Desativar a conta do cliente e invalidar seus tokens atuais | "204 No Content" | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Não |
| PATCH | `/v1/admin/clientes/{id}/reativacao` | Admin | Sem corpo; consulte query/rota; Reativar uma conta de cliente desativada; invalida tokens anteriores. Operação idempotente. | "204 No Content" | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Não |
| PATCH | `/v1/admin/empresas/{id}/contrato` | Admin | {"inicioVigencia":"2026-11-01","fimVigencia":null,"diaPagamento":10}; Definir vigência e dia de pagamento do contrato (dia 1–28). | {"id":"<uuid>","inicioVigenciaPlano":"2026-11-01","fimVigenciaPlano":null,"diaPagamento":10} | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Não |
| PATCH | `/v1/admin/solicitacoes-exclusao/{id}` | Admin | {"status":"EM_ANALISE"}; Atualizar análise de solicitação de exclusão. | {"id":"<uuid>","status":"EM_ANALISE"} | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Não |
| POST | `/v1/agendamentos` | Cliente | {"profissionalId":"<uuid>","dataHora":"2026-10-20T09:00:00","modalidade":"VIRTUAL"}; Agendar uma consulta | {"id":"<uuid>","clienteId":"<uuid>","clienteNome":"Maria Silva","profissionalId":"<uuid>","profissionalNome":"Dr. João Lima","status":"AGENDADO","dataHora":"2026-10-20T09:00:00","modalidade":"VIRTUAL"} | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Sim (callsite) |
| GET | `/v1/agendamentos/meus` | Cliente | Sem corpo; consulte query/rota; Meus agendamentos; filtro mensal opcional ?data=2026-10 | [{"id":"<uuid>","clienteId":"<uuid>","clienteNome":"Maria Silva","profissionalId":"<uuid>","profissionalNome":"Dr. João Lima","status":"AGENDADO","dataHora":"2026-10-05T10:00:00"}] | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Sim (callsite) |
| GET | `/v1/agendamentos/minha-agenda` | Profissional | Sem corpo; consulte query/rota; Agenda própria; filtro mensal opcional ?data=2026-10 | [{"id":"<uuid>","clienteId":"<uuid>","clienteNome":"Maria Silva","profissionalId":"<uuid>","profissionalNome":"Dr. João Lima","status":"AGENDADO","dataHora":"2026-10-20T09:00:00"}] | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Sim (callsite) |
| PATCH | `/v1/agendamentos/{id}/cancelamento` | Cliente/Profissional/Admin | Sem corpo; consulte query/rota; Cancelar um agendamento | {"id":"<uuid>","status":"CANCELADO"} | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Sim (callsite) |
| PATCH | `/v1/agendamentos/{id}/horario` | Cliente/Profissional/Admin | {"dataHora":"2026-10-21T09:00:00"}; Reagendar uma consulta; novo horário vai no body | {"id":"<uuid>","status":"AGENDADO","dataHora":"2026-10-21T09:00:00"} | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Sim (callsite) |
| PATCH | `/v1/agendamentos/{id}/realizacao` | Profissional/Admin | Sem corpo; consulte query/rota; Marcar consulta como realizada; permitido ao profissional dono do agendamento ou Admin. Só funciona quando o status atual é AGENDADO. | {"id":"<uuid>","clienteId":"<uuid>","clienteNome":"Maria Silva","profissionalId":"<uuid>","profissionalNome":"Dr. João Lima","status":"REALIZADO","dataHora":"2026-10-20T09:00:00","modalidade":"VIRTUAL","linkOnline":"https://consulta.exemplo"} | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Sim (callsite) |
| PATCH | `/v1/agendamentos/{id}/link-online` | Profissional/Admin | {"linkOnline":"https://consulta.exemplo.test/sala"}; Definir link HTTPS para consulta virtual; profissional dono do agendamento ou Admin. | {"id":"<uuid>","linkOnline":"https://consulta.exemplo.test/sala"} | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Sim (callsite) |
| POST | `/v1/auth/login` | Público | {"email":"cliente@empresa.com","senha":"<placeholder>"}; Login — normaliza o e-mail (trim + minúsculas) e retorna JWT válido por 1 hora; não há refresh token | {"token":"<placeholder>","tipo":"CLIENTE"} | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Sim (callsite) |
| POST | `/v1/auth/esqueci-senha` | Público | {"email":"usuario@email.com"}; Solicitar link de recuperação. A resposta é igual para e-mails existentes e inexistentes; conta ativa recebe link de uso único válido por 15 minutos. | {"mensagem":"Se o e-mail estiver cadastrado, enviaremos um link para redefinir sua senha."} | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Não |
| POST | `/v1/auth/redefinir-senha` | Público | {"token":"<placeholder>","novaSenha":"<placeholder>"}; Definir nova senha usando o token recebido no link por e-mail; sucesso retorna 204 No Content. | "DTO/ResponseEntity" | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Não |
| GET | `/v1/auth/me` | Autenticado | Sem corpo; consulte query/rota; Obter sua conta e tipo pelo token; não envie seu próprio ID na URL | {"id":"<uuid>","nome":"Maria Silva","email":"maria@email.com","tipo":"CLIENTE","status":"APROVADO"} | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Sim (callsite) |
| PUT | `/v1/auth/senha` | Autenticado | {"senhaAtual":"<placeholder>","novaSenha":"<placeholder>"}; Trocar senha informando a senha atual | "DTO/ResponseEntity" | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Interface Retrofit; callsite não localizado |
| POST | `/v1/chat` | Autenticado | {"message":"O que é o MindU?","history":[{"role":"user","content":"Olá"},{"role":"assistant","content":"Oi! Como posso ajudar?"}]}; Envia uma mensagem de texto à Mila. Requer JWT; histórico é enviado pelo próprio cliente e não fica salvo no servidor. | {"response":"O MindU é...","intent":"sobre_mindu","sources":[],"missing_info":false,"debug_info":{},"transcription":null} | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Sim (callsite) |
| POST | `/v1/chat/audio` | Autenticado | {"file":"arquivo de áudio","message":"(opcional) texto adicional","history":"(opcional) histórico em JSON"}; Envia áudio para transcrição e resposta da Mila. multipart/form-data com file obrigatório, message e history opcionais. Imagens e PDFs não são suportados. | {"response":"...","intent":"normal","sources":[],"missing_info":false,"debug_info":{},"transcription":"texto reconhecido"} | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Sim (callsite) |
| POST | `/v1/clientes` | Público | {"nome":"Maria Silva","email":"maria@email.com","senha":"<placeholder>","empresaId":"<uuid>","matricula":"A1B2C3"}; Cadastro — etapa 1 (com matrícula) | {"id":"<uuid>","empresaId":"<uuid>","status":"AGUARDANDO_APROVACAO","ativo":true,"dataCadastro":"2026-11-15T10:30:00"} | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Sim (callsite) |
| GET | `/v1/clientes/me` | Cliente | Sem corpo; consulte query/rota; Obter meu perfil sem enviar o ID na URL | {"id":"<uuid>","nome":"Maria Silva","email":"maria@email.com","empresaId":"<uuid>","status":"APROVADO","ativo":true,"dataCadastro":"2026-11-15T10:30:00"} | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Interface Retrofit; callsite não localizado |
| GET | `/v1/clientes/me/dados-sensiveis` | Cliente | Sem corpo; consulte query/rota; Ler CNS, nascimento, nome da mãe e gênero do próprio perfil | {"cns":"898001234567890","dataNascimento":"1995-03-20","nomeMae":"Ana Silva","genero":"FEMININO"} | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Sim (callsite) |
| GET | `/v1/clientes/{id}` | Cliente/Admin | Sem corpo; consulte query/rota; Consultar perfil por ID; cliente acessa apenas o próprio cadastro | {"id":"<uuid>","nome":"Maria Silva","email":"maria@email.com","telefone":"11999990000","empresaId":"<uuid>","status":"APROVADO","ativo":true,"dataCadastro":"2026-11-15T10:30:00"} | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Não |
| PATCH | `/v1/clientes/me` | Cliente | {"telefone":"11999990000","cep":"01001000","logradouro":"Praça da Sé","cidade":"São Paulo","estado":"SP"}; Atualizar telefone/endereço do próprio perfil sem enviar ID | {"id":"<uuid>","telefone":"11999990000","cidade":"São Paulo","ativo":true,"dataCadastro":"2026-11-15T10:30:00"} | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Não |
| PATCH | `/v1/clientes/me/dados-sensiveis` | Cliente | {"cns":"898001234567890","dataNascimento":"1995-03-20","nomeMae":"Ana Silva","genero":"FEMININO"}; Enviar dados sensíveis do próprio perfil; identidade vem do token | {"id":"<uuid>","status":"APROVADO","ativo":true,"dataCadastro":"2026-11-15T10:30:00"} | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Sim (callsite) |
| PATCH | `/v1/clientes/{id}/aprovacao` | Empresa | Sem corpo; consulte query/rota; Aprovar ou rejeitar o cliente (?aprovado=true) | {"id":"<uuid>","status":"APROVADO","ativo":true,"dataCadastro":"2026-11-15T10:30:00"} | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Sim (callsite) |
| PATCH | `/v1/clientes/{id}` | Cliente/Admin | {"telefone":"11999990000","cep":"01001000","cidade":"São Paulo"}; Atualizar telefone/endereço do cliente; a API valida titularidade | {"id":"<uuid>","telefone":"11999990000","cidade":"São Paulo","ativo":true,"dataCadastro":"2026-11-15T10:30:00"} | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Não |
| PATCH | `/v1/clientes/{id}/dados-sensiveis` | Cliente/Admin | {"cns":"898001234567890","dataNascimento":"1995-03-20","nomeMae":"Ana Silva","genero":"FEMININO"}; Cadastro — etapa 2 (CNS, nascimento, gênero) | {"id":"<uuid>","status":"APROVADO","ativo":true,"dataCadastro":"2026-11-15T10:30:00"} | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Interface Retrofit; callsite não localizado |
| GET | `/v1/clientes` | Empresa/Admin | Sem corpo; consulte query/rota; Listar clientes da empresa autenticada (opcional: ?status=APROVADO) | [{"id":"<uuid>","nome":"Maria Silva","empresaId":"<uuid>","status":"APROVADO","ativo":true,"dataCadastro":"2026-11-15T10:30:00"}] | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Sim (callsite) |
| POST | `/v1/conta/solicitacao-exclusao` | Cliente/Empresa/Profissional | Sem corpo; consulte query/rota; Solicitar exclusão da conta autenticada; desativa a conta imediatamente e cria solicitação para análise. Admin não pode chamar esta rota. | {"id":"<uuid>","status":"PENDENTE"} | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Não |
| POST | `/v1/empresas` | Público | {"razaoSocial":"Acme Ltda","nomeFantasia":"Acme","inscricaoEstadual":"123456789","cnpj":"00000000000191","responsavel":"Ana Souza","cep":"01001000","logradouro":"Praça da Sé","numero":"100","complemento":"Sala 1","bairro":"Sé","cidade":"São Paulo","estado":"SP","email":"acme@empresa.com","telefone":"11999990000","senha":"<placeholder>","planoId":"<uuid do plano>"}; Cadastrar empresa | {"id":"<uuid>","razaoSocial":"Acme Ltda","plano":"Start"} | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Sim (callsite) |
| GET | `/v1/empresas/validar-matricula` | Público | Sem corpo; consulte query/rota; Validar matrícula antes do cadastro (?codigo=A1B2C3) | {"empresaId":"<uuid>","nomeFantasia":"Acme"} | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Sim (callsite) |
| GET | `/v1/empresas/me` | Empresa | Sem corpo; consulte query/rota; Obter perfil completo da empresa autenticada | {"id":"<uuid>","nomeFantasia":"Acme","email":"acme@empresa.com","telefone":"11999990000","responsavel":"Ana Souza","cidade":"São Paulo"} | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Interface Retrofit; callsite não localizado |
| GET | `/v1/empresas/{id}` | Empresa/Admin | Sem corpo; consulte query/rota; Consultar empresa por ID; a API valida a titularidade | {"id":"<uuid>","nomeFantasia":"Acme","email":"acme@empresa.com","telefone":"11999990000"} | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Não |
| PATCH | `/v1/empresas/me` | Empresa | {"nomeFantasia":"Acme Saúde","responsavel":"Ana Souza","telefone":"11999990000","cidade":"São Paulo"}; Atualizar contato/endereço da empresa autenticada | {"id":"<uuid>","nomeFantasia":"Acme Saúde","telefone":"11999990000"} | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Não |
| PATCH | `/v1/empresas/{id}` | Empresa/Admin | {"telefone":"11999990000","responsavel":"Ana Souza"}; Atualizar empresa por ID; a API valida a titularidade | {"id":"<uuid>","telefone":"11999990000"} | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Não |
| POST | `/v1/empresas/{id}/matriculas` | Empresa/Admin | Sem corpo; consulte query/rota; Gerar matrículas (?quantidade=5); resposta 201 Created | [{"id":"<uuid>","codigo":"A1B2C3","utilizada":false,"beneficiarioId":null,"beneficiarioNome":null}] | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Interface Retrofit; callsite não localizado |
| POST | `/v1/empresas/me/matriculas` | Empresa | Sem corpo; consulte query/rota; Gerar matrículas da empresa autenticada (?quantidade=5); resposta 201 Created | [{"id":"<uuid>","codigo":"A1B2C3","utilizada":false,"beneficiarioId":null,"beneficiarioNome":null}] | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Sim (callsite) |
| GET | `/v1/empresas/me/matriculas` | Empresa | Sem corpo; consulte query/rota; Listar todas as matrículas da empresa autenticada, inclusive após atualizar a página | [{"id":"<uuid>","codigo":"A1B2C3","utilizada":true,"beneficiarioId":"<uuid>","beneficiarioNome":"Maria Silva"}] | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Sim (callsite) |
| GET | `/v1/empresas/{id}/matriculas` | Empresa/Admin | Sem corpo; consulte query/rota; Listar matrículas da empresa; a API valida a titularidade | [{"id":"<uuid>","codigo":"A1B2C3","utilizada":true,"beneficiarioId":"<uuid>","beneficiarioNome":"Maria Silva"}] | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Não |
| GET | `/v1/empresas/me/dashboard` | Empresa | Sem corpo; consulte query/rota; Dashboard da empresa autenticada; identidade vem do token | {"matriculasDisponiveis":25,"matriculasUsadas":5} | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Sim (callsite) |
| GET | `/v1/empresas/{id}/dashboard` | Empresa | Sem corpo; consulte query/rota; Contadores do painel da empresa | {"matriculasDisponiveis":25,"matriculasUsadas":5,"clientesAprovados":4} | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Interface Retrofit; callsite não localizado |
| DELETE | `/v1/clientes/{id}` | Empresa | Sem corpo; consulte query/rota; Excluir um funcionário da própria empresa; remove também os agendamentos dele | "204 No Content" | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Sim (callsite) |
| GET | `/v1/planos` | Público | Sem corpo; consulte query/rota; Listar planos disponíveis — use o id retornado em planoId ao cadastrar uma empresa | [{"id":"<uuid do plano>","nome":"Plano Start","vagasTotais":30,"porteIndicado":"Pequeno"}] | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Sim (callsite) |
| POST | `/v1/profissionais` | Público | {"nome":"João Lima","email":"joao@mindu.com","senha":"<placeholder>","tipo":"(opcional)","tags":"(opcional)","fotoCarteirinha":"(obrigatório)"}; Cadastro — multipart/form-data (campos soltos + foto) | {"id":"<uuid>","status":"PENDENTE"} | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Sim (callsite) |
| GET | `/v1/profissionais/me` | Profissional | Sem corpo; consulte query/rota; Consultar perfil da conta profissional autenticada (rota /me recomendada) | {"id":"<uuid>","nome":"João Lima","bio":"Atendimento acolhedor","tipo":"PSICOLOGO","tags":["ansiedade"],"status":"PENDENTE"} | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Sim (callsite) |
| GET | `/v1/profissionais/conta/perfil` | Profissional | Sem corpo; consulte query/rota; Consultar perfil autenticado; rota antiga mantida por compatibilidade, prefira GET /v1/profissionais/me | {"id":"<uuid>","nome":"João Lima","bio":"Atendimento acolhedor","tipo":"PSICOLOGO","tags":["ansiedade"],"status":"PENDENTE"} | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Não |
| PATCH | `/v1/profissionais/{id}` | Profissional | {"nome":"João Lima","telefone":"11999990000","bio":"Atendimento acolhedor","tipo":"PSICOLOGO","tags":["ansiedade"]}; Atualizar dados textuais do próprio perfil | {"id":"<uuid>","nome":"João Lima","bio":"Atendimento acolhedor","tags":["ansiedade"]} | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Sim (callsite) |
| PATCH | `/v1/profissionais/{id}/aprovacao` | Admin | Sem corpo; consulte query/rota; Aprovar ou rejeitar profissional (?aprovado=true) | {"id":"<uuid>","status":"APROVADO"} | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Sim (callsite) |
| POST | `/v1/profissionais/{id}/locais` | Profissional | {"modalidade":"PRESENCIAL","cep":"01001000","logradouro":"Av. Paulista","numero":"1000","bairro":"Bela Vista","cidade":"São Paulo","estado":"SP"}; Adicionar local de atendimento | {"id":"<uuid>","modalidade":"PRESENCIAL"} | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Sim (callsite) |
| PUT | `/v1/profissionais/{id}/disponibilidade` | Profissional | [{"diaSemana":"SEGUNDA","horaInicio":"08:00","horaFim":"12:00"}]; Definir os horários da semana | [{"diaSemana":"SEGUNDA","horaInicio":"08:00","horaFim":"12:00"}] | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Sim (callsite) |
| PATCH | `/v1/profissionais/{id}/perfil` | Profissional | {"foto":"(arquivo opcional)","fotoBanner":"(arquivo opcional)"}; Enviar foto/banner: PNG ou JPEG até 5 MB cada | {"id":"<uuid>","nome":"João Lima","status":"APROVADO"} | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Sim (callsite) |
| GET | `/v1/profissionais` | Público | Sem corpo; consulte query/rota; Buscar profissionais aprovados (?modalidade=&nome=&especialidade=) | [{"id":"<uuid>","nome":"Dr. João Lima","tipo":"PSICOLOGO","tags":["ansiedade"],"modalidades":["VIRTUAL","PRESENCIAL"]}] | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Sim (callsite) |
| GET | `/v1/profissionais/{id}` | Público | Sem corpo; consulte query/rota; Detalhes públicos do profissional, locais e disponibilidade semanal | {"id":"<uuid>","nome":"Dr. João Lima","tipo":"PSICOLOGO","tags":["ansiedade"],"locais":[],"disponibilidadeSemanal":[],"fotoUrl":"/v1/profissionais/<uuid>/foto","bannerUrl":"/v1/profissionais/<uuid>/banner"} | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Sim (callsite) |
| GET | `/v1/profissionais/{id}/horarios-disponiveis` | Público | Sem corpo; consulte query/rota; Recomendado: consultar horários livres com data na query (?data=AAAA-MM-DD); padrão 50 min e fuso America/Sao_Paulo | ["2026-10-20T09:00:00","2026-10-20T09:50:00"] | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Sim (callsite) |
| POST | `/v1/profissionais/{id}/horarios-disponiveis` | Público | {"data":"2026-10-20"}; ⚠️ OBSOLETO — continua funcionando por compatibilidade; novos consumidores devem usar GET /v1/profissionais/{id}/horarios-disponiveis com ?data=AAAA-MM-DD | ["2026-10-20T09:00:00","2026-10-20T09:50:00"] | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Não |
| GET | `/v1/profissionais/{id}/foto` | Público | Sem corpo; consulte query/rota; Baixar a foto de perfil do profissional aprovado | "Imagem PNG em bytes (resposta binária, não é JSON)" | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Sim (callsite) |
| GET | `/v1/profissionais/{id}/banner` | Público | Sem corpo; consulte query/rota; Baixar o banner do profissional aprovado | "Imagem PNG em bytes (resposta binária, não é JSON)" | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Interface Retrofit; callsite não localizado |
| PATCH | `/v1/profissionais/{id}/carteirinha` | Profissional | multipart/form-data: fotoCarteirinha (arquivo obrigatório); Reenviar carteirinha após rejeição; multipart PNG/JPEG/JPG até 5 MB e 12 MP. | {"id":"<uuid>","status":"PENDENTE"} | 400 entrada inválida; 401 token ausente/inválido em rota privada; 403 perfil/escopo; 404 recurso ausente; 409 conflito; 413 multipart acima do limite; 429 login/recuperação com Retry-After; chat: 502/503, upstream Mila pode retornar 422. | Sim | Sim | Não |

Campos obrigatórios, enums e limites estão resumidos no guia e nos DTOs do backend.

## Exemplos curl por rota

- **GET /v1/admin/profissionais**
  `curl -i -X GET 'http://localhost:8080/v1/admin/profissionais' -H 'Authorization: Bearer TOKEN_JWT'`
- **GET /v1/admin/profissionais/{id}/carteirinha**
  `curl -i -X GET 'http://localhost:8080/v1/admin/profissionais/<id>/carteirinha' -H 'Authorization: Bearer TOKEN_JWT'`
- **GET /v1/admin/profissionais/{id}/foto**
  `curl -i -X GET 'http://localhost:8080/v1/admin/profissionais/<id>/foto' -H 'Authorization: Bearer TOKEN_JWT'`
- **GET /v1/admin/profissionais/pendentes**
  `curl -i -X GET 'http://localhost:8080/v1/admin/profissionais/pendentes' -H 'Authorization: Bearer TOKEN_JWT'`
- **GET /v1/admin/clientes**
  `curl -i -X GET 'http://localhost:8080/v1/admin/clientes' -H 'Authorization: Bearer TOKEN_JWT'`
- **GET /v1/admin/empresas**
  `curl -i -X GET 'http://localhost:8080/v1/admin/empresas' -H 'Authorization: Bearer TOKEN_JWT'`
- **GET /v1/admin/solicitacoes-exclusao**
  `curl -i -X GET 'http://localhost:8080/v1/admin/solicitacoes-exclusao' -H 'Authorization: Bearer TOKEN_JWT'`
- **GET /v1/admin/agendamentos**
  `curl -i -X GET 'http://localhost:8080/v1/admin/agendamentos' -H 'Authorization: Bearer TOKEN_JWT'`
- **DELETE /v1/admin/empresas/{id}**
  `curl -i -X DELETE 'http://localhost:8080/v1/admin/empresas/<id>' -H 'Authorization: Bearer TOKEN_JWT'`
- **PATCH /v1/admin/empresas/{id}/reativacao**
  `curl -i -X PATCH 'http://localhost:8080/v1/admin/empresas/<id>/reativacao' -H 'Authorization: Bearer TOKEN_JWT'`
- **DELETE /v1/admin/profissionais/{id}**
  `curl -i -X DELETE 'http://localhost:8080/v1/admin/profissionais/<id>' -H 'Authorization: Bearer TOKEN_JWT'`
- **PATCH /v1/admin/profissionais/{id}/reativacao**
  `curl -i -X PATCH 'http://localhost:8080/v1/admin/profissionais/<id>/reativacao' -H 'Authorization: Bearer TOKEN_JWT'`
- **DELETE /v1/admin/clientes/{id}**
  `curl -i -X DELETE 'http://localhost:8080/v1/admin/clientes/<id>' -H 'Authorization: Bearer TOKEN_JWT'`
- **PATCH /v1/admin/clientes/{id}/reativacao**
  `curl -i -X PATCH 'http://localhost:8080/v1/admin/clientes/<id>/reativacao' -H 'Authorization: Bearer TOKEN_JWT'`
- **PATCH /v1/admin/empresas/{id}/contrato**
  `curl -i -X PATCH 'http://localhost:8080/v1/admin/empresas/<id>/contrato' -H 'Authorization: Bearer TOKEN_JWT' -H 'Content-Type: application/json' --data '{"inicioVigencia":"2026-11-01","fimVigencia":null,"diaPagamento":10}'`
- **PATCH /v1/admin/solicitacoes-exclusao/{id}**
  `curl -i -X PATCH 'http://localhost:8080/v1/admin/solicitacoes-exclusao/<id>' -H 'Authorization: Bearer TOKEN_JWT' -H 'Content-Type: application/json' --data '{"status":"EM_ANALISE"}'`
- **POST /v1/agendamentos**
  `curl -i -X POST 'http://localhost:8080/v1/agendamentos' -H 'Authorization: Bearer TOKEN_JWT' -H 'Content-Type: application/json' --data '{"profissionalId":"<uuid>","dataHora":"2026-10-20T09:00:00","modalidade":"VIRTUAL"}'`
- **GET /v1/agendamentos/meus**
  `curl -i -X GET 'http://localhost:8080/v1/agendamentos/meus?data=2026-10' -H 'Authorization: Bearer TOKEN_JWT'`
- **GET /v1/agendamentos/minha-agenda**
  `curl -i -X GET 'http://localhost:8080/v1/agendamentos/minha-agenda?data=2026-10' -H 'Authorization: Bearer TOKEN_JWT'`
- **PATCH /v1/agendamentos/{id}/cancelamento**
  `curl -i -X PATCH 'http://localhost:8080/v1/agendamentos/<id>/cancelamento' -H 'Authorization: Bearer TOKEN_JWT'`
- **PATCH /v1/agendamentos/{id}/horario**
  `curl -i -X PATCH 'http://localhost:8080/v1/agendamentos/<id>/horario' -H 'Authorization: Bearer TOKEN_JWT' -H 'Content-Type: application/json' --data '{"dataHora":"2026-10-21T09:00:00"}'`
- **PATCH /v1/agendamentos/{id}/realizacao**
  `curl -i -X PATCH 'http://localhost:8080/v1/agendamentos/<id>/realizacao' -H 'Authorization: Bearer TOKEN_JWT'`
- **PATCH /v1/agendamentos/{id}/link-online**
  `curl -i -X PATCH 'http://localhost:8080/v1/agendamentos/<id>/link-online' -H 'Authorization: Bearer TOKEN_JWT' -H 'Content-Type: application/json' --data '{"linkOnline":"https://consulta.exemplo.test/sala"}'`
- **POST /v1/auth/login**
  `curl -i -X POST 'http://localhost:8080/v1/auth/login' -H 'Content-Type: application/json' --data '{"email":"cliente@empresa.com","senha":"<placeholder>"}'`
- **POST /v1/auth/esqueci-senha**
  `curl -i -X POST 'http://localhost:8080/v1/auth/esqueci-senha' -H 'Content-Type: application/json' --data '{"email":"usuario@email.com"}'`
- **POST /v1/auth/redefinir-senha**
  `curl -i -X POST 'http://localhost:8080/v1/auth/redefinir-senha' -H 'Content-Type: application/json' --data '{"token":"<placeholder>","novaSenha":"<placeholder>"}'`
- **GET /v1/auth/me**
  `curl -i -X GET 'http://localhost:8080/v1/auth/me' -H 'Authorization: Bearer TOKEN_JWT'`
- **PUT /v1/auth/senha**
  `curl -i -X PUT 'http://localhost:8080/v1/auth/senha' -H 'Authorization: Bearer TOKEN_JWT' -H 'Content-Type: application/json' --data '{"senhaAtual":"<placeholder>","novaSenha":"<placeholder>"}'`
- **POST /v1/chat**
  `curl -i -X POST 'http://localhost:8080/v1/chat' -H 'Authorization: Bearer TOKEN_JWT' -H 'Content-Type: application/json' --data '{"message":"O que é o MindU?","history":[{"role":"user","content":"Olá"},{"role":"assistant","content":"Oi! Como posso ajudar?"}]}'`
- **POST /v1/chat/audio**
  `curl -i -X POST 'http://localhost:8080/v1/chat/audio' -H 'Authorization: Bearer TOKEN_JWT' -F 'file=@arquivo-de-teste' -F 'message=VALOR_DE_TESTE' -F 'history=VALOR_DE_TESTE'`
- **POST /v1/clientes**
  `curl -i -X POST 'http://localhost:8080/v1/clientes' -H 'Content-Type: application/json' --data '{"nome":"Maria Silva","email":"maria@email.com","senha":"<placeholder>","empresaId":"<uuid>","matricula":"A1B2C3"}'`
- **GET /v1/clientes/me**
  `curl -i -X GET 'http://localhost:8080/v1/clientes/me' -H 'Authorization: Bearer TOKEN_JWT'`
- **GET /v1/clientes/me/dados-sensiveis**
  `curl -i -X GET 'http://localhost:8080/v1/clientes/me/dados-sensiveis' -H 'Authorization: Bearer TOKEN_JWT'`
- **GET /v1/clientes/{id}**
  `curl -i -X GET 'http://localhost:8080/v1/clientes/<id>' -H 'Authorization: Bearer TOKEN_JWT'`
- **PATCH /v1/clientes/me**
  `curl -i -X PATCH 'http://localhost:8080/v1/clientes/me' -H 'Authorization: Bearer TOKEN_JWT' -H 'Content-Type: application/json' --data '{"telefone":"11999990000","cep":"01001000","logradouro":"Praça da Sé","cidade":"São Paulo","estado":"SP"}'`
- **PATCH /v1/clientes/me/dados-sensiveis**
  `curl -i -X PATCH 'http://localhost:8080/v1/clientes/me/dados-sensiveis' -H 'Authorization: Bearer TOKEN_JWT' -H 'Content-Type: application/json' --data '{"cns":"898001234567890","dataNascimento":"1995-03-20","nomeMae":"Ana Silva","genero":"FEMININO"}'`
- **PATCH /v1/clientes/{id}/aprovacao**
  `curl -i -X PATCH 'http://localhost:8080/v1/clientes/<id>/aprovacao?aprovado=true' -H 'Authorization: Bearer TOKEN_JWT'`
- **PATCH /v1/clientes/{id}**
  `curl -i -X PATCH 'http://localhost:8080/v1/clientes/<id>' -H 'Authorization: Bearer TOKEN_JWT' -H 'Content-Type: application/json' --data '{"telefone":"11999990000","cep":"01001000","cidade":"São Paulo"}'`
- **PATCH /v1/clientes/{id}/dados-sensiveis**
  `curl -i -X PATCH 'http://localhost:8080/v1/clientes/<id>/dados-sensiveis' -H 'Authorization: Bearer TOKEN_JWT' -H 'Content-Type: application/json' --data '{"cns":"898001234567890","dataNascimento":"1995-03-20","nomeMae":"Ana Silva","genero":"FEMININO"}'`
- **GET /v1/clientes**
  `curl -i -X GET 'http://localhost:8080/v1/clientes?status=APROVADO' -H 'Authorization: Bearer TOKEN_JWT'`
- **POST /v1/conta/solicitacao-exclusao**
  `curl -i -X POST 'http://localhost:8080/v1/conta/solicitacao-exclusao' -H 'Authorization: Bearer TOKEN_JWT'`
- **POST /v1/empresas**
  `curl -i -X POST 'http://localhost:8080/v1/empresas' -H 'Content-Type: application/json' --data '{"razaoSocial":"Acme Ltda","nomeFantasia":"Acme","inscricaoEstadual":"123456789","cnpj":"00000000000191","responsavel":"Ana Souza","cep":"01001000","logradouro":"Praça da Sé","numero":"100","complemento":"Sala 1","bairro":"Sé","cidade":"São Paulo","estado":"SP","email":"acme@empresa.com","telefone":"11999990000","senha":"<placeholder>","planoId":"<uuid do plano>"}'`
- **GET /v1/empresas/validar-matricula**
  `curl -i -X GET 'http://localhost:8080/v1/empresas/validar-matricula?codigo=A1B2C3'`
- **GET /v1/empresas/me**
  `curl -i -X GET 'http://localhost:8080/v1/empresas/me' -H 'Authorization: Bearer TOKEN_JWT'`
- **GET /v1/empresas/{id}**
  `curl -i -X GET 'http://localhost:8080/v1/empresas/<id>' -H 'Authorization: Bearer TOKEN_JWT'`
- **PATCH /v1/empresas/me**
  `curl -i -X PATCH 'http://localhost:8080/v1/empresas/me' -H 'Authorization: Bearer TOKEN_JWT' -H 'Content-Type: application/json' --data '{"nomeFantasia":"Acme Saúde","responsavel":"Ana Souza","telefone":"11999990000","cidade":"São Paulo"}'`
- **PATCH /v1/empresas/{id}**
  `curl -i -X PATCH 'http://localhost:8080/v1/empresas/<id>' -H 'Authorization: Bearer TOKEN_JWT' -H 'Content-Type: application/json' --data '{"telefone":"11999990000","responsavel":"Ana Souza"}'`
- **POST /v1/empresas/{id}/matriculas**
  `curl -i -X POST 'http://localhost:8080/v1/empresas/<id>/matriculas?quantidade=5' -H 'Authorization: Bearer TOKEN_JWT'`
- **POST /v1/empresas/me/matriculas**
  `curl -i -X POST 'http://localhost:8080/v1/empresas/me/matriculas?quantidade=5' -H 'Authorization: Bearer TOKEN_JWT'`
- **GET /v1/empresas/me/matriculas**
  `curl -i -X GET 'http://localhost:8080/v1/empresas/me/matriculas' -H 'Authorization: Bearer TOKEN_JWT'`
- **GET /v1/empresas/{id}/matriculas**
  `curl -i -X GET 'http://localhost:8080/v1/empresas/<id>/matriculas' -H 'Authorization: Bearer TOKEN_JWT'`
- **GET /v1/empresas/me/dashboard**
  `curl -i -X GET 'http://localhost:8080/v1/empresas/me/dashboard' -H 'Authorization: Bearer TOKEN_JWT'`
- **GET /v1/empresas/{id}/dashboard**
  `curl -i -X GET 'http://localhost:8080/v1/empresas/<id>/dashboard' -H 'Authorization: Bearer TOKEN_JWT'`
- **DELETE /v1/clientes/{id}**
  `curl -i -X DELETE 'http://localhost:8080/v1/clientes/<id>' -H 'Authorization: Bearer TOKEN_JWT'`
- **GET /v1/planos**
  `curl -i -X GET 'http://localhost:8080/v1/planos'`
- **POST /v1/profissionais**
  `curl -i -X POST 'http://localhost:8080/v1/profissionais' -F 'nome=VALOR_DE_TESTE' -F 'email=VALOR_DE_TESTE' -F 'senha=VALOR_DE_TESTE' -F 'tipo=VALOR_DE_TESTE' -F 'tags=VALOR_DE_TESTE' -F 'fotoCarteirinha=@arquivo-de-teste'`
- **GET /v1/profissionais/me**
  `curl -i -X GET 'http://localhost:8080/v1/profissionais/me' -H 'Authorization: Bearer TOKEN_JWT'`
- **GET /v1/profissionais/conta/perfil**
  `curl -i -X GET 'http://localhost:8080/v1/profissionais/conta/perfil' -H 'Authorization: Bearer TOKEN_JWT'`
- **PATCH /v1/profissionais/{id}**
  `curl -i -X PATCH 'http://localhost:8080/v1/profissionais/<id>' -H 'Authorization: Bearer TOKEN_JWT' -H 'Content-Type: application/json' --data '{"nome":"João Lima","telefone":"11999990000","bio":"Atendimento acolhedor","tipo":"PSICOLOGO","tags":["ansiedade"]}'`
- **PATCH /v1/profissionais/{id}/aprovacao**
  `curl -i -X PATCH 'http://localhost:8080/v1/profissionais/<id>/aprovacao?aprovado=true' -H 'Authorization: Bearer TOKEN_JWT'`
- **POST /v1/profissionais/{id}/locais**
  `curl -i -X POST 'http://localhost:8080/v1/profissionais/<id>/locais' -H 'Authorization: Bearer TOKEN_JWT' -H 'Content-Type: application/json' --data '{"modalidade":"PRESENCIAL","cep":"01001000","logradouro":"Av. Paulista","numero":"1000","bairro":"Bela Vista","cidade":"São Paulo","estado":"SP"}'`
- **PUT /v1/profissionais/{id}/disponibilidade**
  `curl -i -X PUT 'http://localhost:8080/v1/profissionais/<id>/disponibilidade' -H 'Authorization: Bearer TOKEN_JWT' -H 'Content-Type: application/json' --data '[{"diaSemana":"SEGUNDA","horaInicio":"08:00","horaFim":"12:00"}]'`
- **PATCH /v1/profissionais/{id}/perfil**
  `curl -i -X PATCH 'http://localhost:8080/v1/profissionais/<id>/perfil' -H 'Authorization: Bearer TOKEN_JWT' -F 'foto=@arquivo-de-teste' -F 'fotoBanner=@arquivo-de-teste'`
- **GET /v1/profissionais**
  `curl -i -X GET 'http://localhost:8080/v1/profissionais'`
- **GET /v1/profissionais/{id}**
  `curl -i -X GET 'http://localhost:8080/v1/profissionais/<id>'`
- **GET /v1/profissionais/{id}/horarios-disponiveis**
  `curl -i -X GET 'http://localhost:8080/v1/profissionais/<id>/horarios-disponiveis?data=AAAA-MM-DD'`
- **POST /v1/profissionais/{id}/horarios-disponiveis**
  `curl -i -X POST 'http://localhost:8080/v1/profissionais/<id>/horarios-disponiveis?data=AAAA-MM-DD' -H 'Content-Type: application/json' --data '{"data":"2026-10-20"}'`
- **GET /v1/profissionais/{id}/foto**
  `curl -i -X GET 'http://localhost:8080/v1/profissionais/<id>/foto'`
- **GET /v1/profissionais/{id}/banner**
  `curl -i -X GET 'http://localhost:8080/v1/profissionais/<id>/banner'`
- **PATCH /v1/profissionais/{id}/carteirinha**
  `curl -i -X PATCH 'http://localhost:8080/v1/profissionais/<id>/carteirinha' -H 'Authorization: Bearer TOKEN_JWT' -F 'fotoCarteirinha=@carteirinha.png'`

## Exemplos curl por rota

- **GET /v1/admin/profissionais**
  `curl -i -X GET 'http://localhost:8080/v1/admin/profissionais' -H 'Authorization: Bearer TOKEN_JWT'`
- **GET /v1/admin/profissionais/{id}/carteirinha**
  `curl -i -X GET 'http://localhost:8080/v1/admin/profissionais/<id>/carteirinha' -H 'Authorization: Bearer TOKEN_JWT'`
- **GET /v1/admin/profissionais/{id}/foto**
  `curl -i -X GET 'http://localhost:8080/v1/admin/profissionais/<id>/foto' -H 'Authorization: Bearer TOKEN_JWT'`
- **GET /v1/admin/profissionais/pendentes**
  `curl -i -X GET 'http://localhost:8080/v1/admin/profissionais/pendentes' -H 'Authorization: Bearer TOKEN_JWT'`
- **GET /v1/admin/clientes**
  `curl -i -X GET 'http://localhost:8080/v1/admin/clientes' -H 'Authorization: Bearer TOKEN_JWT'`
- **GET /v1/admin/empresas**
  `curl -i -X GET 'http://localhost:8080/v1/admin/empresas' -H 'Authorization: Bearer TOKEN_JWT'`
- **GET /v1/admin/solicitacoes-exclusao**
  `curl -i -X GET 'http://localhost:8080/v1/admin/solicitacoes-exclusao' -H 'Authorization: Bearer TOKEN_JWT'`
- **GET /v1/admin/agendamentos**
  `curl -i -X GET 'http://localhost:8080/v1/admin/agendamentos' -H 'Authorization: Bearer TOKEN_JWT'`
- **DELETE /v1/admin/empresas/{id}**
  `curl -i -X DELETE 'http://localhost:8080/v1/admin/empresas/<id>' -H 'Authorization: Bearer TOKEN_JWT'`
- **PATCH /v1/admin/empresas/{id}/reativacao**
  `curl -i -X PATCH 'http://localhost:8080/v1/admin/empresas/<id>/reativacao' -H 'Authorization: Bearer TOKEN_JWT'`
- **DELETE /v1/admin/profissionais/{id}**
  `curl -i -X DELETE 'http://localhost:8080/v1/admin/profissionais/<id>' -H 'Authorization: Bearer TOKEN_JWT'`
- **PATCH /v1/admin/profissionais/{id}/reativacao**
  `curl -i -X PATCH 'http://localhost:8080/v1/admin/profissionais/<id>/reativacao' -H 'Authorization: Bearer TOKEN_JWT'`
- **DELETE /v1/admin/clientes/{id}**
  `curl -i -X DELETE 'http://localhost:8080/v1/admin/clientes/<id>' -H 'Authorization: Bearer TOKEN_JWT'`
- **PATCH /v1/admin/clientes/{id}/reativacao**
  `curl -i -X PATCH 'http://localhost:8080/v1/admin/clientes/<id>/reativacao' -H 'Authorization: Bearer TOKEN_JWT'`
- **PATCH /v1/admin/empresas/{id}/contrato**
  `curl -i -X PATCH 'http://localhost:8080/v1/admin/empresas/<id>/contrato' -H 'Authorization: Bearer TOKEN_JWT' -H 'Content-Type: application/json' --data '{"inicioVigencia":"2026-11-01","fimVigencia":null,"diaPagamento":10}'`
- **PATCH /v1/admin/solicitacoes-exclusao/{id}**
  `curl -i -X PATCH 'http://localhost:8080/v1/admin/solicitacoes-exclusao/<id>' -H 'Authorization: Bearer TOKEN_JWT' -H 'Content-Type: application/json' --data '{"status":"EM_ANALISE"}'`
- **POST /v1/agendamentos**
  `curl -i -X POST 'http://localhost:8080/v1/agendamentos' -H 'Authorization: Bearer TOKEN_JWT' -H 'Content-Type: application/json' --data '{"profissionalId":"<uuid>","dataHora":"2026-10-20T09:00:00","modalidade":"VIRTUAL"}'`
- **GET /v1/agendamentos/meus**
  `curl -i -X GET 'http://localhost:8080/v1/agendamentos/meus?data=2026-10' -H 'Authorization: Bearer TOKEN_JWT'`
- **GET /v1/agendamentos/minha-agenda**
  `curl -i -X GET 'http://localhost:8080/v1/agendamentos/minha-agenda?data=2026-10' -H 'Authorization: Bearer TOKEN_JWT'`
- **PATCH /v1/agendamentos/{id}/cancelamento**
  `curl -i -X PATCH 'http://localhost:8080/v1/agendamentos/<id>/cancelamento' -H 'Authorization: Bearer TOKEN_JWT'`
- **PATCH /v1/agendamentos/{id}/horario**
  `curl -i -X PATCH 'http://localhost:8080/v1/agendamentos/<id>/horario' -H 'Authorization: Bearer TOKEN_JWT' -H 'Content-Type: application/json' --data '{"dataHora":"2026-10-21T09:00:00"}'`
- **PATCH /v1/agendamentos/{id}/realizacao**
  `curl -i -X PATCH 'http://localhost:8080/v1/agendamentos/<id>/realizacao' -H 'Authorization: Bearer TOKEN_JWT'`
- **PATCH /v1/agendamentos/{id}/link-online**
  `curl -i -X PATCH 'http://localhost:8080/v1/agendamentos/<id>/link-online' -H 'Authorization: Bearer TOKEN_JWT' -H 'Content-Type: application/json' --data '{"linkOnline":"https://consulta.exemplo.test/sala"}'`
- **POST /v1/auth/login**
  `curl -i -X POST 'http://localhost:8080/v1/auth/login' -H 'Content-Type: application/json' --data '{"email":"cliente@empresa.com","senha":"<placeholder>"}'`
- **POST /v1/auth/esqueci-senha**
  `curl -i -X POST 'http://localhost:8080/v1/auth/esqueci-senha' -H 'Content-Type: application/json' --data '{"email":"usuario@email.com"}'`
- **POST /v1/auth/redefinir-senha**
  `curl -i -X POST 'http://localhost:8080/v1/auth/redefinir-senha' -H 'Content-Type: application/json' --data '{"token":"<placeholder>","novaSenha":"<placeholder>"}'`
- **GET /v1/auth/me**
  `curl -i -X GET 'http://localhost:8080/v1/auth/me' -H 'Authorization: Bearer TOKEN_JWT'`
- **PUT /v1/auth/senha**
  `curl -i -X PUT 'http://localhost:8080/v1/auth/senha' -H 'Authorization: Bearer TOKEN_JWT' -H 'Content-Type: application/json' --data '{"senhaAtual":"<placeholder>","novaSenha":"<placeholder>"}'`
- **POST /v1/chat**
  `curl -i -X POST 'http://localhost:8080/v1/chat' -H 'Authorization: Bearer TOKEN_JWT' -H 'Content-Type: application/json' --data '{"message":"O que é o MindU?","history":[{"role":"user","content":"Olá"},{"role":"assistant","content":"Oi! Como posso ajudar?"}]}'`
- **POST /v1/chat/audio**
  `curl -i -X POST 'http://localhost:8080/v1/chat/audio' -H 'Authorization: Bearer TOKEN_JWT' -F 'file=@arquivo-de-teste' -F 'message=VALOR_DE_TESTE' -F 'history=VALOR_DE_TESTE'`
- **POST /v1/clientes**
  `curl -i -X POST 'http://localhost:8080/v1/clientes' -H 'Content-Type: application/json' --data '{"nome":"Maria Silva","email":"maria@email.com","senha":"<placeholder>","empresaId":"<uuid>","matricula":"A1B2C3"}'`
- **GET /v1/clientes/me**
  `curl -i -X GET 'http://localhost:8080/v1/clientes/me' -H 'Authorization: Bearer TOKEN_JWT'`
- **GET /v1/clientes/me/dados-sensiveis**
  `curl -i -X GET 'http://localhost:8080/v1/clientes/me/dados-sensiveis' -H 'Authorization: Bearer TOKEN_JWT'`
- **GET /v1/clientes/{id}**
  `curl -i -X GET 'http://localhost:8080/v1/clientes/<id>' -H 'Authorization: Bearer TOKEN_JWT'`
- **PATCH /v1/clientes/me**
  `curl -i -X PATCH 'http://localhost:8080/v1/clientes/me' -H 'Authorization: Bearer TOKEN_JWT' -H 'Content-Type: application/json' --data '{"telefone":"11999990000","cep":"01001000","logradouro":"Praça da Sé","cidade":"São Paulo","estado":"SP"}'`
- **PATCH /v1/clientes/me/dados-sensiveis**
  `curl -i -X PATCH 'http://localhost:8080/v1/clientes/me/dados-sensiveis' -H 'Authorization: Bearer TOKEN_JWT' -H 'Content-Type: application/json' --data '{"cns":"898001234567890","dataNascimento":"1995-03-20","nomeMae":"Ana Silva","genero":"FEMININO"}'`
- **PATCH /v1/clientes/{id}/aprovacao**
  `curl -i -X PATCH 'http://localhost:8080/v1/clientes/<id>/aprovacao?aprovado=true' -H 'Authorization: Bearer TOKEN_JWT'`
- **PATCH /v1/clientes/{id}**
  `curl -i -X PATCH 'http://localhost:8080/v1/clientes/<id>' -H 'Authorization: Bearer TOKEN_JWT' -H 'Content-Type: application/json' --data '{"telefone":"11999990000","cep":"01001000","cidade":"São Paulo"}'`
- **PATCH /v1/clientes/{id}/dados-sensiveis**
  `curl -i -X PATCH 'http://localhost:8080/v1/clientes/<id>/dados-sensiveis' -H 'Authorization: Bearer TOKEN_JWT' -H 'Content-Type: application/json' --data '{"cns":"898001234567890","dataNascimento":"1995-03-20","nomeMae":"Ana Silva","genero":"FEMININO"}'`
- **GET /v1/clientes**
  `curl -i -X GET 'http://localhost:8080/v1/clientes?status=APROVADO' -H 'Authorization: Bearer TOKEN_JWT'`
- **POST /v1/conta/solicitacao-exclusao**
  `curl -i -X POST 'http://localhost:8080/v1/conta/solicitacao-exclusao' -H 'Authorization: Bearer TOKEN_JWT'`
- **POST /v1/empresas**
  `curl -i -X POST 'http://localhost:8080/v1/empresas' -H 'Content-Type: application/json' --data '{"razaoSocial":"Acme Ltda","nomeFantasia":"Acme","inscricaoEstadual":"123456789","cnpj":"00000000000191","responsavel":"Ana Souza","cep":"01001000","logradouro":"Praça da Sé","numero":"100","complemento":"Sala 1","bairro":"Sé","cidade":"São Paulo","estado":"SP","email":"acme@empresa.com","telefone":"11999990000","senha":"<placeholder>","planoId":"<uuid do plano>"}'`
- **GET /v1/empresas/validar-matricula**
  `curl -i -X GET 'http://localhost:8080/v1/empresas/validar-matricula?codigo=A1B2C3'`
- **GET /v1/empresas/me**
  `curl -i -X GET 'http://localhost:8080/v1/empresas/me' -H 'Authorization: Bearer TOKEN_JWT'`
- **GET /v1/empresas/{id}**
  `curl -i -X GET 'http://localhost:8080/v1/empresas/<id>' -H 'Authorization: Bearer TOKEN_JWT'`
- **PATCH /v1/empresas/me**
  `curl -i -X PATCH 'http://localhost:8080/v1/empresas/me' -H 'Authorization: Bearer TOKEN_JWT' -H 'Content-Type: application/json' --data '{"nomeFantasia":"Acme Saúde","responsavel":"Ana Souza","telefone":"11999990000","cidade":"São Paulo"}'`
- **PATCH /v1/empresas/{id}**
  `curl -i -X PATCH 'http://localhost:8080/v1/empresas/<id>' -H 'Authorization: Bearer TOKEN_JWT' -H 'Content-Type: application/json' --data '{"telefone":"11999990000","responsavel":"Ana Souza"}'`
- **POST /v1/empresas/{id}/matriculas**
  `curl -i -X POST 'http://localhost:8080/v1/empresas/<id>/matriculas?quantidade=5' -H 'Authorization: Bearer TOKEN_JWT'`
- **POST /v1/empresas/me/matriculas**
  `curl -i -X POST 'http://localhost:8080/v1/empresas/me/matriculas?quantidade=5' -H 'Authorization: Bearer TOKEN_JWT'`
- **GET /v1/empresas/me/matriculas**
  `curl -i -X GET 'http://localhost:8080/v1/empresas/me/matriculas' -H 'Authorization: Bearer TOKEN_JWT'`
- **GET /v1/empresas/{id}/matriculas**
  `curl -i -X GET 'http://localhost:8080/v1/empresas/<id>/matriculas' -H 'Authorization: Bearer TOKEN_JWT'`
- **GET /v1/empresas/me/dashboard**
  `curl -i -X GET 'http://localhost:8080/v1/empresas/me/dashboard' -H 'Authorization: Bearer TOKEN_JWT'`
- **GET /v1/empresas/{id}/dashboard**
  `curl -i -X GET 'http://localhost:8080/v1/empresas/<id>/dashboard' -H 'Authorization: Bearer TOKEN_JWT'`
- **DELETE /v1/clientes/{id}**
  `curl -i -X DELETE 'http://localhost:8080/v1/clientes/<id>' -H 'Authorization: Bearer TOKEN_JWT'`
- **GET /v1/planos**
  `curl -i -X GET 'http://localhost:8080/v1/planos'`
- **POST /v1/profissionais**
  `curl -i -X POST 'http://localhost:8080/v1/profissionais' -F 'nome=VALOR_DE_TESTE' -F 'email=VALOR_DE_TESTE' -F 'senha=VALOR_DE_TESTE' -F 'tipo=VALOR_DE_TESTE' -F 'tags=VALOR_DE_TESTE' -F 'fotoCarteirinha=@arquivo-de-teste'`
- **GET /v1/profissionais/me**
  `curl -i -X GET 'http://localhost:8080/v1/profissionais/me' -H 'Authorization: Bearer TOKEN_JWT'`
- **GET /v1/profissionais/conta/perfil**
  `curl -i -X GET 'http://localhost:8080/v1/profissionais/conta/perfil' -H 'Authorization: Bearer TOKEN_JWT'`
- **PATCH /v1/profissionais/{id}**
  `curl -i -X PATCH 'http://localhost:8080/v1/profissionais/<id>' -H 'Authorization: Bearer TOKEN_JWT' -H 'Content-Type: application/json' --data '{"nome":"João Lima","telefone":"11999990000","bio":"Atendimento acolhedor","tipo":"PSICOLOGO","tags":["ansiedade"]}'`
- **PATCH /v1/profissionais/{id}/aprovacao**
  `curl -i -X PATCH 'http://localhost:8080/v1/profissionais/<id>/aprovacao?aprovado=true' -H 'Authorization: Bearer TOKEN_JWT'`
- **POST /v1/profissionais/{id}/locais**
  `curl -i -X POST 'http://localhost:8080/v1/profissionais/<id>/locais' -H 'Authorization: Bearer TOKEN_JWT' -H 'Content-Type: application/json' --data '{"modalidade":"PRESENCIAL","cep":"01001000","logradouro":"Av. Paulista","numero":"1000","bairro":"Bela Vista","cidade":"São Paulo","estado":"SP"}'`
- **PUT /v1/profissionais/{id}/disponibilidade**
  `curl -i -X PUT 'http://localhost:8080/v1/profissionais/<id>/disponibilidade' -H 'Authorization: Bearer TOKEN_JWT' -H 'Content-Type: application/json' --data '[{"diaSemana":"SEGUNDA","horaInicio":"08:00","horaFim":"12:00"}]'`
- **PATCH /v1/profissionais/{id}/perfil**
  `curl -i -X PATCH 'http://localhost:8080/v1/profissionais/<id>/perfil' -H 'Authorization: Bearer TOKEN_JWT' -F 'foto=@arquivo-de-teste' -F 'fotoBanner=@arquivo-de-teste'`
- **GET /v1/profissionais**
  `curl -i -X GET 'http://localhost:8080/v1/profissionais'`
- **GET /v1/profissionais/{id}**
  `curl -i -X GET 'http://localhost:8080/v1/profissionais/<id>'`
- **GET /v1/profissionais/{id}/horarios-disponiveis**
  `curl -i -X GET 'http://localhost:8080/v1/profissionais/<id>/horarios-disponiveis?data=AAAA-MM-DD'`
- **POST /v1/profissionais/{id}/horarios-disponiveis**
  `curl -i -X POST 'http://localhost:8080/v1/profissionais/<id>/horarios-disponiveis?data=AAAA-MM-DD' -H 'Content-Type: application/json' --data '{"data":"2026-10-20"}'`
- **GET /v1/profissionais/{id}/foto**
  `curl -i -X GET 'http://localhost:8080/v1/profissionais/<id>/foto'`
- **GET /v1/profissionais/{id}/banner**
  `curl -i -X GET 'http://localhost:8080/v1/profissionais/<id>/banner'`
- **PATCH /v1/profissionais/{id}/carteirinha**
  `curl -i -X PATCH 'http://localhost:8080/v1/profissionais/<id>/carteirinha' -H 'Authorization: Bearer TOKEN_JWT' -F 'fotoCarteirinha=@carteirinha.png'`