// The chat is on now that its API runs behind /api/ on the server.
// Set NEXT_PUBLIC_CHAT_ENABLED=false at build time to hide it again. In `next dev` it is always on.
export const CHAT_ENABLED =
  process.env.NEXT_PUBLIC_CHAT_ENABLED !== "false" || process.env.NODE_ENV === "development";
