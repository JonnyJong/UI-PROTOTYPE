import { SettingsTemplate } from "../type";

export function getSettingsTemplate(): SettingsTemplate {
  return {
    theme: 'system',
    locale: [require('../../package.json').defaultLocal],
  };
}