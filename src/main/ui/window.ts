import { BrowserWindow, app, nativeTheme, screen } from "electron";
import { locale } from "./locale";
import { settings } from "../modules/settings";
import { WindowInitOptions, WindowIpcEventHandler, WindowStateTemplate } from "main/types/window";
import { windowBackground } from "shared/config/default.json";
import { distPath } from "shared/utils/path";
import { readConfig, writeConfig } from "main/utils/fs";

const IpcEventHandlers: { [scope: string]: WindowIpcEventHandler } = {
  win: (window, event)=>{
    switch (event) {
      case 'minimize':
        return window.minimize();
      case 'resize':
        if (window.isMaximized()) return window.restore();
        return window.maximize();
      case 'close':
        return window.close();
      case 'hide':
        return window.hide();
    }
  },
};

function getWindowStateTemplate(): WindowStateTemplate {
  let primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  return [true, width, height, 0, 0];
}

class WindowState {
  #window: BrowserWindow;
  #id: string;
  #state: WindowStateTemplate = getWindowStateTemplate();
  constructor(window: BrowserWindow, id: string) {
    this.#window = window;
    this.#id = id;

    this.#window.on('resized', ()=>this.save());
    this.#window.on('moved', ()=>this.save());
    this.#window.on('maximize', ()=>this.save());
    this.#window.on('unmaximize', ()=>this.save());
    this.#window.on('restore', ()=>this.save());
  };
  async save() {
    if (this.#window.isMaximized()) {
      this.#state[0] = true;
    } else {
      let { width, height, x, y } = this.#window.getBounds();
      this.#state = [false, width, height, x, y];
    }
    await writeConfig('win-state-' + this.#id, this.#state);
  };
  async show() {
    this.#state = await readConfig('win-state-' + this.#id, getWindowStateTemplate());
    this.#window.setSize(this.#state[1], this.#state[2], false);
    this.#window.setPosition(this.#state[3], this.#state[4], false);
    if (this.#state[0]) return this.#window.maximize();
    this.#window.show();
  };
};

function setWindowIcon(window: BrowserWindow) {
  switch (process.platform) {
    case 'win32':
      window.setIcon(distPath('shared/assets/icon.ico'));
      break;
    case 'linux':
      window.setIcon(distPath('shared/assets/icon.png'));
      break;
  }
}

function windowIpcHandler(window: BrowserWindow, channel: string, ...args: any[]) {
  let scope = channel.split(':')[0];
  if (!(scope in IpcEventHandlers)) return;
  IpcEventHandlers[scope](window, channel.slice(scope.length + 1), ...args);
}
function setWindowEvent(window: BrowserWindow) {
  window.on('blur', ()=>window.webContents.send('win:active', false));
  window.on('focus', ()=>window.webContents.send('win:active', true));
  window.on('maximize', ()=>window.webContents.send('win:resize', true));
  window.on('restore', ()=>window.webContents.send('win:resize', false));
  window.on('unmaximize', ()=>window.webContents.send('win:resize', false));
  window.on('resized', ()=>window.webContents.send('win:resize', window.isMaximized()));
  window.webContents.on('ipc-message', (_, channel, ...args)=>windowIpcHandler(window, channel, ...args));
}

/**
 * Initializes a browser window with specified options.
 * 
 * This function automatically sets the window icon, handles basic events,
 * and manages window position, size, and preloads for improved functionality.
 * @param options - The options for initializing the window.
 * @returns - The created browser window object.
 */
export function initWindow(options: WindowInitOptions): BrowserWindow {
  options.construct!.webPreferences = Object.assign({
    preload: distPath('renderer', options.root, 'main.js'),
  }, options.construct?.webPreferences);

  let window = new BrowserWindow(options.construct);
  setWindowIcon(window);
  setWindowEvent(window);
  window.loadFile(distPath('renderer', options.root, 'main.html'));

  let state = new WindowState(window, options.root.split('/').pop() as string);
  if (options.autoShow) window.on('ready-to-show', ()=>state.show());

  return window;
}

function getWindowBgColor(): string {
  switch (settings.get('theme')) {
    case 'light':
      return windowBackground.light;
    case 'dark':
      return windowBackground.dark;
    default:
      return nativeTheme.shouldUseDarkColors ? windowBackground.dark : windowBackground.light;
  }
}

/**
 * Initializes the main browser window with predefined options.
 * @returns - The created main browser window.
 */
export function initMainWindow(): BrowserWindow {
  let mainWindow = initWindow({
    construct: {
      show: false,
      frame: false,
      resizable: true,
      enableLargerThanScreen: false,
      title: locale('app.name'),
      backgroundColor: getWindowBgColor(),
      // Modify the following properties
      // minHeight: 0,
      // minWidth: 0,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: false,
        defaultEncoding: 'utf-8',
        spellcheck: false,
      },
    },
    root: 'main',
    autoShow: true,
  });

  // Dev
  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }

  return mainWindow;
}
