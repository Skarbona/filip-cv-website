// Checks shared by the chat UI and, later, the chat API. The API must run them again:
// anything in the browser can be bypassed.

export const MAX_MESSAGE_LENGTH = 800;
export const MAX_VISITOR_MESSAGES = 20;

// One match is enough: code fences, stack traces, C includes, SQL statements.
const CERTAIN_CODE = [
  /```/,
  /^\s*at\s+\S.*\(.*:\d+:\d+\)\s*$/m,
  /Traceback \(most recent call last\)/,
  /^\s*#include\s*[<"]/m,
  /^\s*(?:SELECT\s+.+\s+FROM|INSERT\s+INTO|UPDATE\s+\w+\s+SET|DELETE\s+FROM)\b/m,
];

// Each match on a line adds a point.
const CODE_HINTS = [
  /^\s*(?:import|export|const|let|var|function|class|interface|type|enum|def|fn|func|return|public|private|protected|static|async|await|if|for|while|switch|try|catch)\b.*[=({:;]/,
  /[;{}]\s*$/,
  /^\s*[}\])]/,
  /=>/,
  /\b\w+(?:\.\w+)*\([^()]*\)\s*[;{]?\s*$/,
  /<\/?[A-Za-z][\w.-]*(?:\s[^<>]*)?\/?>/,
  /===|!==|&&|\|\||\+=|-=|::/,
];

/** True when the message looks like pasted code rather than a question about Filip. */
export function looksLikeCode(text: string): boolean {
  if (CERTAIN_CODE.some((pattern) => pattern.test(text))) return true;

  const lines = text.split(/\r?\n/).filter((line) => line.trim());
  let score = 0;
  for (const line of lines) {
    score += CODE_HINTS.filter((pattern) => pattern.test(line)).length;
  }

  const symbols = text.match(/[{}[\]();=<>]/g)?.length ?? 0;
  if (text.length >= 40 && symbols / text.length > 0.08) score += 2;

  return score >= (lines.length > 1 ? 3 : 4);
}
