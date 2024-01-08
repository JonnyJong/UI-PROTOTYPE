import { Menu, app } from "electron";

app.on('ready', ()=>{
  Menu.setApplicationMenu(null);
});

if (process.platform !== 'darwin') {
  app.on('window-all-closed', ()=>app.quit());
}
