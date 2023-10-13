import "@pixi/math-extras";
import "styles.css";

import { app } from "app";
import { AxisAlignedBounds, EventEmitter, Settings, Surface, Timer } from "core";
import { SceneManager } from "core/SceneManager";
import { Assets } from "pixi.js";
import manifest from "res/manifest.json";
import GameOverScene from "scenes/GameOverScene";
import LoadingScene from "scenes/LoadingScene";
import MainScene from "scenes/MainScene";
import VFX from "scenes/VFX";
import VFXManager from "vfx/VFXManager";
import { SpaceShooterEvents } from "typings";
import { GUIManager } from "ui/GUIManager";
import HUD from "ui/HUD";

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
const vfxManager = new VFXManager<SpaceShooterEvents>(app, surface, bounds, emitter);
const sceneManager = new SceneManager<SpaceShooterEvents>(app, surface, bounds, emitter);
const guiManager = new GUIManager<SpaceShooterEvents>(app, surface, bounds, emitter);
const mainScene = new MainScene();
const gameOverScene = new GameOverScene();

vfxManager.gotoScene(new VFX(), "VFX");

export const gotoMainScene = () => {
  vfxManager.play();
  guiManager.gotoScene(hud, "HUD");
  sceneManager.gotoScene(mainScene, MainScene.SCENE_NAME);
}

export const gotoGameOverScene = () => {
  vfxManager.stop();
  guiManager.destroy();
  sceneManager.gotoScene(gameOverScene, GameOverScene.SCENE_NAME);
}

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

export const gotoLoadingScene = () => {
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
