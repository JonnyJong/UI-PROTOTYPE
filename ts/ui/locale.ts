import { readFile } from "fs/promises";
import { settings } from "../modules/settings";
import { LocaleKeys } from "../type";
import { error } from "../utils/error";
import path from "path";
import { ipcMain } from "electron";

let locales: any[] = [];
export async function updateLocale() {
  locales = [];
  for (const localeId of settings.locale) {
    try {
      locales.push(JSON.parse(await readFile(path.join(__dirname, '../../locale', localeId + '.json'), 'utf8')));
    } catch {}
  }
}

function walkLocale(locale: any, keys: LocaleKeys): string | undefined {
  let current = locale;
  for (const key of keys.split('.')) {
    current = current[key];
    if (['string', 'undefined'].includes(typeof current)) return current;
  }
  return undefined;
}
export function locale(keys: LocaleKeys): string {
  error(typeof keys === 'string', 'keys', 'type string', keys);
  for (const locale of locales) {
    let result = walkLocale(locale, keys);
    if (typeof result === 'string') return result;
  }
  return keys;
}

export async function initLocale() {
  await updateLocale();
  ipcMain.handle('locale:get', (_, keys: LocaleKeys)=>{
    if (typeof keys !== 'string') return String(keys);
    return locale(keys);
  });
}