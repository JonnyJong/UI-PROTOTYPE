import { screen } from "electron";
import { SettingsTemplate, WindowStateTemplate } from "./type";

export function getSettingsTemplate(): SettingsTemplate {
  return {
    theme: 'system',
    locale: [require('../../package.json').defaultLocal],
  };
}
