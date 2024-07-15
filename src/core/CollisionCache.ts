import { Collision } from "./Collision"

export class CollisionCache {
  private map: Map<string, [Collision, Collision]> = new Map()

  private cacheId(...args: [Collision, Collision]) {
    return [args[0], args[1]].join('-')
  }

  setCache(...args: [Collision, Collision]) {
    this.map.set(this.cacheId(...args), args)
  }

  cacheHit(...args: [Collision, Collision]) {
    return this.map.get(this.cacheId(...args))
  }

  removeCache(...args: [Collision, Collision]) {
    this.map.delete(this.cacheId(...args))
  }
}
