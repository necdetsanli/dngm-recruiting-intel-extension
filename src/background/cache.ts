type CacheEntry<T> = {
  value: T;
  expiresAtMs: number;
};

/**
 * Simple in-memory TTL cache.
 * SRP: used only for caching GET_INTEL responses inside the service worker.
 */
export class TtlCache<T> {
  private readonly map = new Map<string, CacheEntry<T>>();

  /**
   * @param key - Cache key.
   * @returns Cached value or null.
   */
  public get(key: string): T | null {
    const entry = this.map.get(key);
    if (entry === undefined) {
      return null;
    }

    if (Date.now() >= entry.expiresAtMs) {
      this.map.delete(key);
      return null;
    }
    return entry.value;
  }

  /**
   * @param key - Cache key.
   * @param value - Value.
   * @param ttlMs - TTL in milliseconds.
   * @returns void
   */
  public set(key: string, value: T, ttlMs: number): void {
    this.map.set(key, { value, expiresAtMs: Date.now() + ttlMs });
  }
}
