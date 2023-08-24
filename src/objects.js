import app from './app';

let isPaused = false;
const gameObjects = [];

export async function add(object) {
  const gameObject = await object;
  if (gameObject) {
    gameObject.start();
    app.stage.addChild(gameObject.container);
    gameObjects.push(gameObject);
  }
}

export function destroy(object) {
  const index = gameObjects.findIndex(gameObject => gameObject.id === object.id);
  console.log(index, object);
  if (index) {
    gameObjects[index].container.destroy();
    gameObjects.splice(index, 1);
  }
}

export function get() {
  return gameObjects;
}

export function queryByType(type) {
  return gameObjects.filter((object) => object.type === type);
}

export function queryByKey(key) {
  return gameObjects.find((object) => object.key === key);
}

// Game Objects update
app.ticker.add((delta) => {
  gameObjects.forEach((object) => {
    if (object.update && !isPaused) {
      object.update(delta);
    }
  });
});
