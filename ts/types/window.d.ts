import { BrowserWindow, BrowserWindowConstructorOptions } from "electron";

export type WindowInitOptions = {
  construct?: BrowserWindowConstructorOptions,
  layout: string,
  stateId: string,
  autoShow?: boolean,
};

export type WindowStateTemplate = [
  maximized: boolean,
  width: number,
  height: number,
  x: number,
  y: number,
];

export type WindowIpcEventHandler = (window: BrowserWindow, event: string, ...args: any[])=>any;