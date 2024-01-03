import { app, ipcMain } from "electron";
import { settings } from "./settings";

export function initEvents() {
  ipcMain.handle('dev:check', ()=>!app.isPackaged);
  ipcMain.handle('theme:get_color', ()=>settings.color);
}