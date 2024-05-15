import {
  BrowserWindow,
  BrowserWindowConstructorOptions,
  IpcMainInvokeEvent,
} from 'electron';

/** [Document](https://ui-prototype.jonnys.top/zh/ui/#windowstatetemplate) */
export type WindowStateTemplate = [
  maximized: boolean,
  width: number,
  height: number,
  x: number,
  y: number,
];

/** [Document](https://ui-prototype.jonnys.top/zh/ui/#windowipceventhandler) */
export type WindowIpcEventHandler = (
  window: IWindow,
  event: string,
  ...args: any[]
) => any;

/** [Document](https://ui-prototype.jonnys.top/zh/ui/#iwindowstate) */
export declare class IWindowState {
  constructor(window: IWindow, id: string);
  /** [Document](https://ui-prototype.jonnys.top/zh/ui/#save) */
  save(): Promise<void>;
  /** [Document](https://ui-prototype.jonnys.top/zh/ui/#show) */
  show(): Promise<void>;
}

/** [Document](https://ui-prototype.jonnys.top/zh/ui/#iwindowcontrols) */
export declare class IWindowControls {
  /** [Document](https://ui-prototype.jonnys.top/zh/ui/#close) */
  close: 'close' | 'hide' | 'none';
  /** [Document](https://ui-prototype.jonnys.top/zh/ui/#resize) */
  resize: boolean;
  /** [Document](https://ui-prototype.jonnys.top/zh/ui/#minimize) */
  minimize: boolean;
}

/** [Document](https://ui-prototype.jonnys.top/zh/ui/#windowcontrolsconstructoroptions) */
export interface WindowControlsConstructorOptions {
  close?: 'close' | 'hide' | 'none';
  resize?: boolean;
  minimize?: boolean;
}
/** [Document](https://ui-prototype.jonnys.top/zh/ui/#windowconstructoroptions) */
export interface WindowConstructorOptions
  extends BrowserWindowConstructorOptions {
  /** [Document](https://ui-prototype.jonnys.top/zh/ui/#autoshow) */
  autoShow?: boolean;
  /** [Document](https://ui-prototype.jonnys.top/zh/ui/#controls) */
  controls?: WindowControlsConstructorOptions;
}

/**
 * [Document](https://ui-prototype.jonnys.top/zh/ui/#iwindow)
 */
export declare class IWindow extends BrowserWindow {
  /** [Document](https://ui-prototype.jonnys.top/zh/ui/#_6) */
  constructor(root: string, options?: WindowConstructorOptions);
  /** [Document](https://ui-prototype.jonnys.top/zh/ui/#controls_1) */
  readonly controls: IWindowControls;
  /** [Document](https://ui-prototype.jonnys.top/zh/ui/#state) */
  readonly state: IWindowState;
  /** [Document](https://ui-prototype.jonnys.top/zh/ui/#root) */
  readonly root: string;
  /** [Document](https://ui-prototype.jonnys.top/zh/ui/#getwindowbyevent) */
  static getWindowByEvent(event: IpcMainInvokeEvent): IWindow | null;
}
