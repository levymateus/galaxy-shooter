import "@pixi/math-extras"
import "styles.css"

import { Group, Stage } from "@pixi/layers"
import devtools from "config"
import { Application, settings } from "pixi.js"

const appOptions = {
  resizeTo: window,
  autoDensity: false,
  antialias: false,
  backgroundColor: 0x1f1f24,
  autoStart: false,
}

const app = new Application(appOptions)
const view: Node = (app.view as unknown) as Node
app.stage = new Stage(new Group())
app.stage.name = "stage"
settings.RESOLUTION = window.devicePixelRatio || 1
document.body.appendChild(view)
devtools(app)

export { app }
