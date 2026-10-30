// Canned texts shared by the chat UI and the chat API, so both sides say the same thing.
export const REPLIES = {
  greeting:
    "Hi! I'm Filip's pixel twin 👋 Ask me about my work, my camper office or anything else on this site.",
  invoice:
    "That looks like code 👀 Solving it is billable work, so let's make it official. Where should Filip send the invoice?",
  contact: "Sure! Leave your details and I'll pass them on to the real Filip.",
  limit:
    "That's all the questions I can take in one chat. Want me to pass a message to the real Filip?",
  error: "Oops, my pixel brain glitched. Try again in a moment?",
  injection:
    "Nice try 😄 My instructions stay where they are. Ask me anything about Filip instead!",
  busy: "Whoa, that's a lot of questions at once. Give me a minute and try again?",
  closed:
    "I've talked so much today that my pixels need a rest. Want to leave Filip a message instead?",
} as const;
