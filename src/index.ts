import "@pixi/math-extras";
import "styles.css";

import { app } from "app";
import { AxisAlignedBounds, EventEmitter, Settings, Surface, Timer } from "core";
import { Assets } from "pixi.js";
import GameOverScene from "scenes/GameOverScene";
import LoadingScene from "scenes/LoadingScene";
import VFX from "scenes/VFX";
import { AppEvents } from "typings";
import HUD from "ui/HUD";
import ParallaxStarryBackground from "scenes/ParallaxStarryBackground";
import { BgManager } from "managers/BgManager";
import { GUIManager } from "managers/GUIManager";
import { SceneManager } from "managers/SceneManager";
import VFXManager from "managers/VFXManager";
import MainScene from "scenes/MainScene";

Assets.setPreferences({
  preferWorkers: true,
});

const emitter = new EventEmitter<AppEvents>();
const appSettings = Settings.getInstance();
const res = appSettings.getDefaultResolution();
const surface = new Surface(app.screen, res);
const bounds = new AxisAlignedBounds(0, 0, surface.width, surface.height);
bounds.anchor.set(0.5);

const guiManager = new GUIManager(app.ticker, app.stage, app.screen, surface, bounds, emitter, 0);
const bgManager = new BgManager(app.ticker, app.stage, app.screen, surface, bounds, emitter, 0);
const sceneManager = new SceneManager(app.ticker, app.stage, app.screen, surface, bounds, emitter, 0);
const vfxManager = new VFXManager(app.ticker, app.stage, app.screen, surface, bounds, emitter, 0);

vfxManager.goto(VFX);

export const gotoMainScene = () => {
  vfxManager.play();
  bgManager.goto(ParallaxStarryBackground);
  guiManager.goto(HUD);
  sceneManager.goto(MainScene);
}

export const gotoGameOverScene = () => {
  vfxManager.stop();
  guiManager.destroy();
  bgManager.suspend();
  sceneManager.goto(GameOverScene);
}

export const gotoLoadingScene = () => {
  vfxManager.stop();
  guiManager.destroy();
  sceneManager.goto(LoadingScene);
}

emitter.on("gameOver", () => {
  new Timer().timeout(gotoGameOverScene, 2000);
});

emitter.on("dispathVFX", (config) => {
  vfxManager.emit(config);
});

gotoLoadingScene();
