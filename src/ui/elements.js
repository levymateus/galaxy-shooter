import app from "../app";

const elements = [];

export function getElementById(id) {
  return elements.find((el) => el.id === id);
}

export function add(el) {
  el.container.addChild(el.text);
  app.stage.addChild(el.container);
  elements.push(el);
}

export function remove(el) {
  elements.splice(elements.findIndex(({ id }) => id === el.id))
}
