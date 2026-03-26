/**
 * lib/cache.ts
 * Lightweight in-memory cache for Firestore queries.
 * Reduces redundant network calls and improves TTI.
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const store = new Map<string, CacheEntry<unknown>>();

/**
 * Get item from cache. Returns null if expired or missing.
 */
export function cacheGet<T>(key: string): T | null {
  const entry = store.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  return entry.data;
}

/**
 * Set item in cache with TTL in seconds (default: 60s).
 */
export function cacheSet<T>(key: string, data: T, ttlSeconds = 60): void {
  store.set(key, { data, expiresAt: Date.now() + ttlSeconds * 1000 });
}

/**
 * Invalidate a specific cache key or all keys matching a prefix.
 */
export function cacheInvalidate(keyOrPrefix: string): void {
  for (const key of store.keys()) {
    if (key.startsWith(keyOrPrefix)) store.delete(key);
  }
}
