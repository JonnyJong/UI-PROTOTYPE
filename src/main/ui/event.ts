import { ipcMain, screen } from "electron";
import { getWallpaperPath } from "main/modules/wallpaper";

export function initEvents() {
  ipcMain.handle('win:controls', (event)=>{
    event.sender
  });
  // TODO: 处理获取窗口控制按钮的事件
  ipcMain.handle('os:getScreenSize', () => {
    const display = screen.getDisplayNearestPoint(screen.getCursorScreenPoint());
    return {
      width: Math.floor(display.size.width * display.scaleFactor),
      height: Math.floor(display.size.height * display.scaleFactor),
      scale: display.scaleFactor,
    };
  });
  ipcMain.handle('os:getWallpaperPath', () => {
    return getWallpaperPath();
  });
}
