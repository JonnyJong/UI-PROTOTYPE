import { Menu, app } from "electron";
import { initLock } from "./modules/process-lock";
import { initMainWindow } from "./ui/window";
import { settings } from "./modules/settings";
import { updateLocale } from "./ui/locale";
import { initDevFunction } from "./dev";

initLock();

app.on('ready', async ()=>{
  Menu.setApplicationMenu(null);
  await settings.init();
  await updateLocale();
  const mainWindow = initMainWindow();

  if (!app.isPackaged) initDevFunction(mainWindow);
});