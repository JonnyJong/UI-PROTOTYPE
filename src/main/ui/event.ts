import { ipcMain } from "electron";

export function initEvents() {
  ipcMain.handle('win:controls', (event)=>{
    event.sender
  });
}
