import { screen } from "electron";
import { SettingsTemplate, WindowStateTemplate } from "./type";

export function getSettingsTemplate(): SettingsTemplate {
  return {
    theme: 'system',
    locale: [require('../../package.json').defaultLocal],
  };
}

export function getWindowStateTemplate(): WindowStateTemplate {
  let primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  return [true, width, height, 0, 0];
}