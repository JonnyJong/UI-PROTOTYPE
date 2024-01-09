import { Abortable } from "events";
import { Mode, ObjectEncodingOptions, OpenMode, PathLike } from "fs";
import { FileHandle, mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { Stream } from "stream";
import { getDataPath } from "./path";

/**
 * Writes data to a file, automatically creating the necessary folders if they don't exist.
 * @param file - The path to the file, including the filename.
 * @param data - The data to be written to the file.
 * @param [options] - The encoding or options object.
 * @returns A Promise that resolves when the file has been successfully written.
 * If an error occurs, the Promise is rejected with an Error object.
 */
export async function saveFile(
  file: PathLike | FileHandle,
  data:
    | string
    | NodeJS.ArrayBufferView
    | Iterable<string | NodeJS.ArrayBufferView>
    | AsyncIterable<string | NodeJS.ArrayBufferView>
    | Stream,
  options?:
    | (ObjectEncodingOptions & {
      mode?: Mode | undefined;
      flag?: OpenMode | undefined;
    } & Abortable)
    | BufferEncoding
    | null,
): Promise<void | Error> {
  let dir: string;
  if (typeof file === 'string') {
    dir = file;
  } else if (file instanceof URL) {
    dir = decodeURIComponent(file.pathname);
  } else {
    dir = file.toString();
  }
  dir = path.dirname(dir);
  try {
    await mkdir(dir, { recursive: true });
    await writeFile(file, data, options);
  } catch (error) {
    return error as Error;
  }
}

/**
 * Asynchronously reads a configuration file.
 * @param name - The name or path of the configuration file to read.
 * @param defaultConfig - The default configuration to return if reading fails.
 * @returns - A promise that resolves with the configuration object.
 */
export async function readConfig<T = any>(name: string, defaultConfig: T): Promise<T> {
  let result: T = defaultConfig;
  try {
    result = JSON.parse(await readFile(getDataPath(name + '.json'), 'utf8'));
  } catch { }
  return result;
}

/**
 * Asynchronously writes a configuration object to a file.
 * @param name - The name or path of the configuration file to write.
 * @param config - The configuration object to save.
 * @returns - A promise that resolves when the save is successful
 * or rejects with an Error if the save fails.
 */
export async function writeConfig<T = any>(name: string, config: T): Promise<void | Error> {
  return await saveFile(
    getDataPath(name + '.json'),
    JSON.stringify(config, undefined, 0),
    'utf8',
  );
}
