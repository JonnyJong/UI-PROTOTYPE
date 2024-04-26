import { ipcRenderer } from 'electron';
import { LocaleDict, LocaleKeys } from 'shared/types/locales';

let localeDict: LocaleDict = {};

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

export async function loadLocales() {
  localeDict = await ipcRenderer.invoke('locale:get');
}
