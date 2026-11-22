window.MINDU_ROUTE_GUIDES = {
  "POST /v1/auth/login": {
    summary: "O login devolve somente token e tipo. Para carregar ID, nome e email, faça uma segunda chamada autenticada a GET /v1/auth/me.",
    steps: [
      "Envie email e senha para POST /v1/auth/login.",
      "Guarde token e tipo. O token autentica as próximas chamadas; tipo ajuda a direcionar a interface.",
      "Envie GET /v1/auth/me com Authorization: Bearer <token> para obter id, nome e email.",
      "Use as rotas /me sempre que possível. Elas identificam a conta pelo token."
    ],
    notes: ["O servidor remove espaços das extremidades e converte o e-mail para minúsculas; Ana@x.com e ana@x.com são equivalentes.", "Senha ou e-mail incorreto retorna 401 em JSON. O JWT expira em 1 hora e não há refresh token.", "O limite padrão é 10 tentativas por minuto por IP; 429 inclui Retry-After e o limite pode ser ajustado por mindu.login.limite-por-minuto.", "No React, trate 401 limpando a sessão e redirecionando para o login; 403 indica falta de permissão e não exige encerrar a sessão."]
  },
  "GET /v1/auth/me": {
    summary: "Esta chamada completa o login no front: retorna id, nome, email e tipo da conta autenticada.",
    steps: ["Leia o token salvo após o login.", "Envie Authorization: Bearer <token>.", "Use o tipo para abrir a área Cliente, Empresa, Profissional ou Admin."]
  },
  "POST /v1/auth/esqueci-senha": {
    summary: "Inicia a recuperação sem revelar se o e-mail está cadastrado. O link chega no e-mail da conta ativa e vale por 15 minutos.",
    steps: [
      "Envie POST /v1/auth/esqueci-senha com JSON { email }. Não é necessário enviar JWT.",
      "Mostre a mesma mensagem genérica retornada pela API para qualquer e-mail válido. Não informe se a conta existe.",
      "Se a conta ativa existir, a pessoa recebe por e-mail um link baseado em MINDU_RESET_PASSWORD_URL com o token na query string.",
      "A tela do front deve ler o parâmetro token e pedir uma nova senha; envie o token no corpo de POST /v1/auth/redefinir-senha.",
      "Se o e-mail não chegar, confira a pasta de spam e as credenciais SMTP no ambiente da API. A resposta genérica não confirma entrega."
    ],
    notes: [
      "O e-mail é normalizado com trim e minúsculas. A API não retorna token na resposta nem registra o token em logs.",
      "O e-mail é enfileirado após o commit e enviado em segundo plano. Se o SMTP falhar, a API mantém a mesma resposta genérica, registra somente o tipo da falha no servidor e invalida o link que não foi entregue.",
      "O token é aleatório, tem uso único, expira em 15 minutos e somente seu hash SHA-256 fica no banco. Uma nova solicitação invalida links anteriores ainda pendentes.",
      "Esse endpoint compartilha o limite existente: 10 chamadas por minuto por IP; excesso retorna 429 e Retry-After.",
      "A tela do front deve remover o token da barra de endereço depois de lê-lo e evitar registrar a URL ou enviá-la como Referer.",
      "Para testes locais, use uma conta e uma caixa de e-mail controladas. SMTP real envia mensagem; os testes automatizados usam mock. O plano gratuito do Render bloqueia as portas SMTP comuns, então a Brevo configurada localmente não envia por esse caminho na hospedagem gratuita."
    ]
  },
  "POST /v1/auth/redefinir-senha": {
    summary: "Consome o token recebido no link por e-mail e troca a senha. O sucesso não retorna corpo (204).",
    steps: [
      "A tela de redefinição lê o token do parâmetro token no link recebido por e-mail.",
      "Peça e valide a nova senha no front; a regra atual da API exige pelo menos 8 caracteres.",
      "Envie POST /v1/auth/redefinir-senha com JSON { token, novaSenha }; não envie a senha na URL.",
      "Com 204, informe que a senha foi alterada e encaminhe a pessoa para o login.",
      "Com 400, o link expirou, já foi usado, foi invalidado ou a senha não passou na validação. Solicite um novo link quando necessário."
    ],
    notes: [
      "A alteração de senha e o consumo do token são transacionais; o banco bloqueia o token durante o uso para impedir duas redefinições concorrentes.",
      "Depois do sucesso, o token é marcado como usado, os outros links pendentes da conta são invalidados e a versão do usuário aumenta. JWTs anteriores deixam de autenticar; a pessoa precisa fazer login novamente.",
      "O token expira em 15 minutos, é de uso único e apenas seu hash fica persistido. Respostas de erro não incluem detalhes SMTP.",
      "A rota é pública e também compartilha o limite de 10 chamadas por minuto por IP; excesso retorna 429 com Retry-After."
    ]
  },
  "POST /v1/clientes": {
    summary: "O cadastro precisa do ID da empresa e de uma matrícula disponível. Valide o código antes de enviar o cadastro.",
    steps: ["Chame GET /v1/empresas/validar-matricula?codigo=... usando o código digitado.", "Guarde empresaId da resposta e mostre nomeFantasia.", "Envie nome, email, senha, empresaId e matricula para esta rota.", "Depois do cadastro, aguarde a aprovação da empresa."]
  },
  "GET /v1/empresas/validar-matricula": {
    summary: "Valida o código público de matrícula e identifica a empresa associada.",
    steps: ["Envie o código na query string; no React, aplique encodeURIComponent.", "Com 200, use empresaId e mostre nomeFantasia.", "404 significa código inválido; 409 significa que já foi utilizado."]
  },
  "POST /v1/profissionais": {
    summary: "Cadastro multipart. Apenas nome, email e senha são obrigatórios; tipo, tags e fotoCarteirinha são opcionais.",
    steps: ["Monte um FormData com nome, email e senha.", "Inclua tipo/tags/fotoCarteirinha somente se disponíveis.", "Não defina Content-Type manualmente no fetch: o navegador cria o boundary.", "A conta nasce PENDENTE e precisa de aprovação."]
  },
  "POST /v1/agendamentos": {
    summary: "Cliente autenticado escolhe um horário livre e uma modalidade oferecida pelo profissional.",
    steps: ["Consulte preferencialmente GET /v1/profissionais/{id}/horarios-disponiveis?data=AAAA-MM-DD.", "Selecione um horário retornado e uma modalidade dos locais cadastrados.", "Envie profissionalId, dataHora e modalidade; clienteId é obtido do token.", "Se retornar 409, atualize os horários e escolha outro."]
  },
  "GET /v1/profissionais/{id}/horarios-disponiveis": {
    summary: "Alternativa recomendada para consultar horários livres: envie data como query param no formato AAAA-MM-DD.",
    steps: ["Use GET /v1/profissionais/{id}/horarios-disponiveis?data=AAAA-MM-DD.", "A resposta é uma lista de horários locais disponíveis.", "Esta é a rota preferencial para novos consumidores."]
  },
  "GET /v1/profissionais/me": {
    summary: "Perfil do profissional autenticado; rota /me recomendada para novos consumidores.",
    steps: ["Envie o JWT de PROFISSIONAL no cabeçalho Authorization.", "A identidade do profissional é obtida pelo token, sem enviar ID na URL.", "Use 401 para sessão ausente/inválida e 403 quando o token for de outro tipo de conta."]
  },
  "GET /v1/profissionais/conta/perfil": {
    summary: "Rota antiga mantida por compatibilidade; prefira GET /v1/profissionais/me.",
    steps: ["Continua funcionando com token de PROFISSIONAL.", "Novos consumidores devem usar GET /v1/profissionais/me."]
  },
  "POST /v1/profissionais/{id}/horarios-disponiveis": {
    summary: "OBSOLETO: continua funcionando por compatibilidade, mas não é recomendado para novos consumidores. Prefira GET /v1/profissionais/{id}/horarios-disponiveis?data=AAAA-MM-DD.",
    steps: ["A data continua sendo enviada no body como { data: \"AAAA-MM-DD\" }.", "A rota não será removida nesta versão.", "Para novos projetos, utilize a alternativa GET com a data na query."]
  },
  "GET /v1/agendamentos/meus": {
    summary: "Lista os agendamentos da conta cliente. Use ?data=AAAA-MM para filtrar um mês."
  },
  "GET /v1/agendamentos/minha-agenda": {
    summary: "Lista a agenda do profissional autenticado. Use ?data=AAAA-MM para filtrar um mês."
  },
  "PATCH /v1/clientes/me/dados-sensiveis": {
    summary: "Envia CNS, nascimento, nome da mãe e gênero da própria conta; só é permitido após aprovação da empresa."
  },
  "PATCH /v1/profissionais/{id}/perfil": {
    summary: "Atualiza apenas foto e banner. PNG/JPEG, no máximo 5 MB cada; o servidor valida e converte para PNG."
  }
};
