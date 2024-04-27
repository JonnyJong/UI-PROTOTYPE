const start = new Date(2024, 0, 1).getTime();
const randomBytes = Math.pow(36, 2);

export function unid(): string {
  return (
    (Date.now() - start).toString(36) +
    Math.floor(Math.random() * randomBytes).toString(36)
  );
}
