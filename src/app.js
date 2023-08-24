import * as PIXI from 'pixi.js'

const view = document.getElementById('app');

const app = new PIXI.Application({
  background: '#0001',
  view: view,
  resizeTo: view,
});

if (!view) {
  document.body.appendChild(app.view);
}

export default app;
