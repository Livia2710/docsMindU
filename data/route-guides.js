window.MINDU_ROUTE_GUIDES = {
  "POST /v1/auth/login": {
    summary: "O login devolve somente token e tipo. Para carregar ID, nome e email, faça uma segunda chamada autenticada a GET /v1/auth/me.",
    steps: [
      "Envie email e senha para POST /v1/auth/login.",
      "Guarde token e tipo. O token autentica as próximas chamadas; tipo ajuda a direcionar a interface.",
      "Envie GET /v1/auth/me com Authorization: Bearer <token> para obter id, nome e email.",
      "Use as rotas /me sempre que possível. Elas identificam a conta pelo token."
    ],
    notes: ["Senha ou email incorreto retorna 401.", "O limite atual é de 10 tentativas por minuto por IP; 429 inclui Retry-After.", "Após trocar a senha, faça login novamente: tokens anteriores são invalidados."]
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
    steps: ["Consulte POST /v1/profissionais/{id}/horarios-disponiveis para uma data.", "Selecione um horário retornado e uma modalidade dos locais cadastrados.", "Envie profissionalId, dataHora e modalidade; clienteId é obtido do token.", "Se retornar 409, atualize os horários e escolha outro."]
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
