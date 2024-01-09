import { readFile } from "fs/promises";
import { LocaleDict, LocaleKeys } from "shared/types/locales";
import { distPath } from "shared/utils/path";
import { alias, fallbackLocales } from "shared/config/locale.json";

let localeDict: LocaleDict = {};

/*
Part: Locale Getter
*/
/**
 * Retrieves the localized value corresponding to the given keys.
 * @param {string} keys - The keys to identify the desired localized value.
 * @returns {string} - The localized value for the specified keys.
 */
export function locale(keys: LocaleKeys): string {
  if (typeof keys !== 'string') return '';
  
  let currentValue: string | LocaleDict = localeDict;
  for (const key of keys.split('.')) {
    if (typeof currentValue !== 'object') return keys;
    currentValue = currentValue[key];
  }

  if (typeof currentValue !== 'string') return keys;
  return currentValue;
}
/**
 * Retrieves the entire localization dictionary.
 * @returns {LocaleDict} - The complete localization dictionary.
 */
export function getLocaleDict(): LocaleDict {
  return localeDict;
}

/*
Part: Locale Loader
*/
/**
 * @internal This function is for internal use only and should not be accessed from outside.
 */
export function deepCopy(target: any, source: any): any {
  if (source === undefined) return target;
  if (typeof source !== 'object') {
    return String(source);
  }

  if (target === undefined) return source;
  
  let result: LocaleDict = {};
  let keys: Set<string> = new Set([...Object.keys(target), ...Object.keys(source)]);
  for (const key of keys) {
    if (typeof source[key] === 'object') {
      result[key] = deepCopy(target[key], source[key]);
    } else if (source[key] !== undefined) {
      result[key] = String(source[key]);
    } else {
      result[key] = target[key];
    }
  }
  return result;
}

function mergeLocale(target: LocaleDict, source: LocaleDict): LocaleDict {
  return deepCopy(target, source);
}

async function readLocaleFile(name: string): Promise<LocaleDict | null> {
  try {
    // Check alias
    if (name in alias) {
      name = alias[name as keyof typeof alias];
    }
    // Read file
    const dictJSON = await readFile(distPath('locales', name + '.json'), 'utf8');
    const dict = JSON.parse(dictJSON);
    if (typeof dict !== 'object') return null;
    return dict;
  } catch {}
  return null;
}

/**
 * Asynchronously loads the specified locales and resolves when the loading is complete.
 * @param {string[]} localesList - An array of locale names to be loaded.
 * @returns {Promise<void>} - Resolves when the locale loading is complete.
 */
export async function loadLocales(localesList: string[]): Promise<void> {
  let newLocaleDict: LocaleDict = {};

  // Copy
  localesList = [...localesList];

  // Fallback
  for (const name of fallbackLocales) {
    if (localesList.includes(name)) continue;
    localesList.push(name);
  }

  // Load from lowest priority
  localesList.reverse();
  for (const name of localesList) {
    const dict = await readLocaleFile(name);
    if (dict === null) continue;
    newLocaleDict = mergeLocale(newLocaleDict, dict);
  }
  
  localeDict = newLocaleDict;
}
