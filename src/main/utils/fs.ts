import { Abortable } from "events";
import { Mode, ObjectEncodingOptions, OpenMode, PathLike } from "fs";
import { FileHandle, mkdir, writeFile } from "fs/promises";
import path from "path";
import { Stream } from "stream";

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
