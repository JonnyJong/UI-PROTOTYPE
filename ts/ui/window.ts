import { BrowserWindow, nativeTheme } from "electron";
import { locale } from "./locale";
import { settings } from "../modules/settings";
import path from "path";
import { WindowInitOptions, WindowIpcEventHandler, WindowStateTemplate } from "../type";
import { error } from "../utils/error";
import { BG_DARK, BG_LIGHT, getWindowStateTemplate } from "../template";
import { readConfig, writeConfig } from "../utils/fs";
import { assets } from "../utils/path";

let ipcEventHandlers: { [scope: string]: WindowIpcEventHandler } = {
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
      window.setIcon(assets('icon/icon.ico'));
      break;
    case 'linux':
      window.setIcon(assets('icon/512.png'));
      break;
  }
}

function windowIpcHandler(window: BrowserWindow, channel: string, ...args: any[]) {
  let scope = channel.split(':')[0];
  if (!(scope in ipcEventHandlers)) return;
  ipcEventHandlers[scope](window, channel.slice(scope.length + 1), ...args);
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

export function initWindow(options: WindowInitOptions): BrowserWindow {
  error(typeof options.layout === 'string', 'options.layout', 'string', options.layout);
  error(typeof options.stateId === 'string', 'options.stateId', 'string', options.stateId);
  
  let window = new BrowserWindow(options.construct);
  setWindowIcon(window);
  setWindowEvent(window);
  window.loadFile(path.join(__dirname, '../../', options.layout));

  let state = new WindowState(window, options.stateId);
  if (options.autoShow) window.on('ready-to-show', ()=>state.show());

  return window;
}

function getWindowBgColor(): string {
  switch (settings.theme) {
    case 'light':
      return BG_LIGHT;
    case 'dark':
      return BG_DARK;
    default:
      return nativeTheme.shouldUseDarkColors ? BG_DARK : BG_DARK;
  }
}

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
        preload: path.join(__dirname, '../view/main.js'),
        nodeIntegration: true,
        contextIsolation: false,
        defaultEncoding: 'utf-8',
        spellcheck: false,
      },
    },
    layout: 'index.html',
    autoShow: true,
    stateId: 'main',
  });
  // TODO: Main window event
  return mainWindow;
}