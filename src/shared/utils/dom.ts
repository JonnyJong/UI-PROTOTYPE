/* 
This module only work on renderer process!
*/

import path from 'path';
import { render, renderFile } from 'pug';

function getRendererCwd() {
  let mod = module;
  while (mod.parent) mod = mod.parent;
  return mod.path;
}
const layoutRoot = path.join(getRendererCwd(), 'views');
const sharedLayoutRoot = path.join(__dirname, 'views');

interface DOMTagNameMap extends HTMLElementTagNameMap {
  // Add custom elements here
}

class Class<T extends HTMLElement> {
  #dom: Dom<T>;
  constructor(dom: Dom<T>) {
    this.#dom = dom;
  }
  add(...args: string[]) {
    for (const dom of this.#dom) {
      dom.classList.add(...args);
    }
  }
  contains(name: string): boolean {
    return this.#dom.every((e) => e.classList.contains(name));
  }
  remove(...args: string[]) {
    for (const dom of this.#dom) {
      dom.classList.remove(...args);
    }
  }
  replace(name: string, newName: string) {
    for (const dom of this.#dom) {
      dom.classList.replace(name, newName);
    }
  }
  toggle(name: string, force?: boolean) {
    for (const dom of this.#dom) {
      dom.classList.toggle(name, force);
    }
  }
  setClassText(text: string) {
    for (const dom of this.#dom) {
      dom.className = text;
    }
  }
}
class Attribute<T extends HTMLElement> {
  #dom: Dom<T>;
  constructor(dom: Dom<T>) {
    this.#dom = dom;
  }
  get(name: string) {
    if (!this.#dom.length) return;
    return this.#dom.at(0).getAttribute(name);
  }
  set(name: string, value: string) {
    for (const dom of this.#dom) {
      dom.setAttribute(name, value);
    }
  }
  remove(name: string) {
    for (const dom of this.#dom) {
      dom.removeAttribute(name);
    }
  }
}

export class Dom<T extends HTMLElement = HTMLElement> {
  #doms: T[] = [];
  #class: Class<T>;
  #attr: Attribute<T>;
  #dataset = new Proxy<{ [x: string]: string | undefined }>(
    {},
    {
      has: (_, p) => {
        if (typeof p !== 'string') return false;
        return this.#doms.every((e) => typeof e.dataset[p] === 'string');
      },
      get: (_, p) => {
        if (typeof p !== 'string') return;
        return this.#doms[0]?.dataset[p];
      },
      set: (_, p, value) => {
        if (typeof p !== 'string') return false;
        for (const dom of this.#doms) {
          dom.dataset[p] = value;
        }
        return true;
      },
      deleteProperty: (_, p) => {
        if (typeof p !== 'string') return false;
        for (const dom of this.#doms) {
          delete dom.dataset[p];
        }
        return true;
      },
    }
  );
  //#region Create Method
  constructor(...args: (string | T | Dom<T>)[]) {
    this.#class = new Class(this);
    this.#attr = new Attribute(this);
    for (const arg of args) {
      if (typeof arg === 'string') {
        document.querySelectorAll<T>(arg).forEach((e) => this.#doms.push(e));
        continue;
      }
      if (arg instanceof HTMLElement) {
        this.#doms.push(arg);
        continue;
      }
      if (arg instanceof Dom) {
        this.#doms.push(...arg.#doms);
        continue;
      }
    }
  }
  static pug<T extends HTMLElement = HTMLElement>(
    pug: string,
    options?: any
  ): Dom<T> {
    return Dom.html<T>(render(pug, options));
  }
  static html<T extends HTMLElement = HTMLElement>(html: string): Dom<T> {
    let dom = document.createElement('div');
    dom.innerHTML = html;
    return new Dom<T>(
      ...[...dom.children].map((e) => {
        e.remove();
        return e as T;
      })
    );
  }
  static layout<T extends HTMLElement = HTMLElement>(
    name: string,
    option?: any,
    shared: boolean = false
  ): Dom<T> {
    return Dom.html<T>(
      renderFile(
        path.join(shared ? sharedLayoutRoot : layoutRoot, name + '.pug'),
        option
      )
    );
  }
  static new<K extends keyof DOMTagNameMap>(
    tagName: K,
    pack?: false
  ): DOMTagNameMap[K];
  static new<K extends keyof DOMTagNameMap>(
    tagName: K,
    pack: true
  ): Dom<DOMTagNameMap[K]>;
  static new<K extends keyof DOMTagNameMap>(
    tagName: K,
    pack: boolean = false
  ): DOMTagNameMap[K] | Dom<DOMTagNameMap[K]> {
    let dom = document.createElement(tagName);
    if (!pack) return dom;
    return new Dom<DOMTagNameMap[K]>(dom);
  }
  filter(callback: (value: T, index: number, array: T[]) => boolean) {
    return new Dom<T>(...this.#doms.filter(callback));
  }
  query<T extends HTMLElement = HTMLElement>(selector: string): Dom<T> {
    let doms: T[] = [];
    for (const dom of this.#doms) {
      doms.push(...(dom.querySelectorAll(selector) as unknown as T[]));
    }
    return new Dom<T>(...doms);
  }
  map(callback: (value: T, index: number, array: T[]) => T) {
    return new Dom<T>(...this.#doms.map(callback));
  }
  get children() {
    let children = [];
    for (const dom of this.#doms) {
      children.push(...(dom.children as unknown as HTMLElement[]));
    }
    return new Dom<HTMLElement>(...children);
  }
  //#region Readonly Properties
  get class() {
    return this.#class;
  }
  get attr() {
    return this.#attr;
  }
  get length() {
    return this.#doms.length;
  }
  get rect(): DOMRect {
    if (!this.#doms.length) {
      let rect = {
        height: 0,
        width: 0,
        x: 0,
        y: 0,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        toJSON: () => rect,
      };
      return rect;
    }
    return this.#doms[0].getBoundingClientRect();
  }
  get id(): string | undefined {
    return this.#doms[0]?.id;
  }
  set id(value: string) {
    for (const dom of this.#doms) {
      dom.id = value;
    }
  }
  get data() {
    return this.#dataset;
  }
  //#region Other
  [Symbol.iterator]() {
    return this.#doms[Symbol.iterator]();
  }
  at(i: number) {
    return this.#doms[i];
  }
  forEach(callback: (value: T, index: number, array: T[]) => void) {
    this.#doms.forEach(callback);
  }
  every(callback: (value: T, index: number, array: T[]) => boolean) {
    return this.#doms.every(callback);
  }
  any(callback: (value: T, index: number, array: T[]) => boolean) {
    return this.#doms.some(callback);
  }
  before(...args: (Dom | HTMLElement | string)[]) {
    let doms = new Dom(...args);
    if (this.length === 1) {
      this.#doms[0].before(...doms);
      return;
    }
    for (const dom of this.#doms) {
      dom.before(...doms.map((e) => e.cloneNode(true) as HTMLElement));
    }
  }
  prepend(...args: (Dom | HTMLElement | string)[]) {
    let doms = new Dom(...args);
    if (this.length === 1) {
      this.#doms[0].prepend(...doms);
      return;
    }
    for (const dom of this.#doms) {
      dom.prepend(...doms.map((e) => e.cloneNode(true) as HTMLElement));
    }
  }
  append(...args: (Dom | HTMLElement | string)[]) {
    let doms = new Dom(...args);
    if (this.length === 1) {
      this.#doms[0].append(...doms);
      return;
    }
    for (const dom of this.#doms) {
      dom.append(...doms.map((e) => e.cloneNode(true) as HTMLElement));
    }
  }
  after(...args: (Dom | HTMLElement | string)[]) {
    let doms = new Dom(...args);
    if (this.length === 1) {
      this.#doms[0].after(...doms);
      return;
    }
    for (const dom of this.#doms) {
      dom.after(...doms.map((e) => e.cloneNode(true) as HTMLElement));
    }
  }
  on<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void;
  on(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ) {
    for (const dom of this.#doms) {
      dom.addEventListener(type, listener, options);
    }
  }
  off<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void;
  off(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ) {
    for (const dom of this.#doms) {
      dom.removeEventListener(type, listener, options);
    }
  }
}

export function $<T extends HTMLElement = HTMLElement>(
  ...args: (string | T | Dom<T>)[]
): Dom<T> {
  return new Dom<T>(...args);
}
$.pug = Dom.pug;
$.html = Dom.html;
$.layout = Dom.layout;
$.new = Dom.new;
