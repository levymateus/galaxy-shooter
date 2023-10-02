import { Emitter, EmitterConfigV3 } from "@pixi/particle-emitter";
import { Container, Ticker } from "pixi.js";

export default class VFXManager {

  private static VFX_MANAGER_NAME = "VFX_WRAPPER";
  private static VFX_MANAGER_INSTANCE: VFXManager;
  private static VFX_MANAGER_PARENT_CONTAINER: Container;
  private wrapper: Container;
  private ticker: Ticker;

  constructor(parent: Container) {
    VFXManager.VFX_MANAGER_PARENT_CONTAINER = parent;
    const wrapper = parent.getChildByName(VFXManager.VFX_MANAGER_NAME, true) || new Container();
    if (!(wrapper instanceof Container))
      throw new Error(
        `${VFXManager.VFX_MANAGER_NAME} parent is not a valid instance of Container`
      );
    wrapper.name = VFXManager.VFX_MANAGER_NAME;
    /**
     * An error `Uncaught TypeError: currentTarget.isInteractive is not a function` occur
     * when a mouse event is fired and this Emitter is running on.
     * Then eventMode needs to be `none`.
     */
    wrapper.eventMode = "none";
    this.wrapper = wrapper;
    this.ticker = Ticker.shared;
    this.wrapper.setParent(parent);
  }

  public static getInstance(): VFXManager {
    if (!VFXManager.VFX_MANAGER_INSTANCE) {
      VFXManager.VFX_MANAGER_INSTANCE = new VFXManager(VFXManager.VFX_MANAGER_PARENT_CONTAINER);
    }
    return VFXManager.VFX_MANAGER_INSTANCE;
  }

  public emit(config: EmitterConfigV3): void {
    const emitter = new Emitter(this.wrapper, config)
    const update = (dt: number) => emitter.update(dt * 0.01);
    emitter.emit = true;
    emitter.playOnce(() => this.ticker.remove(update, this));
    this.ticker.add(update, this);
  }

  public destroy(): void {
    this.wrapper.destroy({ children: true });
  }
};
