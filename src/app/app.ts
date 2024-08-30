
import "@pixi/math-extras"
import "styles.css"

import { Group, Stage } from "@pixi/layers"
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
import MainMenuScene from "scenes/MainMenuScene"
import MainScene from "scenes/MainScene"
import ParallaxStarryBackground from "scenes/ParallaxStarryBackground"
import VFX from "scenes/VFX"
import { HUD, PauseMenu } from "ui"
import devtools from "./config"
import { EventNamesEnum } from "./enums"
import { isPauseOnBlurEnabled } from "./feats"
import stores from "./stores"

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

const collisionServer = moduleManager.addSingleton<CollisionServer>(CollisionServer,
  sceneManager,
)

vfxManager.goto(VFX)

export const gotoMainMenuScene = async () => {
  vfxManager.stop()
  bgManager.goto(ParallaxStarryBackground)
  collisionServer.disable()
  await guiManager.goto(MainMenuScene)
}

export const gotoMainScene = async () => {
  vfxManager.play()
  bgManager.goto(ParallaxStarryBackground)
  guiManager.goto(HUD)
  collisionServer.enable()
  await sceneManager.goto(MainScene)
}

export const gotoCatalogScene = async () => {
  vfxManager.stop()
  bgManager.suspend()
  collisionServer.disable()
  await sceneManager.goto(CatalogScene)
}

export const gotoGameOverScene = async () => {
  vfxManager.stop()
  bgManager.suspend()
  sceneManager.suspend()
  collisionServer.disable()
  await guiManager.goto(GameOverScene)
}

export const gotoLoadingScene = async () => {
  vfxManager.stop()
  guiManager.destroy()
  collisionServer.disable()
  await sceneManager.goto(LoadingScene)
}

export const gotoPauseMenu = async () => {
  vfxManager.stop()
  collisionServer.disable()
  await guiManager.goto(PauseMenu)
}

emitter.on(EventNamesEnum.GAME_OVER, () => {
  new Timer().debounce(gotoGameOverScene, 2000)
})

emitter.on(EventNamesEnum.START_GAME, () => {
  gotoMainScene()
})

emitter.on(EventNamesEnum.MAIN_MENU, () => {
  gotoMainMenuScene()
})

emitter.on(EventNamesEnum.DISPATCH_VFX, (config) => {
  vfxManager.emit(config)
})

emitter.on(EventNamesEnum.PAUSE_GAME, (paused) => {
  stores.paused = paused

  if (paused) {
    gotoPauseMenu()
  }

  if (!paused) {
    vfxManager.play()
    collisionServer.enable()
    guiManager.goto(HUD)
  }
})

const addViewEventListener = app.view.addEventListener

addViewEventListener && addViewEventListener('keydown',
  (evt: KeyboardEvent) => {
    if (
      evt.key === "Escape" &&
      guiManager.context &&
      guiManager.context.name !== MainMenuScene.name &&
      guiManager.context.name !== PauseMenu.name &&
      guiManager.context.name !== GameOverScene.name
    ) {
      emitter.emit(EventNamesEnum.PAUSE_GAME, true)
    }
  }
)

gotoLoadingScene()
