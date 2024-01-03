import path from "path";

export function assets(...filepath: string[]): string {
  return path.join(__dirname, '../../../assets', ...filepath);
}