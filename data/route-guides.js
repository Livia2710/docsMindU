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
