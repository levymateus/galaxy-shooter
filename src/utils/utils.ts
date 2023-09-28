export function randi(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function randf(min: number, max: number): number {
  return parseFloat((Math.random() * (max - min) + min).toString());
}
