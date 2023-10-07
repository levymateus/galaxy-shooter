import "@pixi/math-extras";
import "styles.css";

import { Group, Stage } from "@pixi/layers";
import { Application } from "pixi.js";

const appOptions = {
  resizeTo: window,
  autoDensity: false,
  antialias: false,
  backgroundColor: 0x1f1f24,
  autoStart: false,
};

const app = new Application(appOptions);
app.stage = new Stage(new Group());
app.stage.name = "stage";

export { app };
