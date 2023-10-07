
export enum Entities {
  MAIN_SHIP = "mainship",
  KLA_ED_FIGHTER = "klaed_fighter",
  ASTEROID = "asteroid",
  KLA_ED_BULLET = "klaed_bullet",
  CANNON_BULLET = "cannon_bullet"
}

export type MainShipAttributes = {
  health: number;
}

export type KlaedBulletAttributes = {
  damage: number;
}

export interface Entity<T = any> {
  attributes: T;
}

export function isEntity<T>(object: unknown): object is Entity<T> {
  return !!(object as Entity)?.attributes;
}
