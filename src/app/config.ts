/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Application } from "pixi.js"

export default function config(app: Application) {
  if (process.env.NODE_ENV === 'development') {
    // @ts-ignore
    (window as Window).__PIXI_APP__ = app
  }
}
