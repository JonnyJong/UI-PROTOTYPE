import { BrowserWindow, app } from "electron";

export function initLock() {
  if (!app.requestSingleInstanceLock()) {
    return app.quit();
  }
}