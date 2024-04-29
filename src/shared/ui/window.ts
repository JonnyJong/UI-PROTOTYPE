import { ipcRenderer } from 'electron';

/**
 * Initializes window events.
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
