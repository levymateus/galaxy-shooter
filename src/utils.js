
export function randomInt(a, b) {
  return Math.floor(Math.random() * (b - a + 1) + a);
}

export function randomFloat(min, max) {
  let cal = (Math.random() * (max - min) + min);
  return parseFloat(cal);
}
