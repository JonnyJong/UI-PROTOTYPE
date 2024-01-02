import { watchFile } from "fs";
import path from "path";
import { updateLocale } from "./ui/locale";
import { BrowserWindow } from "electron";

export function initDevFunction(mainWindow: BrowserWindow) {
  // Locale
  watchFile(path.join(__dirname, '../locales.json'), ()=>updateLocale());
  // Style
  watchFile(path.join(__dirname, '../style.css'), ()=>mainWindow.webContents.reload());
}