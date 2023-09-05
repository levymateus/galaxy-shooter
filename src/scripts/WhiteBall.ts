import { App } from "core/App";
import { Graphics } from "pixi.js";

export const WhiteBall = () => {

  const gr = new Graphics();
  App.app.stage.addChild(gr);

  function update() {
    gr.clear();
    gr.beginFill('#fff');
    gr.drawCircle(100, 100, 10);
    gr.endFill();
  }

  App.app.ticker.add(update);

}

