export function sleep(ms: number = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function frame() {
  return new Promise((resolve) => {
    requestAnimationFrame(resolve);
  });
}
