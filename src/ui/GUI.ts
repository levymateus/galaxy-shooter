import { Group, Layer } from "@pixi/layers";
import { AxisAlignedBounds, EventEmitter } from "core";
import { utils } from "pixi.js";

export default class GUI<E extends utils.EventEmitter.ValidEventTypes> extends Layer {
  public name: string;
  public group: Group;
  public emitter: EventEmitter<E>;
  public bounds: AxisAlignedBounds;

  constructor(name: string) {
    super();
    this.name = name;
  }
}
