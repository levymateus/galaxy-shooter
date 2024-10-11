import { ActivityCtor, Manager } from "core"
import { Assets } from "pixi.js"

export class SceneLoader {
  constructor(
    readonly bundleIds: string[],
    readonly manager: Manager,
    readonly NextActivity: ActivityCtor,
    readonly LoadingScene: ActivityCtor,
  ) {

  }

  async load() {
    await this.manager.goto(this.LoadingScene)
    if (this.manager.activity) {
      await Assets.loadBundle(this.bundleIds)
      await this.manager.goto(this.NextActivity)
    } else {
      throw new Error('No current activity is running.')
    }
  }
}
