import { app, ipcMain } from "electron";

export function initEvents() {
  ipcMain.handle('dev:check', ()=>!app.isPackaged);
}