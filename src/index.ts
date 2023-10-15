import "@pixi/math-extras";
import "styles.css";

import { app } from "app";
import { AxisAlignedBounds, EventEmitter, Settings, Surface, Timer } from "core";
import { Assets } from "pixi.js";
import manifest from "res/manifest.json";
import GameOverScene from "scenes/GameOverScene";
import LoadingScene from "scenes/LoadingScene";
import VFX from "scenes/VFX";
import { SpaceShooterEvents } from "typings";
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

const emitter = new EventEmitter<SpaceShooterEvents>();
const appSettings = Settings.getInstance();
const res = appSettings.getDefaultResolution();
const surface = new Surface(app.screen, res);
const bounds = new AxisAlignedBounds(0, 0, surface.width, surface.height);
bounds.anchor.set(0.5);

const hud = new HUD();
const vfxManager = new VFXManager(app.ticker, app.stage, app.screen, surface, bounds, emitter);
const sceneManager = new SceneManager(app.ticker, app.stage, app.screen, surface, bounds, emitter);
const bgManager = new BgManager(app.ticker, app.stage, app.screen, surface, bounds, emitter);
const guiManager = new GUIManager<SpaceShooterEvents>(app.ticker, app.stage, app.screen, surface, bounds, emitter);

vfxManager.gotoScene(new VFX(), "VFX");

export const gotoMainScene = () => {
  vfxManager.play();
  bgManager.gotoScene(new ParallaxStarryBackground(), "background");
  guiManager.gotoScene(hud, HUD.GUI_NAME);
  sceneManager.gotoScene(new MainScene(), MainScene.SCENE_NAME);
}

export const gotoGameOverScene = () => {
  vfxManager.stop();
  guiManager.destroy();
  bgManager.suspend();
  sceneManager.gotoScene(new GameOverScene(), GameOverScene.SCENE_NAME);
}

export const gotoLoadingScene = () => {
  const bundleIds = [
    "enviroments_bundle",
    "mainship_bundle",
    "vfx_bundle",
    "klaed_fighter_bundle"
  ];
  const loadingScene = new LoadingScene();
  loadingScene.bundleIds = bundleIds;
  loadingScene.manifest = manifest;
  loadingScene.next = gotoMainScene;
  vfxManager.stop();
  guiManager.destroy();
  sceneManager.gotoScene(loadingScene, LoadingScene.SCENE_NAME);
}

emitter.on("gameOver", () => {
  new Timer().timeout(gotoGameOverScene, 2000);
});

emitter.on("dispathVFX", (config) => {
  vfxManager.emit(config);
});

gotoLoadingScene();
