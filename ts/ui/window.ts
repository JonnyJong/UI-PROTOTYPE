import { BrowserWindow } from "electron";
import { locale } from "./locale";
import { settings } from "../modules/settings";
import path from "path";
import { WindowInitOptions, WindowStateTemplate } from "../type";
import { error } from "../utils/error";
import { getWindowStateTemplate } from "../templates";
import { readConfig, writeConfig } from "../utils/fs";

class WindowState {
  #window: BrowserWindow;
  #id: string;
  #state: WindowStateTemplate = getWindowStateTemplate();
  constructor(window: BrowserWindow, id: string) {
    this.#window = window;
    this.#id = id;
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
  // TODO: set window icon
}
function setWindowEvent(window: BrowserWindow) {
  // TODO: set window event
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

export function initMainWindow(): BrowserWindow {
  let mainWindow = initWindow({
    construct: {
      show: false,
      frame: false,
      resizable: true,
      enableLargerThanScreen: false,
      title: locale('app.name'),
      backgroundColor: settings.theme,
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