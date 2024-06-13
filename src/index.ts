import "@pixi/math-extras"
import "styles.css"

import { app } from "app"
import { Core, Settings, Surface, Timer } from "core"
import { isMainMenuEnalbed } from "feats"
import { BgManager } from "managers/BgManager"
import { GUIManager } from "managers/GUIManager"
import { SceneManager } from "managers/SceneManager"
import VFXManager from "managers/VFXManager"
import { Assets, utils } from "pixi.js"
import CatalogScene from "scenes/CatalogScene"
import GameOverScene from "scenes/GameOverScene"
import LoadingScene from "scenes/LoadingScene"
import MainScene from "scenes/MainScene"
import ParallaxStarryBackground from "scenes/ParallaxStarryBackground"
import VFX from "scenes/VFX"
import { HUD, Menu } from "ui"
import { ModuleManager } from "core/ModuleManager"

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

emitter.on("dispathVFX", (config) => {
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
