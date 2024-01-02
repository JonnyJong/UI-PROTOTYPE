import { getSettingsTemplate } from "../templates";
import { SettingsTemplate } from "../type";
import { error } from "../utils/error";
import { readConfig, writeConfig } from "../utils/fs";

class Settings {
  #data!: SettingsTemplate;
  async init() {
    this.#data = await readConfig<SettingsTemplate>('settings', getSettingsTemplate());
  };
  async save() {
    let err = await writeConfig('settings', this.#data);
    if (!err) return;
    // TODO: Fire Settings Save Failed Event
  };
  get locale(): string[] {
    return [...this.#data.locale];
  };
  set locale(value: string[]) {
    error(Array.isArray(value), 'locale', 'array', value);
    this.#data.locale = value.map((v)=>String(v));
    this.save();
  };
  get theme(): 'system' | 'light' | 'dark' {
    return this.#data.theme;
  };
  set theme(value: 'system' | 'light' | 'dark') {
    error(['system', 'light', 'dark'].includes(value), 'theme', '"system", "light" or "dark"', value);
    this.#data.theme = value;
    this.save();
  };
  // Add other settings here
};

export const settings = new Settings();