import { Menu, app } from "electron";
import { settings } from "./modules/settings";
import { loadLocales } from "./ui/locale";
import { initMainWindow } from "./ui/window";

app.on('ready', async ()=>{
  Menu.setApplicationMenu(null);

  await settings.init();

  await loadLocales(settings.get('languages'));

  const mainWindow = initMainWindow();
});

if (process.platform !== 'darwin') {
  app.on('window-all-closed', ()=>app.quit());
}
