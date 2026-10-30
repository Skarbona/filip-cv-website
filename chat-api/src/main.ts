import { loadConfig } from "./config.ts";
import { cannedLlm, createOpenRouter } from "./llm.ts";
import { consoleMailer, createResendMailer } from "./mailer.ts";
import { loadSystemPrompt } from "./prompt.ts";
import { createApp } from "./server.ts";

const config = loadConfig();

if (config.production && (!config.openRouterKey || !config.resendKey)) {
  console.error("OPENROUTER_API_KEY and RESEND_API_KEY must be set in production.");
  process.exit(1);
}
if (!config.openRouterKey) {
  console.warn("OPENROUTER_API_KEY is not set: the chat answers with canned replies.");
}
if (!config.resendKey) {
  console.warn("RESEND_API_KEY is not set: contact messages are printed here, not emailed.");
}

const llm = config.openRouterKey
  ? createOpenRouter({
      apiKey: config.openRouterKey,
      models: config.models,
      dataCollection: config.dataCollection,
    })
  : cannedLlm;

const mailer = config.resendKey
  ? createResendMailer({ apiKey: config.resendKey, from: config.contactFrom, to: config.contactTo })
  : consoleMailer;

const server = createApp({
  config,
  llm,
  mailer,
  systemPrompt: loadSystemPrompt(config.knowledgeFile),
});

server.listen(config.port, config.host, () => {
  console.log(
    `chat-api listening on http://${config.host}:${config.port} (models: ${config.models.join(", ")})`
  );
});

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
