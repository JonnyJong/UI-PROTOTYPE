import { Menu, app } from "electron";
import { initLock } from "./modules/process-lock";
import { initMainWindow } from "./ui/window";
import { settings } from "./modules/settings";
import { updateLocale } from "./ui/locale";
import { initDevFunction } from "./dev";
import { initEvents } from "./modules/event";
import { platform } from "os";

initLock();

app.on('ready', async ()=>{
  Menu.setApplicationMenu(null);
  initEvents();
  await settings.init();
  await updateLocale();
  const mainWindow = initMainWindow();

  if (!app.isPackaged) initDevFunction(mainWindow);
});

if (process.platform !== 'darwin') {
  app.on('window-all-closed', app.quit);
}