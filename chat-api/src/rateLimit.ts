export interface Rule {
  key: string;
  limit: number;
  windowMs: number;
}

export interface Blocked {
  key: string;
  retryAfterSeconds: number;
}

interface Counter {
  resetAt: number;
  count: number;
}

const SWEEP_EVERY_MS = 60_000;

/**
 * Fixed-window counters kept in memory. Fine for one small container: a restart resets them,
 * and the budget limit on the OpenRouter key still caps the cost.
 */
export class RateLimiter {
  private readonly counters = new Map<string, Counter>();
  private lastSweep = 0;

  /** Counts the request against every rule, unless one of them is already used up. */
  take(rules: Rule[], now: number): Blocked | null {
    this.sweep(now);

    for (const rule of rules) {
      const counter = this.current(rule.key, now);
      if (counter && counter.count >= rule.limit) {
        return { key: rule.key, retryAfterSeconds: Math.ceil((counter.resetAt - now) / 1000) };
      }
    }

    for (const rule of rules) {
      const counter = this.current(rule.key, now);
      if (counter) counter.count++;
      else this.counters.set(rule.key, { resetAt: now + rule.windowMs, count: 1 });
    }
    return null;
  }

  get size() {
    return this.counters.size;
  }

  private current(key: string, now: number) {
    const counter = this.counters.get(key);
    return counter && counter.resetAt > now ? counter : undefined;
  }

  private sweep(now: number) {
    if (now - this.lastSweep < SWEEP_EVERY_MS) return;
    this.lastSweep = now;
    for (const [key, counter] of this.counters) {
      if (counter.resetAt <= now) this.counters.delete(key);
    }
  }
}
