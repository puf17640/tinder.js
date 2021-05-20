import LRU from 'lru-cache'
import UserCache from "./UserCache";

export default class CacheManager {
  private readonly cache: UserCache | LRU<any, any>

  private readonly maxAge: number;

  private readonly maxItems: number;

  constructor(options?: { maxItems?: number, maxAge?: number, cache?: typeof UserCache}) {
    this.maxItems = options?.maxItems || 500

    this.maxAge = options?.maxAge || 1000 * 60 * 60

    // eslint-disable-next-line new-cap
    this.cache = options?.cache ? new options.cache({ maxItems: this.maxItems, maxAge: this.maxAge }) : new LRU({ max: this.maxItems, maxAge: this.maxAge })
  }

  set(key: string, value: any) {
    this.cache.set(key, JSON.stringify(value))
  }

  get(key: string) {
    return JSON.parse(this.cache.get(key))
  }

  reset() {
    this.cache.reset()
  }

  has(key: string): boolean {
    return this.cache.has(key)
  }

  del(key: string) {
    this.cache.del(key)
  }

  getLRU() {
    return this.cache
  }
}
