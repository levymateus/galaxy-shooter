import "@pixi/math-extras"
import "styles.css"

import { app } from "app"
import { AxisAlignedBounds, EventEmitter, Settings, Surface, Timer } from "core"
import { BgManager } from "managers/BgManager"
import { GUIManager } from "managers/GUIManager"
import { SceneManager } from "managers/SceneManager"
import VFXManager from "managers/VFXManager"
import { Assets } from "pixi.js"
import GameOverScene from "scenes/GameOverScene"
import LoadingScene from "scenes/LoadingScene"
import MainScene from "scenes/MainScene"
import ParallaxStarryBackground from "scenes/ParallaxStarryBackground"
import VFX from "scenes/VFX"
import { AppEvents } from "typings"
import { HUD, Menu } from "ui"

Assets.setPreferences({
  preferWorkers: true,
})

const emitter = new EventEmitter<AppEvents>()
const appSettings = Settings.getInstance()
const res = appSettings.getDefaultResolution()
const surface = new Surface(app.screen, res)
const bounds = new AxisAlignedBounds(0, 0, surface.width, surface.height)
bounds.anchor.set(0.5)

const guiManager = new GUIManager(app.ticker, app.stage, app.screen, surface, bounds, emitter, 0)
const bgManager = new BgManager(app.ticker, app.stage, app.screen, surface, bounds, emitter, 0)
const sceneManager = new SceneManager(app.ticker, app.stage, app.screen, surface, bounds, emitter, 0)
const vfxManager = new VFXManager(app.ticker, app.stage, app.screen, surface, bounds, emitter, 0)

vfxManager.goto(VFX)

export const gotoMainScene = () => {
  vfxManager.play()
  bgManager.goto(ParallaxStarryBackground)
  guiManager.goto(HUD)
  sceneManager.goto(MainScene)
}

export const gotoGameOverScene = () => {
  vfxManager.stop()
  guiManager.destroy()
  bgManager.suspend()
  sceneManager.goto(GameOverScene)
}

export const gotoLoadingScene = () => {
  vfxManager.stop()
  guiManager.destroy()
  sceneManager.goto(LoadingScene)
}

emitter.on("gameOver", () => {
  new Timer().timeout(gotoGameOverScene, 2000)
})

emitter.on("dispathVFX", (config) => {
  vfxManager.emit(config)
})

const addViewEventListener = app.view.addEventListener
addViewEventListener && addViewEventListener('blur', () => {
  guiManager.goto(Menu)
  emitter.emit("appPause", true)
})
addViewEventListener && addViewEventListener('focus', () => {
  guiManager.goto(HUD)
  emitter.emit("appPause", false)
 })

gotoLoadingScene()
