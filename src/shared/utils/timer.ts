/** [Document](https://ui-prototype.jonnys.top/zh/utils/#sleep) */
export function sleep(ms: number = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/** [Document](https://ui-prototype.jonnys.top/zh/utils/#frame) */
export function frame() {
  return new Promise((resolve) => {
    requestAnimationFrame(resolve);
  });
}
