import { loadConfig } from "./config.ts";
import { cannedLlm, createOpenRouter } from "./llm.ts";
import { consoleMailer, createResendMailer } from "./mailer.ts";
import { loadSystemPrompt } from "./prompt.ts";
import { createQuestionLog } from "./questions.ts";
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

const questionLog = config.questionsDir
  ? createQuestionLog({ dir: config.questionsDir, days: config.questionsDays })
  : undefined;
if (questionLog) {
  const purge = () =>
    questionLog
      .purge()
      .catch((error) =>
        console.error(
          `Old questions not deleted: ${error instanceof Error ? error.message : error}`
        )
      );
  void purge();
  setInterval(purge, 6 * 60 * 60 * 1000).unref();
}

const server = createApp({
  config,
  llm,
  mailer,
  systemPrompt: loadSystemPrompt(config.knowledgeFile),
  questionLog,
});

server.listen(config.port, config.host, () => {
  const questions = config.questionsDir
    ? `kept ${config.questionsDays} days in ${config.questionsDir}`
    : "not saved";
  console.log(
    `chat-api listening on http://${config.host}:${config.port} (models: ${config.models.join(", ")}; questions: ${questions})`
  );
});

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
