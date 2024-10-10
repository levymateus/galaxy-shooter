import { DEFAULT_Z_INDEX } from "app/consts"
import stores from "app/stores"
import { Core, Settings, Surface } from "core"
import { CollisionServer } from "core/CollisionServer"
import { Countdown } from "core/Countdown"
import { ModuleManager } from "core/ModuleManager"
import { Application, utils } from "pixi.js"
import GameOverScene from "scenes/GameOverScene"
import LoadingScene from "scenes/LoadingScene"
import MainMenuScene from "scenes/MainMenuScene"
import MainScene from "scenes/MainScene"
import ParallaxStarryBackground from "scenes/ParallaxStarryBackground"
import VFX from "scenes/VFX"
import { EventNamesEnum } from "typings/enums"
import { HUD } from "ui/HUD"
import { PauseMenu } from "ui/PauseMenu"
import { MathUtils } from "utils/utils"
import { BgManager } from "./BgManager"
import { GUIManager } from "./GUIManager"
import { SceneManager } from "./SceneManager"
import VFXManager from "./VFXManager"

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
  ) {
    this.guiManager = moduleManager.addSingleton<GUIManager>(GUIManager,
      app.ticker,
      app.stage,
      app.screen,
      surface,
      bounds,
      emitter,
      DEFAULT_Z_INDEX,
    )

    this.bgManager = moduleManager.addSingleton<BgManager>(BgManager,
      app.ticker,
      app.stage,
      app.screen,
      surface,
      bounds,
      emitter,
      DEFAULT_Z_INDEX,
    )

    this.sceneManager = moduleManager.addSingleton<SceneManager>(SceneManager,
      app.ticker,
      app.stage,
      app.screen,
      surface,
      bounds,
      emitter,
      DEFAULT_Z_INDEX,
    )

    this.vfxManager = moduleManager.addSingleton<VFXManager>(VFXManager,
      app.ticker,
      app.stage,
      app.screen,
      surface,
      bounds,
      emitter,
      DEFAULT_Z_INDEX,
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
  }

  private async doStartApp() {
    await this.gotoMainScene()
    stores.appIsGameOver = false
    await this.cd.count(MathUtils.sec2ms(2))
  }

  private async doGameOverApp() {
    stores.appIsGameOver = true
    await this.cd.count(MathUtils.sec2ms(2))
    await this.gotoGameOver()
  }

  async startUpApp() {
    await this.vfxManager.goto(VFX)
    await this.gotoLoading()
  }

  async gotoMainMenu() {
    this.vfxManager.stop()
    await this.bgManager.goto(ParallaxStarryBackground)
    this.collisionServer.disable()
    await this.guiManager.goto(MainMenuScene)
  }

  async gotoMainScene() {
    this.vfxManager.play()
    await this.bgManager.goto(ParallaxStarryBackground)
    await this.guiManager.goto(HUD)
    this.collisionServer.enable()
    await this.sceneManager.goto(MainScene)
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
    await this.guiManager.destroy()
    this.collisionServer.disable()
    await this.sceneManager.goto(LoadingScene)
  }

  async gotoPauseMenu() {
    this.vfxManager.stop()
    this.bgManager.suspend()
    this.sceneManager.suspend()
    this.collisionServer.disable()
    await this.guiManager.goto(PauseMenu)
  }
}
