import { GameObject, KinematicGameObject } from "core/GameObject";
import { StartCallback, UpdateCallback } from "core/typings";
import { randVec } from "utils";

export type Enemy = (afterStart: StartCallback, update: UpdateCallback) => GameObject;

export const Enemy: Enemy = (onStart, OnUpdate): GameObject => {

  const kgo = new KinematicGameObject("KinematicEnemy", start, OnUpdate);

  function start(o: GameObject) {
    o.position = randVec([0, 100, 0, 100]);
    o.removeChildren();
    onStart(o);
  }

  return kgo;

}

