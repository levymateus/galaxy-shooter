
import "@pixi/math-extras"
import "styles.css"

import { Group, Stage } from "@pixi/layers"
import { isMainMenuEnalbed } from "app/feats"
import { Core, Settings, Surface, Timer } from "core"
import { CollisionServer } from "core/CollisionServer"
import { ModuleManager } from "core/ModuleManager"
import { BgManager } from "managers/BgManager"
import { GUIManager } from "managers/GUIManager"
import { SceneManager } from "managers/SceneManager"
import VFXManager from "managers/VFXManager"
import { Application, Assets, ICanvas, settings, utils } from "pixi.js"
import CatalogScene from "scenes/CatalogScene"
import GameOverScene from "scenes/GameOverScene"
import LoadingScene from "scenes/LoadingScene"
import MainScene from "scenes/MainScene"
import ParallaxStarryBackground from "scenes/ParallaxStarryBackground"
import VFX from "scenes/VFX"
import { HUD, Menu } from "ui"
import devtools from "./config"
import { isPauseOnBlurEnabled } from "./feats"
import { EventNamesEnum } from "./enums"

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

Assets.setPreferences({
  preferWorkers: true,
})

const emitter = new utils.EventEmitter()
const appSettings = Settings.getInstance()
const res = appSettings.getDefaultResolution()
const surface = new Surface(app.screen, res)
const bounds = new Core.AxisAlignedBounds(0, 0, surface.width, surface.height)
bounds.anchor.set(0.5)

const moduleManager = new ModuleManager()

const guiManager = moduleManager.addSingleton<GUIManager>(GUIManager,
  app.ticker,
  app.stage,
  app.screen,
  surface,
  bounds,
  emitter,
  0,
)

const bgManager = moduleManager.addSingleton<BgManager>(BgManager,
  app.ticker,
  app.stage,
  app.screen,
  surface,
  bounds,
  emitter,
  0,
)

const sceneManager = moduleManager.addSingleton<SceneManager>(SceneManager,
  app.ticker,
  app.stage,
  app.screen,
  surface,
  bounds,
  emitter,
  0,
)

const vfxManager = moduleManager.addSingleton<VFXManager>(VFXManager,
  app.ticker,
  app.stage,
  app.screen,
  surface,
  bounds,
  emitter,
  0,
)

moduleManager.addSingleton<CollisionServer>(CollisionServer,
  sceneManager,
)

vfxManager.goto(VFX)

export const gotoMainScene = async () => {
  vfxManager.play()
  bgManager.goto(ParallaxStarryBackground)
  guiManager.goto(HUD)
  await sceneManager.goto(MainScene)
}

export const gotoCatalogScene = async () => {
  vfxManager.stop()
  bgManager.suspend()
  await sceneManager.goto(CatalogScene)
}

export const gotoGameOverScene = async () => {
  vfxManager.stop()
  guiManager.destroy()
  bgManager.suspend()
  await sceneManager.goto(GameOverScene)
}

export const gotoLoadingScene = async () => {
  vfxManager.stop()
  guiManager.destroy()
  await sceneManager.goto(LoadingScene)
}

emitter.on("gameOver", () => {
  new Timer().timeout(gotoGameOverScene, 2000)
})

emitter.on(EventNamesEnum.DISPATCH_VFX, (config) => {
  vfxManager.emit(config)
})

const addViewEventListener = app.view.addEventListener
addViewEventListener && addViewEventListener('blur', () => {
  isMainMenuEnalbed && guiManager.goto(Menu)
  isMainMenuEnalbed && emitter.emit("appPause", true)
})
addViewEventListener && addViewEventListener('focus', () => {
  isMainMenuEnalbed && guiManager.goto(HUD)
  isMainMenuEnalbed && emitter.emit("appPause", false)
})

gotoLoadingScene()
