import { Core, Settings, Surface } from "core"
import { CollisionServer } from "core/CollisionServer"
import { Countdown } from "core/Countdown"
import { ModuleManager } from "core/ModuleManager"
import { Application, Assets, utils } from "pixi.js"
import manifest from "res/manifest.json"
import GameOverScene from "scenes/GameOverScene"
import LoadingScene from "scenes/LoadingScene"
import MainMenuScene from "scenes/MainMenuScene"
import MainScene from "scenes/MainScene"
import ParallaxStarryBackground from "scenes/ParallaxStarryBackground"
import VFX from "scenes/VFX"
import { EventNamesEnum } from "typings/enums"
import { HUD } from "ui/HUD"
import { MathUtils } from "utils/utils"
import { BgManager } from "./BgManager"
import { GUIManager } from "./GUIManager"
import { SceneLoader } from "./SceneLoader"
import { SceneManager } from "./SceneManager"
import VFXManager from "./VFXManager"
import { Store } from "./Store"

export class AppManager {
  private guiManager: GUIManager

  private bgManager: BgManager

  private sceneManager: SceneManager

  private vfxManager: VFXManager

  private collisionServer: CollisionServer

  private cd = new Countdown()

  constructor(
    readonly app: Application,
    readonly settings: Settings,
    readonly emitter: utils.EventEmitter,
    readonly surface: Surface,
    readonly bounds: Core.AxisAlignedBounds,
    readonly moduleManager: ModuleManager,
    readonly store: Store,
  ) {
    this.bgManager = moduleManager.addSingleton<BgManager>(BgManager,
      app.ticker,
      app.stage,
      app.screen,
      surface,
      bounds,
      emitter,
    )

    this.sceneManager = moduleManager.addSingleton<SceneManager>(SceneManager,
      app.ticker,
      app.stage,
      app.screen,
      surface,
      bounds,
      emitter,
    )

    this.vfxManager = moduleManager.addSingleton<VFXManager>(VFXManager,
      app.ticker,
      app.stage,
      app.screen,
      surface,
      bounds,
      emitter,
    )

    this.guiManager = moduleManager.addSingleton<GUIManager>(GUIManager,
      app.ticker,
      app.stage,
      app.screen,
      surface,
      bounds,
      emitter,
      store,
    )

    this.collisionServer = moduleManager.addSingleton<CollisionServer>(
      CollisionServer,
      this.sceneManager,
    )

    emitter.on(
      EventNamesEnum.GOTO_GAME_OVER,
      () => this.doGameOverApp()
    )

    emitter.on(
      EventNamesEnum.START_GAME,
      () => this.doStartApp()
    )

    emitter.on(
      EventNamesEnum.GOTO_MAIN_MENU,
      () => this.gotoMainMenu()
    )

    emitter.on(
      EventNamesEnum.DISPATCH_VFX,
      (config) => this.vfxManager.emit(config)
    )

    Assets.init({ manifest: manifest || "" })
  }

  private async doStartApp() {
    await this.gotoMainScene()
    await this.cd.count(MathUtils.sec2ms(2))
  }

  private async doGameOverApp() {
    await this.cd.count(MathUtils.sec2ms(2))
    await this.gotoGameOver()
  }

  async startUpApp() {
    await this.vfxManager.goto(VFX)
    await this.gotoLoading()
  }

  async gotoMainMenu() {
    this.vfxManager.stop()
    this.bgManager.suspend()
    this.collisionServer.disable()
    await this.guiManager.goto(MainMenuScene)
  }

  async gotoMainScene() {
    const bundleIds = [
      "mainship_bundle",
      "mainship_base_engine_bundle",
      "mainship_weapons_auto_cannon_bundle",
      "asteroid_bundle",
      "vfx_bundle"
    ]

    const mainScene = new SceneLoader(
      bundleIds,
      this.sceneManager,
      MainScene,
      LoadingScene,
    )

    this.bgManager.suspend()

    this.guiManager.suspend()

    await mainScene.load()

    this.vfxManager.play()

    this.collisionServer.enable()

    await this.guiManager.goto(HUD)

    await this.bgManager.goto(ParallaxStarryBackground)

    this.sceneManager.setIndex(1)
  }

  async gotoGameOver() {
    this.vfxManager.stop()
    this.bgManager.suspend()
    this.sceneManager.suspend()
    this.collisionServer.disable()
    await this.guiManager.goto(GameOverScene)
  }

  async gotoLoading() {
    this.vfxManager.stop()
    this.collisionServer.disable()
    this.bgManager.suspend()

    await this.guiManager.destroy()

    const bundleIds = [
      "enviroments_bundle",
    ]

    const mainMenuScene = new SceneLoader(
      bundleIds,
      this.guiManager,
      MainMenuScene,
      LoadingScene,
    )

    await mainMenuScene.load()
  }
}
