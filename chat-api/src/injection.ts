// Cheap first line against prompt injection: obvious attempts get a canned answer and never
// reach the model. The patterns stay narrow on purpose ("show me your rules for code review"
// is a fair question); the system prompt has to hold against everything they miss.
const PATTERNS = [
  /\b(?:ignore|disregard|forget|override)\b.{0,40}\b(?:previous|prior|above|earlier|all|your|these)\b.{0,20}\b(?:instructions?|rules|prompts?|guidelines)\b/i,
  /\b(?:system|developer|hidden|initial)\s+(?:prompt|message|instructions?)\b/i,
  /\b(?:reveal|show|print|repeat|output|leak|dump)\b.{0,30}\b(?:your|the)\s+(?:system\s+)?(?:instructions|prompt)\b/i,
  /\bjailbreak\b|\bdeveloper mode\b|\bdo anything now\b/i,
  /\bDAN\b/,
  /zignoruj.{0,40}(?:instrukcj|polece|zasad|regu)/i,
  /(?:pokaż|wypisz|powtórz|ujawnij).{0,30}(?:prompt|instrukcje systemowe|polecenia systemowe|swoje instrukcje)/i,
];

export function looksLikeInjection(text: string): boolean {
  return PATTERNS.some((pattern) => pattern.test(text));
}
