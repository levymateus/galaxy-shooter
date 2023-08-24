import { create } from './observable';

const keyStatus = new Map();
const observable = create();

function handleKeydown(evt) {
  assertKeyStatus(evt.key);
  keyStatus.set(evt.key, { keydown: true, keyup: false });
  observable.notify(evt.key, { keydown: true, keyup: false });
}

function handleKeyUp(evt) {
  assertKeyStatus(evt.key);
  keyStatus.set(evt.key, { keydown: false, keyup: true });
}

function assertKeyStatus(key) {
  if (!keyStatus.get(key)) {
    keyStatus.set(key, { keydown: false, keyup: false });
  }
}

export function isKeyDown(key) {
  assertKeyStatus(key);
  return keyStatus.get(key).keydown;
}

export function listen(key, callback) {
  assertKeyStatus(key);
  observable.listen(key, callback);
}

window.addEventListener('keydown', handleKeydown);
window.addEventListener('keyup', handleKeyUp);
