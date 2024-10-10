
import "@pixi/math-extras"
import "styles.css"

import { Group, Stage } from "@pixi/layers"
import { Core, Settings, Surface } from "core"
import { ModuleManager } from "core/ModuleManager"
import { AppManager } from "managers/AppManager"
import { Application, Assets, settings, utils } from "pixi.js"
import devtools from "./config"

import {
  ANTIALIAS,
  APP_AUTO_START,
  APP_STAGE_NAME,
  AUTO_DENSITY,
  BG_COLOR,
  PREFER_WORKERS,
} from "./consts"

const appOptions = {
  resizeTo: window,
  autoDensity: AUTO_DENSITY,
  antialias: ANTIALIAS,
  backgroundColor: BG_COLOR,
  autoStart: APP_AUTO_START,
}

const app = new Application(appOptions)

app.stage = new Stage(new Group())

app.stage.name = APP_STAGE_NAME

settings.RESOLUTION = window.devicePixelRatio || 1

if (app.view instanceof Node) {
  document.body.appendChild(app.view)
} else throw new Error('Application.view is not a valid instance of Node.')

// setup pixijs devtools plugin
devtools(app)

Assets.setPreferences({
  preferWorkers: PREFER_WORKERS,
})

const emitter = new utils.EventEmitter()

const appSettings = Settings.getInstance()

const res = appSettings.getDefaultResolution()

const surface = new Surface(app.screen, res)

const bounds = new Core.AxisAlignedBounds(0, 0, surface.width, surface.height)

const moduleManager = new ModuleManager()

bounds.anchor.set(0.5)

const appManager = new AppManager(
  app,
  appSettings,
  emitter,
  surface,
  bounds,
  moduleManager
)

appManager.startUpApp()
