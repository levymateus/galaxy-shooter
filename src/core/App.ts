import { Application as PixiJSApplication } from "pixi.js";
import Settings from "core/Settings";

// Static singleton app instance.
export class App {
  static app = new PixiJSApplication({
    backgroundColor: '#000',
    antialias: true,
    resizeTo: window,
  });
  static settings = new Settings();
}

// @ts-ignore
document.body.appendChild(App.app.view);
