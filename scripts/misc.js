export function generateId() {
  return Math.round(Math.random() * Date.now()).toString(16);
}
