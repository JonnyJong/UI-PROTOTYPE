import { ipcRenderer } from 'electron';

/**
 * Initializes window events.
 *
 * [Document](https://ui-prototype.jonnys.top/zh/ui/#initwindowevents)
 */
export function initWindowEvents() {
  ipcRenderer.on('win:active', (_, isFocus) => {
    document.body.classList.toggle('blur', !isFocus);
  });
  ipcRenderer.on('win:resize', (_, isMaximized) => {
    document.body.classList.toggle('maximized', isMaximized);
  });
  ipcRenderer.send('win:isMaximized');
}
