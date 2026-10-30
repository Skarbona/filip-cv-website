# Chat API

Backend for the AI chat on filip-sokolowski.pl. It answers questions about Filip with a cheap model
through OpenRouter and emails him contact requests through Resend. The API keys live only here,
never in the website's code.

It runs TypeScript directly with Node's type stripping: no build step and no dependencies.

## Run locally

```bash
npm run chat-api:dev
```

The API listens on http://localhost:3001 and restarts on changes. `npm run dev` (the website)
talks to it automatically.

Without keys it still works: canned answers, and contact messages printed to the console.
For real answers copy `chat-api/env.example` to `chat-api/.env` and fill in `OPENROUTER_API_KEY`.

## Endpoints

- `POST /api/chat` with `{ messages: [{ role, content }] }` returns `{ text, card? }`
- `POST /api/contact` with `{ name, email, message, website }` returns `{ ok: true }`
- `GET /api/health`

## What protects the budget and the inbox

1. A monthly budget limit on the OpenRouter key (OpenRouter, API keys / Guardrails). This is the hard cap.
2. Rate limits per IP and for all visitors together (`src/config.ts`).
3. Pasted code and obvious prompt injection never reach the model.
4. Short history (12 turns) and short answers (400 tokens).
5. Contact emails go only to Filip, after the visitor clicks Send, at most 3 per IP a day.

## Deploy

Build and run instructions are at the top of `Dockerfile`. nginx forwards `/api/` to the container:

```nginx
location /api/ {
  proxy_pass http://127.0.0.1:3001;
  proxy_set_header X-Real-IP $remote_addr;
}
```
