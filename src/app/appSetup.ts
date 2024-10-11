import { Application, settings } from "pixi.js"

import {
  ANTIALIAS,
  APP_AUTO_START,
  APP_STAGE_NAME,
  AUTO_DENSITY,
  BG_COLOR,
} from "./consts"

import devtools from "./config"

import { Group, Stage } from "@pixi/layers"

const appOptions = {
  resizeTo: window,
  autoDensity: AUTO_DENSITY,
  antialias: ANTIALIAS,
  backgroundColor: BG_COLOR,
  autoStart: APP_AUTO_START,
}

const app = new Application(appOptions)

app.stage = new Stage(new Group())

app.stage.sortableChildren = true

app.stage.name = APP_STAGE_NAME

settings.RESOLUTION = window.devicePixelRatio || 1

if (app.view instanceof Node) {
  document.body.appendChild(app.view)
} else throw new Error('Application.view is not a valid instance of Node.')

devtools(app)

export { app }
