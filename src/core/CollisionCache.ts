import { AbstractCollision } from "./Collision"

export class CollisionCache {
  private map: Map<string, [AbstractCollision, AbstractCollision]> = new Map()

  private cacheId(...args: [AbstractCollision, AbstractCollision]) {
    return [args[0], args[1]].join('-')
  }

  setCache(...args: [AbstractCollision, AbstractCollision]) {
    this.map.set(this.cacheId(...args), args)
  }

  cacheHit(...args: [AbstractCollision, AbstractCollision]) {
    return this.map.get(this.cacheId(...args))
  }

  removeCache(...args: [AbstractCollision, AbstractCollision]) {
    this.map.delete(this.cacheId(...args))
  }
}
