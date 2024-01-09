import { Menu, app } from "electron";
import { settings } from "./modules/settings";
import { loadLocales } from "./ui/locale";

app.on('ready', async ()=>{
  Menu.setApplicationMenu(null);

  await settings.init();

  await loadLocales(settings.get('languages'));
});

if (process.platform !== 'darwin') {
  app.on('window-all-closed', ()=>app.quit());
}
