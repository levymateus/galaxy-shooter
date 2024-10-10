import { Destructible } from "../typings/typings";

export function isDestructible(entity: unknown): entity is Destructible {
  return !!(entity as Destructible)?.takeDamage
}
