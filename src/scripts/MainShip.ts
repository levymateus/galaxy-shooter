import World from "core/World";
import decoretaMainShip from "prefab/SpaceShip";

import { GameObject, KinematicGameObject } from "core/GameObject";
import { isAnimatedSprite } from "core/typings";
import { App } from "core/App";

export const MainShip = () => {

  new KinematicGameObject("KinematicMainShip", start);

  function start(o: GameObject) {
    const [,, ,] = World.calcWorldBounds();
    o.position = { x: 0, y: 0 };

    // puxar isso para uma implementaçao de camera
    App.app.stage.pivot.x = o.position.x - App.app.view.width / 2;
    App.app.stage.pivot.y = o.position.y - App.app.view.height + 64;

    o.removeChildren();
    decoretaMainShip(o, `MainShip`);
    playEngine(o);
  }

  function playEngine(o: GameObject) {
    const as = o.getByName('AnimatedSprite_MainShip_Engine');
    if (as && isAnimatedSprite(as)) {
      as.play();
    }
  }

}

