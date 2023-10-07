import { EmitterConfigV3 } from "@pixi/particle-emitter";

export interface SpaceShooterEvents {
  scoreIncrement: [amount: number];
  gameOver: [];
  dispathVFX: [config: EmitterConfigV3];
}
