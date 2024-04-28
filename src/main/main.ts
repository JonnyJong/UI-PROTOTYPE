import { Menu, app } from 'electron';
import { settings } from './modules/settings';
import { loadLocales } from './ui/locale';
import { initMainWindow } from './ui/window';
import { initEvents } from './ui/event';
import { initDevFunctions } from './utils/dev';

app.on('ready', async () => {
  Menu.setApplicationMenu(null);

  await settings.init();

  await loadLocales(settings.get('languages'));

  initEvents();

  const mainWindow = initMainWindow();

  // XXX: Dev functions, remove before release
  initDevFunctions(mainWindow.webContents, 'main');
});

if (process.platform !== 'darwin') {
  app.on('window-all-closed', () => app.quit());
}
