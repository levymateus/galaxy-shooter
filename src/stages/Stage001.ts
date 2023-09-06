import Stage from "core/Stage";
import { MainShip } from "game-objects/MainShip";
import { createPlayer } from "game-objects/Player";

export default function () {
  new Stage("Stage001")
    .addPlayer(createPlayer(MainShip))
    .start();
}
