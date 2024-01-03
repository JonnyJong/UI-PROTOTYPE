import { screen, systemPreferences } from "electron";
import { SettingsTemplate, WindowStateTemplate } from "./type";

export const DEFAULT_COLOR = '#3E6FC4';
export const BG_LIGHT = '#fff';
export const BG_DARK = '#000';

export function getSettingsTemplate(): SettingsTemplate {
  let color = DEFAULT_COLOR;
  if ('getAccentColor' in systemPreferences) {
    color = systemPreferences.getAccentColor();
  }
  return {
    theme: 'system',
    locale: [require('../../package.json').defaultLocale],
    color: color.slice(0, 7),
  };
}

export function getWindowStateTemplate(): WindowStateTemplate {
  let primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  return [true, width, height, 0, 0];
}