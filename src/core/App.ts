import { Application as PixiJSApplication } from "pixi.js";

export class App {
  static app = new PixiJSApplication({
    backgroundColor: '#000',
    antialias: true,
    resizeTo: window,
  });
}

// @ts-ignore
document.body.appendChild(App.app.view);
