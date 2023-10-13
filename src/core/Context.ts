import { AxisAlignedBounds, EventEmitter, Surface } from "core";
import { Manager } from "core/Manager";
import { Container, utils } from "pixi.js";

export class Context<E extends utils.EventEmitter.ValidEventTypes> extends Container {
  name: string;
  manager: Manager<E>;
  surface: Surface;
  bounds: AxisAlignedBounds;
  emitter: EventEmitter<E>;
  constructor() {
    super();
  }
}
