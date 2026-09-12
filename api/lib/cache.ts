interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const store = new Map<string, CacheEntry<any>>();
const DEFAULT_TTL_MS = 20_000; // 20s — new posts still show up almost immediately

export async function cached<T>(key: string, fetcher: () => Promise<T>, ttlMs = DEFAULT_TTL_MS): Promise<T> {
  const hit = store.get(key);
  if (hit && hit.expiresAt > Date.now()) {
    return hit.data as T;
  }

  const data = await fetcher();
  store.set(key, { data, expiresAt: Date.now() + ttlMs });
  return data;
}

/** Call after any write so the next read reflects it immediately instead of waiting for TTL. */
export function invalidate(key: string) {
  store.delete(key);
}

export function invalidateAll() {
  store.clear();
}
