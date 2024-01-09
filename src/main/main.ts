import { Menu, app } from "electron";
import { settings } from "./modules/settings";

app.on('ready', ()=>{
  Menu.setApplicationMenu(null);

  settings.init();
});

if (process.platform !== 'darwin') {
  app.on('window-all-closed', ()=>app.quit());
}
