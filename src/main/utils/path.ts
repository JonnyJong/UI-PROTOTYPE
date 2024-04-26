import { app } from 'electron';
import path from 'path';

/**
 * Retrieves the path for a specified data file.
 * @param filename - The name of the data file for which to retrieve the path.
 * @returns - The complete path of the data file.
 */
export function getDataPath(filename: string): string {
  return path.join(app.getPath('appData'), app.getName(), filename);
}
