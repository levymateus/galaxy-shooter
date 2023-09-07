import Stage from "core/Stage";
import { Enemy } from "game-objects/Enemy";
import { createEnemy001 } from "game-objects/Enemy001";
import { MainShip } from "game-objects/MainShip";
import { createPlayer } from "game-objects/Player";

export default function () {
  const stage = new Stage("Stage001")
    .addPlayer(createPlayer(MainShip))
    .start();

  stage.addEnemy(createEnemy001(Enemy));
  window.setInterval(() => {
    if (stage.enemies.length <= 3) {
      stage.addEnemy(createEnemy001(Enemy));
    }
  }, 2000);
}
