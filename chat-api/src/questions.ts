import { appendFile, mkdir, readdir, unlink } from "node:fs/promises";
import { join } from "node:path";

const DAY = 24 * 60 * 60 * 1000;
const FILE = /^questions-(\d{4}-\d{2}-\d{2})\.jsonl$/;

export interface SavedQuestion {
  /** ISO time in UTC; it also picks the day's file */
  time: string;
  /** The visitor's nth question in this conversation */
  turn: number;
  outcome: string;
  question: string;
}

export interface QuestionLog {
  save(entry: SavedQuestion): Promise<void>;
  /** Deletes the day files older than the retention period */
  purge(): Promise<void>;
}

/** Visitors' questions, one JSON line each, in one file per day. Readable only by the API's user. */
export function createQuestionLog({
  dir,
  days,
  now = Date.now,
}: {
  dir: string;
  days: number;
  now?: () => number;
}): QuestionLog {
  return {
    async save(entry) {
      await mkdir(dir, { recursive: true, mode: 0o700 });
      const file = join(dir, `questions-${entry.time.slice(0, 10)}.jsonl`);
      await appendFile(file, `${JSON.stringify(entry)}\n`, { mode: 0o600 });
    },
    async purge() {
      await mkdir(dir, { recursive: true, mode: 0o700 });
      const oldest = new Date(now() - days * DAY).toISOString().slice(0, 10);
      for (const name of await readdir(dir)) {
        const day = FILE.exec(name)?.[1];
        if (day && day < oldest) await unlink(join(dir, name));
      }
    },
  };
}
