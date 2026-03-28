import fs from 'fs';
import path from 'path';

const CACHE_DIR = path.join(process.cwd(), '.cache');

interface CacheEntry<T> {
  data: T;
  savedAt: number;
}

function cacheFile(key: string) {
  return path.join(CACHE_DIR, `${key}.json`);
}

/** Read cached data from disk. Returns null if missing or expired. */
export function readCache<T>(key: string, ttlMs: number): T | null {
  try {
    const file = cacheFile(key);
    if (!fs.existsSync(file)) return null;

    const entry: CacheEntry<T> = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (Date.now() - entry.savedAt > ttlMs) return null;

    console.log(`[cache] hit — ${key}`);
    return entry.data;
  } catch {
    return null;
  }
}

/** Write data to disk cache. */
export function writeCache<T>(key: string, data: T): void {
  try {
    if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
    const entry: CacheEntry<T> = { data, savedAt: Date.now() };
    fs.writeFileSync(cacheFile(key), JSON.stringify(entry, null, 2));
    console.log(`[cache] saved — ${key}`);
  } catch (err) {
    console.error(`[cache] failed to write ${key}:`, err);
  }
}
