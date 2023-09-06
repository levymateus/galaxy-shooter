import Level from "core/Level";
import { MainShip } from "game-objects/MainShip";
import { Enemy } from "game-objects/Enemy";
import { createPlayer } from "game-objects/Player";
import { createEnemy001 } from "game-objects/Enemy001";

const level001 = new Level("Level001")
  .addPlayer(createPlayer(MainShip))
  .start();

level001.addEnemy(createEnemy001(Enemy));
level001.addEnemy(createEnemy001(Enemy));
