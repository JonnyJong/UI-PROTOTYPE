import { app, ipcMain, screen } from 'electron';
import { getWallpaperPath } from 'main/modules/wallpaper';
import { getLocaleDict } from './locale';
import { Window } from './window';

export function initEvents() {
  // Locale
  ipcMain.handle('locale:get', () => {
    return getLocaleDict();
  });
  // Window
  ipcMain.handle('win:controls', (event) => {
    let window = Window.getWindowByEvent(event);
    if (!window) return;
    return {
      close: window.controls.close,
      minimize: window.controls.minimize,
      resize: window.controls.resize,
    };
  });
  // OS
  ipcMain.handle('os:getScreenSize', () => {
    const display = screen.getDisplayNearestPoint(
      screen.getCursorScreenPoint()
    );
    return {
      width: Math.floor(display.size.width * display.scaleFactor),
      height: Math.floor(display.size.height * display.scaleFactor),
      scale: display.scaleFactor,
    };
  });
  ipcMain.handle('os:getWallpaperPath', () => {
    return getWallpaperPath();
  });
  // XXX: Dev functions, remove before release
  ipcMain.handle('dev', () => !app.isPackaged);
}
