import { ipcRenderer } from 'electron';
import { initMica } from 'shared/ui/background';
import { initAllComponents } from 'shared/ui/components';
import { loadLocales } from 'shared/ui/locale';
import { pages } from 'shared/ui/pages';
import { titlebar } from 'shared/ui/titlebar';
import { initWindowEvents } from 'shared/ui/window';
import { $ } from 'shared/utils/dom';
import { PageHome } from './pages/home';

document.addEventListener('DOMContentLoaded', async () => {
  initWindowEvents();
  initMica();
  await loadLocales();
  initAllComponents();
  titlebar.init();
  pages.define('home', PageHome);
  pages.init();
  (window as any).pages = pages;
});

// XXX: Dev functions, remove before release
ipcRenderer.invoke('dev').then((isDev) => {
  if (!isDev) return;
  window.addEventListener('keypress', ({ code, ctrlKey }) => {
    if (ctrlKey && code === 'KeyR') location.reload();
  });
  window.addEventListener('keydown', ({ ctrlKey, key }) => {
    if (!ctrlKey) return;
    switch (key) {
      case '=':
        ipcRenderer.send('dev:scale', 0.1);
        break;
      case '-':
        ipcRenderer.send('dev:scale', -0.1);
        break;
      case '0':
        ipcRenderer.send('dev:resetScale');
        break;
    }
  });
  ipcRenderer.on('dev:css', () => {
    $<HTMLLinkElement>('link[rel="stylesheet"]').forEach((link) => {
      let newLink = $.new('link');
      newLink.rel = 'stylesheet';
      newLink.href = link.href.split('?')[0] + '?' + Date.now();
      link.before(newLink);
      link.remove();
    });
  });
});
