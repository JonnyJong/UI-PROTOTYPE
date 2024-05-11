import {
  BrowserWindow,
  IpcMainInvokeEvent,
  nativeTheme,
  screen,
} from 'electron';
import { locale } from './locale';
import { settings } from '../modules/settings';
import {
  IWindow,
  IWindowControls,
  IWindowState,
  WindowConstructorOptions,
  WindowControlsConstructorOptions,
  WindowIpcEventHandler,
  WindowStateTemplate,
} from 'main/types/window';
import { windowBackground } from 'shared/config/default.json';
import { distPath, pathNormalize } from 'shared/utils/path';
import { readConfig, writeConfig } from 'main/utils/fs';

const IpcEventHandlers: { [scope: string]: WindowIpcEventHandler } = {
  win: (window, event) => {
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
      case 'isMaximized':
        return window.webContents.send('win:resize', window.isMaximized());
    }
  },
};

// #region Helpers

function windowIpcHandler(window: Window, channel: string, ...args: any[]) {
  let scope = channel.split(':')[0];
  if (!(scope in IpcEventHandlers)) return;
  IpcEventHandlers[scope](window, channel.slice(scope.length + 1), ...args);
}
function setWindowEvent(window: Window) {
  window.on('blur', () => window.webContents.send('win:active', false));
  window.on('focus', () => window.webContents.send('win:active', true));
  window.on('maximize', () => {
    window.webContents.send('win:resize', true);
    window.webContents.send('win:move', [0, 0]);
  });
  window.on('restore', () => {
    window.webContents.send('win:resize', false);
    window.webContents.send('win:move', window.getPosition());
  });
  window.on('unmaximize', () => {
    window.webContents.send('win:resize', false);
    window.webContents.send('win:move', window.getPosition());
  });
  window.on('resize', () => {
    window.webContents.send('win:resize', window.isMaximized());
    window.webContents.send('win:move', window.getPosition());
  });
  window.on('move', () => {
    window.webContents.send('win:move', window.getPosition());
  });
  window.webContents.on('ipc-message', (_, channel, ...args) =>
    windowIpcHandler(window, channel, ...args)
  );
}

function getWindowBgColor(): string {
  switch (settings.get('theme')) {
    case 'light':
      return windowBackground.light;
    case 'dark':
      return windowBackground.dark;
    default:
      return nativeTheme.shouldUseDarkColors
        ? windowBackground.dark
        : windowBackground.light;
  }
}

function prepareWindowOptions(
  root: string,
  options?: WindowConstructorOptions
): WindowConstructorOptions {
  const defaultPreloadPath = distPath('renderer', root, 'main.js');
  if (!options) {
    options = {};
  }
  if (!options.webPreferences) {
    options.webPreferences = {};
  }
  // Auto Show
  if (options.autoShow) {
    options.show = false;
  }
  // Icon
  switch (process.platform) {
    case 'win32':
      options.icon = distPath('shared/assets/icon.ico');
      break;
    case 'linux':
      options.icon = distPath('shared/assets/icon.png');
      break;
  }
  // Theme
  if (!options.backgroundColor) options.backgroundColor = getWindowBgColor();
  // Title
  if (options.title === undefined) options.title = locale('app.name');
  // Preload
  if (!options.webPreferences.preload) {
    options.webPreferences.preload = defaultPreloadPath;
  }
  return options;
}

function getWindowStateTemplate(): WindowStateTemplate {
  let primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  return [true, width, height, 0, 0];
}

//#region Classes

class WindowState implements IWindowState {
  #window: BrowserWindow;
  #id: string;
  #state: WindowStateTemplate = getWindowStateTemplate();
  constructor(window: BrowserWindow, id: string) {
    this.#window = window;
    this.#id = pathNormalize(id);

    this.#window.on('resized', () => this.save());
    this.#window.on('moved', () => this.save());
    this.#window.on('maximize', () => this.save());
    this.#window.on('unmaximize', () => this.save());
    this.#window.on('restore', () => this.save());
  }
  async save() {
    if (this.#window.isMaximized()) {
      this.#state[0] = true;
    } else {
      let { width, height, x, y } = this.#window.getBounds();
      this.#state = [false, width, height, x, y];
    }
    await writeConfig('win-state-' + this.#id, this.#state);
  }
  async show() {
    this.#state = await readConfig(
      'win-state-' + this.#id,
      getWindowStateTemplate()
    );
    this.#window.setSize(this.#state[1], this.#state[2], false);
    this.#window.setPosition(this.#state[3], this.#state[4], false);
    if (this.#state[0]) return this.#window.maximize();
    this.#window.show();
  }
}

class WindowControls implements IWindowControls {
  #win: BrowserWindow;
  #close: 'close' | 'hide' | 'none' = 'close';
  #resize: boolean = true;
  #minimize: boolean = true;
  constructor(win: BrowserWindow, options?: WindowControlsConstructorOptions) {
    this.#win = win;
    if (!options) return;
    if (options.close) this.close = options.close;
    if (options.resize === false) this.resize = options.resize;
    if (options.minimize === false) this.minimize = options.minimize;
  }
  #updateWindow() {
    this.#win.webContents.send('win:controls', {
      close: this.close,
      resize: this.resize,
      minimize: this.minimize,
    });
  }
  get close() {
    return this.#close;
  }
  set close(value: 'close' | 'hide' | 'none') {
    if (!['close', 'hide', 'none'].includes(value)) return;
    this.#close = value;
    this.#win.setClosable(this.#close === 'close');
    this.#updateWindow();
  }
  get resize() {
    return this.#resize;
  }
  set resize(value: boolean) {
    this.#resize = !!value;
    this.#win.setClosable(this.#resize);
    this.#updateWindow();
  }
  get minimize() {
    return this.#minimize;
  }
  set minimize(value: boolean) {
    this.#minimize = !!value;
    this.#win.setClosable(this.#minimize);
    this.#updateWindow();
  }
}

export class Window extends BrowserWindow implements IWindow {
  controls: IWindowControls;
  state: IWindowState;
  constructor(root: string, options?: WindowConstructorOptions) {
    options = prepareWindowOptions(root, options);
    super(options);
    Window.windows.add(this);
    this.controls = new WindowControls(this, options.controls);
    this.state = new WindowState(this, root);

    setWindowEvent(this);
    this.loadFile(distPath('renderer', root, 'main.html'));

    this.on('closed', () => {
      Window.windows.delete(this);
    });

    if (!options.autoShow) return;
    this.on('ready-to-show', () => this.state.show());
  }
  private static windows: Set<Window> = new Set();
  static getWindowByEvent(event: IpcMainInvokeEvent) {
    let webContents = event.sender;
    for (const window of Window.windows) {
      if (window.webContents === webContents) return window;
    }
    return null;
  }
}

//#region Main Window
/**
 * Initializes the main browser window with predefined options.
 * @returns - The created main browser window.
 */
export function initMainWindow(): Window {
  let mainWindow = new Window('main', {
    autoShow: true,
    frame: false,
    resizable: true,
    enableLargerThanScreen: false,
    // XXX: Modify the following properties
    // minHeight: 0,
    // minWidth: 0,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      defaultEncoding: 'utf-8',
      spellcheck: false,
    },
  });

  nativeTheme.addListener('updated', () => {
    mainWindow.setBackgroundColor(getWindowBgColor());
  });

  return mainWindow;
}
