import { GameObject, KinematicGameObject } from "core/GameObject";
import { StartCallback, UpdateCallback } from "core/typings";
import buildSpaceShip, { SpaceShips } from "factory/SpaceShipFactory";
import { randVec } from "utils";

export type Enemy = (afterStart: StartCallback, update: UpdateCallback) => GameObject;

export const Enemy: Enemy = (onStart, OnUpdate): GameObject => {

  const kgo = new KinematicGameObject("KinematicEnemy", start, OnUpdate);

  function start(o: GameObject) {
    o.position = randVec([0, 100, 0, 100]);
    o.removeChildren();

    buildSpaceShip(o, 'Enemy', SpaceShips.SpaceShip_001);

    onStart(o);
  }

  return kgo;

}

