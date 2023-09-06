import { GameObject, KinematicGameObject } from "core/GameObject";
import { StartCallback, UpdateCallback, isAnimatedSprite } from "core/typings";
import buildSpaceShip, { SpaceShips } from "factory/SpaceShipFactory";
import { vec } from "utils";

export type MainShip = (afterStart: StartCallback, update: UpdateCallback) => GameObject;

export const MainShip: MainShip = (onStart, OnUpdate): GameObject => {

  const kgo = new KinematicGameObject("KinematicMainShip", start, OnUpdate);

  function start(o: GameObject) {
    o.position = vec();
    o.removeChildren();
    buildSpaceShip(o, 'MainShip', SpaceShips.MainShip);
    playEngine(o);

    onStart(o);
  }

  function playEngine(o: GameObject) {
    const as = o.getByName('AnimatedSprite_MainShip_Engine');
    if (as && isAnimatedSprite(as)) {
      as.play();
    }
  }

  return kgo;

}

