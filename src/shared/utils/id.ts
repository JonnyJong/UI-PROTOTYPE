const startTime = new Date(2024, 0, 1).getTime();
const randomBytesLength = 2;
const randomBytesSize = Math.pow(36, randomBytesLength);

/**
 * Generate a unique ID
 *
 * [Document](https://ui-prototype.jonnys.top/zh/utils/#unid)
 */
export function unid(): string {
  return (
    (Date.now() - startTime).toString(36) +
    Math.floor(Math.random() * randomBytesSize)
      .toString(36)
      .padStart(randomBytesLength, '0')
  );
}
