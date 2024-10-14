import { PREFER_WORKERS } from "./consts"
import { Store } from "../managers/Store"

export const bootstrap = async () => {
  import("pixi.js").then(({
    Assets,
    utils: { EventEmitter }
  }) => {
    Assets.setPreferences({
      preferWorkers: PREFER_WORKERS,
    })

    import("./appSetup").then(({ app }) => {
      import("core").then(({ Core, Settings, Surface, ModuleManager }) => {
        const emitter = new EventEmitter()

        const appSettings = Settings.getInstance()

        const res = appSettings.getDefaultResolution()

        const surface = new Surface(app.screen, res)

        const bounds = new Core.AxisAlignedBounds(
          0, 0,
          surface.width,
          surface.height
        )

        bounds.anchor.set(0.5)

        const store = new Store()

        import("managers/AppManager").then(({ AppManager }) => {
          const moduleManager = new ModuleManager()

          const appManager = new AppManager(
            app,
            appSettings,
            emitter,
            surface,
            bounds,
            moduleManager,
            store,
          )

          appManager.startUpApp()
        })
      })
    })
  })
}
