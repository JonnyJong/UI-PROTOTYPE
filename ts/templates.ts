import { screen, systemPreferences } from "electron";
import { SettingsTemplate, WindowStateTemplate } from "./type";

export const DEFAULT_COLOR = '#3E6FC4';

export function getSettingsTemplate(): SettingsTemplate {
  let color = systemPreferences.getAccentColor();
  if (color.length === 0) color = DEFAULT_COLOR;
  return {
    theme: 'system',
    locale: [require('../../package.json').defaultLocal],
    color: color.slice(0, 7),
  };
}

export function getWindowStateTemplate(): WindowStateTemplate {
  let primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  return [true, width, height, 0, 0];
}