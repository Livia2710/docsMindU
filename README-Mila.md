# Serviço Mila

Mila é uma API FastAPI separada do backend Java. O site e o app Android chamam somente `/v1/chat` e `/v1/chat/audio` na API Java; não exponha as chaves da Mila no cliente.

## Docker Compose local

Clone o repositório Mila ao lado de `javaMindU` ou configure `MILA_BUILD_CONTEXT` e `MILA_ENV_FILE` no `.env` do Java. Crie o `.env` local da Mila com as variáveis necessárias e habilite o profile:

```sh
docker compose -f docker-compose.local.yml --profile mila up --build api db mila
```

O app usa `http://10.0.2.2:8080` no emulador; a comunicação interna Compose usa `http://mila:8000`. Sem Mila, Java e banco sobem normalmente, mas as chamadas de chat não ficam disponíveis.

## Configuração

Obrigatória para gerar/transcrever: `GROQ_API_KEY`. `MILA_API_KEY` é opcional no perfil de desenvolvimento, mas obrigatória em produção e deve coincidir entre Java e Mila. Nunca copie seus valores para README, Postman ou Git.

Outras variáveis de configuração: `APP_ENV`, `GROQ_MODEL`, `GROQ_MODEL_ROUTER`, `GROQ_STT_MODEL`, `LLM_TIMEOUT_S`, `LLM_MAX_RETRIES`, `MILA_DEBUG`, `MINDU_API_URL`, `MINDU_API_TIMEOUT_S`, `EMBEDDING_MODEL`, `RAG_TOP_K`, `RAG_MIN_RELEVANCE`, `RAG_REWRITE_FOLLOWUPS`, `ROUTER_MIN_CONFIDENCE`, `HISTORY_MAX_TURNS`, `ATTACH_MAX_MB`, `SPECIALTIES`, `LOG_LEVEL`.

## Contratos

- Texto: JSON `{ "message": "...", "history": [] }`. Mensagem 1–4.000 caracteres; até 20 turnos, com role `user`/`assistant` e conteúdo até 4.000 caracteres.
- Áudio: `multipart/form-data`, parte `file` obrigatória, `message` opcional e `history` como JSON serializado. Suporta WebM, OGG, MP3, M4A/MP4, WAV e FLAC com MIME compatível; limite padrão `ATTACH_MAX_MB=10`.
- Resposta: `response`, `intent`, `sources`, `missing_info`, `debug_info`, `transcription`.
- A Mila pode responder 401, 413, 422, 502 ou 503. Java valida o JWT do usuário e converte falhas upstream em resposta segura 502; detalhes ficam no log do servidor.

## Execução fora do Compose e testes

Use Python 3.12 e `requirements-dev.txt`; copie `.env.example` para `.env`, configure as variáveis localmente e execute `python -m mila.knowledge.ingest` e `python -m uvicorn mila.main:app --reload --port 8000`. Os testes offline ficam em `tests/`; execute `pytest` no diretório do repositório. O Streamlit é somente laboratório local, não faz parte da API pública.
