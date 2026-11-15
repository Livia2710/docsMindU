window.MINDU_ROUTE_ERRORS = {
  "POST /v1/chat": [
    { codigo: "401", motivo: "JWT ausente, inválido ou expirado", correcao: "faça login novamente e envie Authorization: Bearer <token>" },
    { codigo: "422", motivo: "mensagem ou histórico fora do formato/limite aceito", correcao: "envie message com 1–4.000 caracteres e no máximo 20 turnos user/assistant" },
    { codigo: "502", motivo: "Java não conseguiu completar a chamada à Mila", correcao: "confira se o container Mila está saudável, a chave interna dos dois serviços coincide e veja docker compose logs api mila" }
  ],
  "POST /v1/chat/audio": [
    { codigo: "401", motivo: "JWT ausente, inválido ou expirado", correcao: "faça login novamente e envie Authorization: Bearer <token>" },
    { codigo: "413", motivo: "arquivo maior que o limite configurado", correcao: "reduza o áudio; o limite padrão do serviço Mila é 10 MB" },
    { codigo: "422", motivo: "arquivo não é áudio suportado ou campos inválidos", correcao: "envie um arquivo de áudio aceito e history como string JSON; imagens e PDFs não são aceitos" },
    { codigo: "502", motivo: "Java não conseguiu completar a chamada à Mila", correcao: "confira se o container Mila está saudável e veja os logs dos containers api e mila" }
  ],
  "GET /v1/auth/me": [
    { codigo: "401", motivo: "token ausente, inválido ou expirado", correcao: "faça login novamente em POST /v1/auth/login e envie o token Bearer" }
  ],
  "PUT /v1/auth/senha": [
    { codigo: "400", motivo: "senha atual incorreta ou nova senha menor que 8 caracteres", correcao: "confira a senha atual e envie uma nova senha com pelo menos 8 caracteres" }
  ],
  "GET /v1/planos": [
    { codigo: "lista vazia", motivo: "a API respondeu, mas não há planos cadastrados", correcao: "confirme que o seed de planos rodou ao iniciar a API e que a tabela plano tem registros" },
    { codigo: "CORS", motivo: "requisição bloqueada pelo navegador antes de chegar à API (só no React)", correcao: "confirme que a origem do site está na configuração CORS_ORIGENS do backend" },
    { codigo: "404", motivo: "rota não encontrada", correcao: "confirme que está usando GET /v1/planos e que a API implantada inclui a versão com essa rota" }
  ],
  "POST /v1/auth/login": [
    { codigo: "401", motivo: "e-mail ou senha incorretos", correcao: "confira as credenciais; se for logo após o deploy, confirme que o seed de admins rodou (variável MINDU_ADMIN_SENHA preenchida)" },
    { codigo: "429", motivo: "limite de 10 tentativas de login por minuto por IP", correcao: "aguarde o tempo indicado no cabeçalho Retry-After e tente novamente" },
    { codigo: "CORS", motivo: "requisição bloqueada pelo navegador antes de chegar na API (só no React)", correcao: "confirme que a origem do site está em CORS_ORIGENS no Render" }
  ],
  "GET /v1/empresas/validar-matricula": [
    { codigo: "404", motivo: "código de matrícula inexistente", correcao: "confira o código e tente validar novamente" },
    { codigo: "409", motivo: "matrícula já utilizada", correcao: "solicite outro código à empresa" }
  ],
  "POST /v1/clientes": [
    { codigo: "400", motivo: "matrícula não pertence à empresa informada", correcao: "valide o código e use o empresaId retornado" },
    { codigo: "409", motivo: "email ou matrícula já utilizados", correcao: "use outro email ou peça uma matrícula disponível" }
  ],
  "POST /v1/profissionais": [
    { codigo: "400", motivo: "campo obrigatório ausente ou imagem inválida", correcao: "envie nome/email/senha; imagens devem ser PNG/JPEG até 5 MB" },
    { codigo: "409", motivo: "email já cadastrado", correcao: "use outro email ou entre na conta existente" }
  ],
  "PATCH /v1/profissionais/{id}/perfil": [
    { codigo: "400", motivo: "arquivo inválido ou maior que o limite", correcao: "envie uma imagem PNG/JPEG válida de até 5 MB" },
    { codigo: "403", motivo: "perfil não pertence à conta autenticada", correcao: "use o token do próprio profissional" }
  ],
  "POST /v1/empresas": [
    { codigo: "409", motivo: "CNPJ ou razão social já cadastrados (RN02)", correcao: "use um CNPJ/razão social diferentes" },
    { codigo: "400", motivo: "planoId inválido ou inexistente", correcao: "confira o UUID: SELECT id, nome FROM plano;" }
  ],
  "POST /v1/empresas/{id}/matriculas": [
    { codigo: "400", motivo: "quantidade solicitada passa do limite de vagas do plano (RN09)", correcao: "peça uma quantidade menor ou confirme vagas_totais do plano" },
    { codigo: "401", motivo: "token ausente ou de outro perfil", correcao: "use o token da própria empresa (login em /v1/auth/login)" }
  ],
  "GET /v1/empresas/{id}/dashboard": [
    { codigo: "404", motivo: "id de empresa não encontrado", correcao: "confira o id usado na URL" },
    { codigo: "401", motivo: "token de um perfil que não é essa empresa", correcao: "use o token da empresa dona do dashboard" }
  ],
  "GET /v1/empresas/me/dashboard": [
    { codigo: "401", motivo: "token ausente ou inválido", correcao: "entre com a conta da empresa" }
  ],
  "POST /v1/empresas/me/matriculas": [
    { codigo: "400", motivo: "quantidade ultrapassa o limite de vagas do plano", correcao: "reduza a quantidade ou confira o limite contratado" },
    { codigo: "403", motivo: "token não é de uma empresa", correcao: "use a conta da empresa" }
  ],
  "POST /v1/clientes": [
    { codigo: "409", motivo: "matrícula já usada ou e-mail já cadastrado (RN01)", correcao: "gere uma matrícula nova, ou use outro e-mail" },
    { codigo: "400", motivo: "matrícula pertence a outra empresa (RN04)", correcao: "confira o empresaId enviado" },
    { codigo: "400", motivo: "senha com menos de 8 caracteres (RN03)", correcao: "exija 8+ caracteres no formulário" }
  ],
  "PATCH /v1/clientes/{id}/aprovacao": [
    { codigo: "404", motivo: "id de cliente não encontrado", correcao: "confira o id" },
    { codigo: "401", motivo: "token que não é da empresa dona do cliente", correcao: "use o token da empresa" }
  ],
  "PATCH /v1/clientes/{id}/dados-sensiveis": [
    { codigo: "403", motivo: "cliente ainda está AGUARDANDO_APROVACAO (RN05)", correcao: "a empresa precisa aprovar o cliente antes desta chamada" },
    { codigo: "500", motivo: "chave de criptografia do CNS mal configurada", correcao: "MINDU_CRIPTOGRAFIA_CHAVE precisa ter exatamente 16, 24 ou 32 caracteres" }
  ],
  "PATCH /v1/clientes/me/dados-sensiveis": [
    { codigo: "403", motivo: "cliente ainda está AGUARDANDO_APROVACAO", correcao: "a empresa precisa aprovar a conta antes de enviar esses dados" },
    { codigo: "500", motivo: "chave de criptografia do CNS mal configurada", correcao: "MINDU_CRIPTOGRAFIA_CHAVE precisa ter exatamente 16, 24 ou 32 caracteres" }
  ],
  "GET /v1/clientes": [
    { codigo: "401", motivo: "rota exige token da empresa (evita vazar dados de clientes de terceiros)", correcao: "faça login como a empresa antes de listar" }
  ],
  "POST /v1/profissionais": [
    { codigo: "415", motivo: "campo \"dados\" chegando sem Content-Type application/json (comum em apps que enviam JSON dentro do form-data)", correcao: "envie os campos soltos no form-data (nome, email, senha, tipo, tags) em vez de um bloco JSON único" },
    { codigo: "400", motivo: "fotoCarteirinha ausente", correcao: "o campo é obrigatório — confirme que o arquivo foi anexado" }
  ],
  "PATCH /v1/profissionais/{id}/aprovacao": [
    { codigo: "401", motivo: "token que não é de um Admin", correcao: "faça login com um dos e-mails de admin do seed" },
    { codigo: "404", motivo: "id de profissional não encontrado", correcao: "confira o id" }
  ],
  "POST /v1/profissionais/{id}/locais": [
    { codigo: "400", motivo: "modalidade PRESENCIAL sem endereço (RF08)", correcao: "envie cep, logradouro, numero, bairro, cidade e estado para locais presenciais" },
    { codigo: "401", motivo: "token de um profissional diferente do dono do local", correcao: "use o próprio token do profissional" }
  ],
  "PUT /v1/profissionais/{id}/disponibilidade": [
    { codigo: "400", motivo: "horaInicio depois de horaFim, ou formato de hora inválido", correcao: "use o formato HH:mm e horaInicio antes de horaFim" }
  ],
  "GET /v1/profissionais": [
    { codigo: "lista vazia", motivo: "o profissional existe mas ainda está PENDENTE (RN06 — some da busca até ser aprovado)", correcao: "aprove o profissional antes de buscar" }
  ],
  "GET /v1/profissionais/{id}": [
    { codigo: "404", motivo: "profissional inexistente ou ainda não aprovado", correcao: "confira o id; só perfis aprovados aparecem publicamente" }
  ],
  "POST /v1/profissionais/{id}/horarios-disponiveis": [
    { codigo: "400", motivo: "data ausente ou formato inválido", correcao: "envie no body a data no formato AAAA-MM-DD" },
    { codigo: "404", motivo: "profissional inexistente ou não aprovado", correcao: "confira o id do profissional aprovado" }
  ],
  "GET /v1/profissionais/{id}/foto": [
    { codigo: "404", motivo: "foto não cadastrada ou perfil não aprovado", correcao: "confira se o profissional já enviou a foto" }
  ],
  "GET /v1/profissionais/{id}/banner": [
    { codigo: "404", motivo: "banner não cadastrado ou perfil não aprovado", correcao: "confira se o profissional já enviou o banner" }
  ],
  "GET /v1/admin/profissionais/pendentes": [
    { codigo: "403", motivo: "token não é de uma conta Admin", correcao: "faça login com uma conta Admin seedada pela equipe" }
  ],
  "DELETE /v1/admin/empresas/{id}": [
    { codigo: "404", motivo: "empresa não encontrada", correcao: "confira o ID da empresa" },
    { codigo: "403", motivo: "token não é de uma conta Admin", correcao: "entre com uma conta Admin" }
  ],
  "DELETE /v1/admin/profissionais/{id}": [
    { codigo: "404", motivo: "profissional não encontrado", correcao: "confira o ID do profissional" },
    { codigo: "403", motivo: "token não é de uma conta Admin", correcao: "entre com uma conta Admin" }
  ],
  "DELETE /v1/admin/clientes/{id}": [
    { codigo: "404", motivo: "cliente não encontrado", correcao: "confira o ID do cliente" },
    { codigo: "403", motivo: "token não é de uma conta Admin", correcao: "entre com uma conta Admin" }
  ],
  "DELETE /v1/clientes/{id}": [
    { codigo: "403", motivo: "o cliente não pertence à empresa autenticada", correcao: "use a conta da empresa vinculada a esse funcionário" },
    { codigo: "404", motivo: "cliente não encontrado", correcao: "confira o ID do funcionário" }
  ],
  "POST /v1/agendamentos": [
    { codigo: "409", motivo: "já existe um agendamento nesse horário (RN10)", correcao: "escolha outro horário, ou cancele o agendamento existente" },
    { codigo: "400", motivo: "horário fora da disponibilidade cadastrada pelo profissional", correcao: "confira a disponibilidade em PUT /disponibilidade" },
    { codigo: "404", motivo: "clienteId ou profissionalId inexistentes", correcao: "confira os dois ids enviados" }
  ],
  "GET /v1/agendamentos/meus": [
    { codigo: "lista vazia", motivo: "a conta autenticada ainda não tem agendamentos", correcao: "confirme se a conta cliente está correta e se já há consultas agendadas" }
  ],
  "GET /v1/agendamentos/minha-agenda": [
    { codigo: "403", motivo: "token não é de um profissional", correcao: "faça login com a conta profissional" }
  ],
  "PATCH /v1/agendamentos/{id}/cancelamento": [
    { codigo: "404", motivo: "agendamento não encontrado ou já cancelado", correcao: "confira o id e o status atual" }
  ],
  "PATCH /v1/agendamentos/{id}/horario": [
    { codigo: "400", motivo: "novo horário fora da agenda, de intervalo incorreto ou agendamento cancelado", correcao: "selecione um horário retornado por POST /v1/profissionais/{id}/horarios-disponiveis" },
    { codigo: "409", motivo: "novo horário acabou de ser ocupado", correcao: "consulte novamente os horários livres e escolha outro" },
    { codigo: "403", motivo: "agendamento não pertence à conta autenticada", correcao: "use a conta do cliente ou profissional envolvido" }
  ]
};
