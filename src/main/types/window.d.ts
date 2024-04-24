import { BrowserWindow, BrowserWindowConstructorOptions } from "electron";

export type WindowInitOptions = {
  construct?: BrowserWindowConstructorOptions,
  root: string,
  autoShow?: boolean,
  controls?: {
    close: 'close' | 'hide' | 'none',
    resize: boolean,
    minimize: boolean,
  },
};

export type WindowStateTemplate = [
  maximized: boolean,
  width: number,
  height: number,
  x: number,
  y: number,
];

export type WindowIpcEventHandler = (window: BrowserWindow, event: string, ...args: any[])=>any;

export class IWindowState {
  constructor(window: BrowserWindow, id: string);
  save(): Promise<void>;
  show(): Promise<void>;
}

export interface IWindowControls {
  close: 'close' | 'hide' | 'none';
  resize: boolean;
  minimize: boolean;
}

export type WindowConstructorOptions = {
  autoShow?: boolean,
  controls?: {
    close?: 'close' | 'hide' | 'none';
    resize?: boolean;
    minimize?: boolean;
  },
} & BrowserWindowConstructorOptions;

export class IWindow {
  constructor(root: string, options?: WindowConstructorOptions);
  window: BrowserWindow;
  controls: IWindowControls;
  state: IWindowState;
}
