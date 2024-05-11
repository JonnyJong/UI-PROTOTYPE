import {
  BrowserWindow,
  BrowserWindowConstructorOptions,
  IpcMainInvokeEvent,
} from 'electron';

export type WindowStateTemplate = [
  maximized: boolean,
  width: number,
  height: number,
  x: number,
  y: number,
];

export type WindowIpcEventHandler = (
  window: IWindow,
  event: string,
  ...args: any[]
) => any;

export class IWindowState {
  constructor(window: IWindow, id: string);
  save(): Promise<void>;
  show(): Promise<void>;
}

export class IWindowControls {
  close: 'close' | 'hide' | 'none';
  resize: boolean;
  minimize: boolean;
}

export interface WindowControlsConstructorOptions {
  close?: 'close' | 'hide' | 'none';
  resize?: boolean;
  minimize?: boolean;
}
export interface WindowConstructorOptions
  extends BrowserWindowConstructorOptions {
  autoShow?: boolean;
  controls?: WindowControlsConstructorOptions;
}

export declare class IWindow extends BrowserWindow {
  constructor(root: string, options?: WindowConstructorOptions);
  controls: IWindowControls;
  state: IWindowState;
  static getWindowByEvent(event: IpcMainInvokeEvent): IWindow | null;
}
