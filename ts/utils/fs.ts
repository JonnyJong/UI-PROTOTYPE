import { app } from "electron";
import { Abortable } from "events";
import { Mode, ObjectEncodingOptions, OpenMode, PathLike } from "fs";
import { FileHandle, mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { Stream } from "stream";
import { error, errorText } from "./error";

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
  } else if (Buffer.isBuffer(file)) {
    dir = file.toString();
  } else {
    throw new Error(errorText('file', 'type string or an instance of Buffer or URL', file));
  }
  dir = path.dirname(dir);
  try {
    await mkdir(dir, { recursive: true });
    await writeFile(file, data, options);
  } catch (error) {
    return error as Error;
  }
}

function configPath(name: string, dir?: string): string {
  error(typeof name === 'string', 'name', 'type string', name);
  let filepath: string;
  if (typeof dir === 'string') {
    filepath = path.join(dir, name);
  } else {
    filepath = path.join(app.getPath('appData'), '.' + app.getName(), name);
  }
  filepath += '.json';
  return filepath;
}

export async function readConfig<T = any>(name: string, defaultConfig: T, dir?: string): Promise<T> {
  let result: T = defaultConfig;
  try {
    result = JSON.parse(await readFile(configPath(name, dir), 'utf8'));
  } catch { }
  return result;
}

export async function writeConfig<T = any>(name: string, config: T, dir?: string): Promise<void | Error> {
  return await saveFile(configPath(name, dir), JSON.stringify(config, undefined, 0), 'utf8');
}