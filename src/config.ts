import { Application } from "pixi.js";

export default function config(app: Application) {
  if (process.env.NODE_ENV === 'development') {
    (window as any).__PIXI_APP__ = app;
  }
}
