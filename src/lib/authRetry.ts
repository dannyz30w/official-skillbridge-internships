// Retry helper for Supabase auth calls. The Lovable preview proxy occasionally
// drops POST requests with "Failed to fetch"; a short retry recovers transparently.
export async function withAuthRetry<T>(fn: () => Promise<T>, attempts = 3, delayMs = 600): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err: any) {
      lastErr = err;
      const msg = String(err?.message || err);
      const transient = err instanceof TypeError || /failed to fetch|network|load failed/i.test(msg);
      if (!transient || i === attempts - 1) throw err;
      await new Promise(r => setTimeout(r, delayMs * (i + 1)));
    }
  }
  throw lastErr;
}
