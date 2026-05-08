import 'server-only';

type Bucket = { timestamps: number[] };

const buckets = new Map<string, Bucket>();
const SWEEP_AFTER = 1000;
let writes = 0;

export type RateLimitResult =
  | { ok: true }
  | { ok: false; retryAfterMs: number };

export function rateLimit({
  key,
  windowMs,
  max,
}: {
  key: string;
  windowMs: number;
  max: number;
}): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { timestamps: [] };
  const fresh = bucket.timestamps.filter((t) => now - t < windowMs);

  if (fresh.length >= max) {
    return { ok: false, retryAfterMs: windowMs - (now - fresh[0]) };
  }

  fresh.push(now);
  buckets.set(key, { timestamps: fresh });

  if (++writes >= SWEEP_AFTER) {
    writes = 0;
    sweep(now);
  }

  return { ok: true };
}

function sweep(now: number) {
  for (const [key, bucket] of buckets) {
    const fresh = bucket.timestamps.filter((t) => now - t < 60 * 60 * 1000);
    if (fresh.length === 0) buckets.delete(key);
    else bucket.timestamps = fresh;
  }
}
