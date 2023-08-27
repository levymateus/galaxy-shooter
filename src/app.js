import * as PIXI from 'pixi.js'

export const MAX_X = 3840 / 2;
export const MIN_X = 3840 / 2 * -1;

const app = new PIXI.Application({
  antialias: true,
  resizeTo: window,
});

document.body.appendChild(app.view);

export default app;
