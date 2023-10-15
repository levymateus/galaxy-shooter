import { Manager } from "core/Manager";
import { utils } from 'pixi.js';

/**
 * Game Graphic User Interface Manager.
 */
export class GUIManager<E extends utils.EventEmitter.ValidEventTypes> extends Manager<E> {}
