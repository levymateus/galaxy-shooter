import { Manager } from "core/Manager";
import { utils } from 'pixi.js';

export class GUIManager<E extends utils.EventEmitter.ValidEventTypes> extends Manager<E> {}
