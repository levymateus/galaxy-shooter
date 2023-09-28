import { utils } from "pixi.js";

export default class EventEmitter<E extends utils.EventEmitter.ValidEventTypes> extends utils.EventEmitter<E> {
  constructor() {
    super();
  }
}
