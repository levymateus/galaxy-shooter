import "@pixi/math-extras"
import "styles.css"

import { Group, Stage } from "@pixi/layers"
import devtools from "config"
import { isPauseOnBlurEnabled } from "feats"
import { Application, ICanvas, settings } from "pixi.js"

const appOptions = {
  resizeTo: window,
  autoDensity: false,
  antialias: false,
  backgroundColor: 0x1f1f24,
  autoStart: false,
}

const app = new Application(appOptions)
const view: ICanvas = app.view
app.stage = new Stage(new Group())
app.stage.name = "stage"
settings.RESOLUTION = window.devicePixelRatio || 1

if (view instanceof Node) {
  document.body.appendChild(view)
} else throw new Error('Application.view is not a valid instance of Node.')

// setup pixijs devtools plugin
devtools(app)

const pause = () => app.ticker.stop()
const unpause = () => app.ticker.start()
isPauseOnBlurEnabled && window.addEventListener('focus', unpause)
isPauseOnBlurEnabled && window.addEventListener('blur', pause)

export { app }
