import { VecRange } from "src/typings";

export default class World {
  static WORLD_WIDTH = 3840;
  static WORLD_HEIGHT = 2160;

  static calcWorldBounds(): VecRange {
    return [
      World.WORLD_WIDTH / 2 * -1,
      World.WORLD_WIDTH / 2,
      World.WORLD_HEIGHT / 2 * -1,
      World.WORLD_HEIGHT / 2,
    ];
  }
}
