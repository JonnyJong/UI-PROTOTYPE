import {
  Deserializers,
  SerializedData,
  Serializers,
  SettingsErrorCode,
  SettingsKeyMap,
  Validators,
} from 'shared/types/settings';
import { color as DEFAULT_COLOR } from 'shared/config/default.json';
import { app, systemPreferences } from 'electron';
import * as t from 'io-ts';
import { isLeft } from 'fp-ts/Either';
import rfdc from 'rfdc';
import { writeConfig } from 'main/utils/fs';
import { getDataPath } from 'main/utils/path';
import { readFile } from 'fs/promises';

function getDefaultSettings(): SettingsKeyMap {
  let color = DEFAULT_COLOR;
  if ('getAccentColor' in systemPreferences) {
    color = systemPreferences.getAccentColor();
  }
  return {
    languages: app.getPreferredSystemLanguages(),
    theme: 'system',
    color: color.slice(0, 7),
  };
}

const Validators: Validators = {
  languages: t.array(t.string),
  theme: t.union([t.literal('system'), t.literal('light'), t.literal('dark')]),
  color: t.string,
};

const Serializers: Serializers = {};

const Deserializers: Deserializers = {};

class Settings {
  #settings: SettingsKeyMap = getDefaultSettings();
  /**
   * Asynchronously initializes the settings.
   *
   * The initialization must be completed before reading or modifying the settings.
   * @returns A promise that resolves once the initialization is complete.
   */
  async init() {
    let data: { [key: string]: SerializedData };
    // Load from JSON
    try {
      let json = await readFile(getDataPath('settings.json'), 'utf8');
      data = JSON.parse(json);
    } catch {
      return;
    }
    // Deserialize
    for (const key of Object.keys(data) as [keyof SettingsKeyMap]) {
      if (!(key in this.#settings)) continue;
      // XXX: Note the deserialization and check types
      if (key in Deserializers) {
        this.#settings[key] = Deserializers[key]!(data[key]) as any;
      } else if (!isLeft(Validators[key].decode(data[key]))) {
        this.#settings[key] = data[key] as any;
      }
    }
  }
  /**
   * Asynchronously saves the application settings.
   * @returns A promise that resolves once the settings have been successfully saved.
   */
  async save() {
    let data: { [key: string]: SerializedData } = {};
    // Serialize
    for (const key of Object.keys(this.#settings) as [keyof SettingsKeyMap]) {
      const serializer = Serializers[key];
      const value = this.#settings[key];
      // HACK: The expected type is SettingsKeyMap[key],
      //       but the editor doesn't recognize it, so it uses as any
      data[key] = serializer
        ? serializer(value as any)
        : (value as SerializedData);
    }
    // Save as JSON
    await writeConfig('settings', data);
  }
  /**
   * Retrieves the value of a specific setting.
   * @param key - The key of the setting to retrieve.
   * @returns - The value of the specified setting.
   */
  get<T extends keyof SettingsKeyMap>(key: T): SettingsKeyMap[T] {
    return rfdc()(this.#settings[key]);
  }
  /**
   * Modifies the value of a specific setting.
   * @param key - The key of the setting to modify.
   * @param value - The new value for the specified setting.
   * @returns - Returns undefined if the modification is successful.
   * Returns 'INVALID_KEY' if the setting key does not exist.
   * Returns 'INVALID_VALUE' if the provided value fails validation.
   */
  set<T extends keyof SettingsKeyMap>(
    key: T,
    value: SettingsKeyMap[T]
  ): undefined | SettingsErrorCode {
    if (!(key in this.#settings)) return 'INVALID_KEY';
    if (isLeft(Validators[key].decode(value))) return 'INVALID_VALUE';

    this.#settings[key] = value;
    this.save();
    return;
  }
  /**
   * Resets all settings to default values.
   */
  reset() {
    this.#settings = getDefaultSettings();
    this.save();
  }
}

export const settings = new Settings();
