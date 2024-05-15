/* 
This module only work on renderer process!
*/

import path from 'path';
import { render, renderFile } from 'pug';
import {
  CSSTokens,
  DOMTagNameMap,
  IDomAttribute,
  IDomClass,
} from 'shared/types/dom';

function getRendererCwd() {
  let mod = module;
  while (mod.parent) mod = mod.parent;
  return mod.path;
}
const layoutRoot = path.join(getRendererCwd(), 'views');
const sharedLayoutRoot = path.join(__dirname, 'views');

const DEFAULT_LAYOUT_API = {
  config: (file: string, keys: string): any => {
    if (typeof file !== 'string') return;
    if (typeof keys !== 'string') return;

    let config;
    try {
      config = require(path.join(__dirname, '../config', file + '.json'));
    } catch {
      return;
    }

    for (const key of keys.split('.')) {
      if (typeof config !== 'object') return;
      config = config[key];
    }

    return config;
  },
};

function getLayoutAPI(options?: any): any {
  if (typeof options !== 'object') return Object.assign({}, DEFAULT_LAYOUT_API);
  return Object.assign(DEFAULT_LAYOUT_API, options);
}

class Class<T extends HTMLElement> implements IDomClass<T> {
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
class Attribute<T extends HTMLElement> implements IDomAttribute<T> {
  #dom: Dom<T>;
  constructor(dom: Dom<T>) {
    this.#dom = dom;
  }
  get(name: string) {
    return this.#dom.doms.map((e) => e.getAttribute(name));
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

/** [Document](https://ui-prototype.jonnys.top/zh/utils/#dom_1) */
export class Dom<T extends HTMLElement = HTMLElement> {
  #doms: T[] = [];
  #class: IDomClass<T>;
  #attr: IDomAttribute<T>;
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
  #style = new Proxy<CSSTokens>({} as CSSTokens, {
    get: (_, p) => {
      if (typeof p !== 'string') return false;
      if (p.startsWith('--')) return this.#doms[0]?.style.getPropertyValue(p);
      return this.#doms[0]?.style[p as any];
    },
    set: (_, p, value) => {
      if (typeof p !== 'string') return false;
      for (const dom of this.#doms) {
        if (p.startsWith('--')) {
          dom.style.setProperty(p, value);
          continue;
        }
        dom.style[p as any] = value;
      }
      return true;
    },
    deleteProperty: (_, p) => {
      if (typeof p !== 'string') return false;
      for (const dom of this.#doms) {
        if (p.startsWith('--')) {
          dom.style.removeProperty(p);
          continue;
        }
        dom.style[p as any] = '';
      }
      return true;
    },
  });
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
        this.#doms.push(...arg.map((e) => e));
        continue;
      }
    }
  }
  /**
   * Building the DOM from pug template
   * @param pug Template content
   * @param option Template compile options
   *
   * [Document](https://ui-prototype.jonnys.top/zh/utils/#pug)
   */
  static pug<T extends HTMLElement = HTMLElement>(
    pug: string,
    options?: any
  ): Dom<T> {
    return Dom.html<T>(render(pug, getLayoutAPI(options)));
  }
  /**
   * Building the DOM from html
   *
   * [Document](https://ui-prototype.jonnys.top/zh/utils/#html)
   */
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
  /**
   * Building the DOM from pug template file
   * @param name Template file name
   * @param options Template compile options
   * @param shared Whether it is a shared template
   *
   * [Document](https://ui-prototype.jonnys.top/zh/utils/#layout)
   */
  static layout<T extends HTMLElement = HTMLElement>(
    name: string,
    options?: any,
    shared: boolean = false
  ): Dom<T> {
    return Dom.html<T>(
      renderFile(
        path.join(shared ? sharedLayoutRoot : layoutRoot, name + '.pug'),
        getLayoutAPI(options)
      )
    );
  }
  /**
   * Building new DOM objects from strings, HTMLElement objects, DOM objects
   *
   * [Document](https://ui-prototype.jonnys.top/zh/utils/#from)
   */
  static from<T extends HTMLElement = HTMLElement>(
    ...args: (string | T | Dom<T>)[]
  ) {
    let doms: (HTMLElement | Dom)[] = [];
    for (const arg of args) {
      if (typeof arg === 'string') {
        doms.push(...Dom.html<T>(arg));
        continue;
      }
      if (arg instanceof HTMLElement) {
        doms.push(arg);
        continue;
      }
      if (arg instanceof Dom) {
        doms.push(...arg.#doms);
        continue;
      }
    }
    return new Dom(...doms);
  }
  /**
   * Creating element based on tag name
   * @param tagName Tag name of element
   * @param pack Returns the element or wrapped DOM object directly
   *
   * [Document](https://ui-prototype.jonnys.top/zh/utils/#new)
   */
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
    /* HACK: Adding items to the DOMTagNameMap
    causes the following two lines to report errors
    */
    // @ts-ignore
    if (!pack) return dom;
    // @ts-ignore
    return new Dom<DOMTagNameMap[K]>(dom);
  }
  /**
   * Filtering out new DOM objects using callback functions
   *
   * [Document](https://ui-prototype.jonnys.top/zh/utils/#filter)
   */
  filter(callback: (value: T, index: number, array: T[]) => boolean) {
    return new Dom<T>(...this.#doms.filter(callback));
  }
  /**
   * Query and return a new DOM object
   *
   * [Document](https://ui-prototype.jonnys.top/zh/utils/#query)
   */
  query<T extends HTMLElement = HTMLElement>(selector: string): Dom<T> {
    let doms: T[] = [];
    for (const dom of this.#doms) {
      doms.push(...(dom.querySelectorAll(selector) as unknown as T[]));
    }
    return new Dom<T>(...doms);
  }
  /**
   * Calls the defined callback function on each element
   * of the DOM and returns an array containing the result.
   *
   * [Document](https://ui-prototype.jonnys.top/zh/utils/#map)
   */
  map(callback: (value: T, index: number, array: T[]) => T) {
    return new Dom<T>(...this.#doms.map(callback));
  }
  /**
   * Clone and return a new DOM object
   *
   * [Document](https://ui-prototype.jonnys.top/zh/utils/#clone)
   */
  clone(deep?: boolean): Dom<T> {
    return new Dom(...this.#doms.map((e) => e.cloneNode(deep) as T));
  }
  /**
   * Get the DOM object consisting of the children of all elements of the DOM object
   *
   * [Document](https://ui-prototype.jonnys.top/zh/utils/#children)
   */
  get children() {
    let children = [];
    for (const dom of this.#doms) {
      children.push(...(dom.children as unknown as HTMLElement[]));
    }
    return new Dom<HTMLElement>(...children);
  }
  //#region Readonly Properties
  /**
   * Provides methods for manipulating element class names
   *
   * [Document](https://ui-prototype.jonnys.top/zh/utils/#class)
   */
  get class() {
    return this.#class;
  }
  /**
   * Getting the attributes of the first element
   *
   * [Document](https://ui-prototype.jonnys.top/zh/utils/#attr)
   */
  get attr() {
    return this.#attr;
  }
  /**
   * Get the number of elements
   *
   * [Document](https://ui-prototype.jonnys.top/zh/utils/#length)
   */
  get length() {
    return this.#doms.length;
  }
  /**
   * Get the DOMRect of all elements
   *
   * [Document](https://ui-prototype.jonnys.top/zh/utils/#rect)
   */
  get rect(): DOMRect[] {
    return this.#doms.map((e) => e.getBoundingClientRect());
  }
  /**
   * Manage dataset for all elements
   *
   * [Document](https://ui-prototype.jonnys.top/zh/utils/#data)
   */
  get data() {
    return this.#dataset;
  }
  /**
   * Manage style for all elements
   *
   * [Document](https://ui-prototype.jonnys.top/zh/utils/#style)
   */
  get style() {
    return this.#style;
  }
  /**
   * Get all the elements in the DOM object
   *
   * [Document](https://ui-prototype.jonnys.top/zh/utils/#doms)
   */
  get doms() {
    return [...this.#doms];
  }
  //#region Other
  /**
   * Get the id of the first element
   *
   * [Document](https://ui-prototype.jonnys.top/zh/utils/#id)
   */
  get id(): string | undefined {
    return this.#doms[0]?.id;
  }
  /**
   * Set the id of all the element
   */
  set id(value: string) {
    for (const dom of this.#doms) {
      dom.id = value;
    }
  }
  [Symbol.iterator]() {
    return this.#doms[Symbol.iterator]();
  }
  /**
   * Get the element of the DOM object with the specified subscript
   *
   * [Document](https://ui-prototype.jonnys.top/zh/utils/#at)
   */
  at(i: number) {
    return this.#doms[i];
  }
  /**
   * Performs the specified action for each element in DOM object
   *
   * [Document](https://ui-prototype.jonnys.top/zh/utils/#foreach)
   */
  forEach(callback: (value: T, index: number, array: T[]) => void) {
    this.#doms.forEach(callback);
  }
  /**
   * Determines whether all the members of DOM object satisfy the specified test
   *
   * [Document](https://ui-prototype.jonnys.top/zh/utils/#every)
   */
  every(callback: (value: T, index: number, array: T[]) => boolean) {
    return this.#doms.every(callback);
  }
  /**
   * Determines whether the specified callback function returns true for any element of DOM object
   *
   * [Document](https://ui-prototype.jonnys.top/zh/utils/#any)
   */
  any(callback: (value: T, index: number, array: T[]) => boolean) {
    return this.#doms.some(callback);
  }
  /**
   * Inserts elements before all elements in the DOM object
   *
   * [Document](https://ui-prototype.jonnys.top/zh/utils/#before)
   */
  before(...args: (Dom | HTMLElement | string)[]) {
    let doms = Dom.from(...args);
    if (this.length === 1) {
      this.#doms[0].before(...doms.map((e) => e));
      return;
    }
    for (const dom of this.#doms) {
      dom.before(...doms.map((e) => e.cloneNode(true) as HTMLElement));
    }
  }
  /**
   * Inserts the elements as the first child of all elements in the DOM object
   *
   * [Document](https://ui-prototype.jonnys.top/zh/utils/#prepend)
   */
  prepend(...args: (Dom | HTMLElement | string)[]) {
    let doms = Dom.from(...args);
    if (this.length === 1) {
      this.#doms[0].prepend(...doms.map((e) => e));
      return;
    }
    for (const dom of this.#doms) {
      dom.prepend(...doms.map((e) => e.cloneNode(true) as HTMLElement));
    }
  }
  /**
   * Inserts the elements as the last child of all elements in the DOM object
   *
   * [Document](https://ui-prototype.jonnys.top/zh/utils/#append)
   */
  append(...args: (Dom | HTMLElement | string)[]) {
    let doms = Dom.from(...args);
    if (this.length === 1) {
      this.#doms[0].append(...doms.map((e) => e));
      return;
    }
    for (const dom of this.#doms) {
      dom.append(...doms.map((e) => e.cloneNode(true) as HTMLElement));
    }
  }
  /**
   * Inserts elements after all elements in the DOM object
   *
   * [Document](https://ui-prototype.jonnys.top/zh/utils/#after)
   */
  after(...args: (Dom | HTMLElement | string)[]) {
    let doms = Dom.from(...args);
    if (this.length === 1) {
      this.#doms[0].after(...doms.map((e) => e));
      return;
    }
    for (const dom of this.#doms) {
      dom.after(...doms.map((e) => e.cloneNode(true) as HTMLElement));
    }
  }
  /**
   * Adding listeners to all elements of a DOM object
   *
   * [Document](https://ui-prototype.jonnys.top/zh/utils/#on)
   */
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
  /**
   * Removing listeners to all elements of a DOM object
   *
   * [Document](https://ui-prototype.jonnys.top/zh/utils/#off)
   */
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
  /**
   * Adding elements to a DOM object
   *
   * [Document](https://ui-prototype.jonnys.top/zh/utils/#push)
   */
  push(...doms: (T | Dom<T>)[]) {
    for (const dom of doms) {
      if (dom instanceof Dom) {
        this.#doms.push(...dom.doms);
        continue;
      }
      if (dom instanceof HTMLElement) {
        this.#doms.push(dom);
        continue;
      }
    }
  }
  /**
   * Removing specific elements from a DOM object
   *
   * [Document](https://ui-prototype.jonnys.top/zh/utils/#remove)
   */
  remove(...doms: (T | Dom<T> | number)[]) {
    for (const dom of doms) {
      if (dom instanceof Dom) {
        this.#doms = this.#doms.filter((e) => !dom.doms.includes(e));
        continue;
      }
      if (dom instanceof HTMLElement) {
        this.#doms = this.#doms.filter((e) => e !== dom);
        continue;
      }
      if (typeof dom === 'number') {
        this.#doms.splice(dom, 1);
        continue;
      }
    }
  }
}

/**
 * Querying in document and wrapping the result as a DOM object
 *
 * [Document](https://ui-prototype.jonnys.top/zh/utils/#_2)
 */
export function $<T extends HTMLElement = HTMLElement>(
  ...args: (string | T | Dom<T>)[]
): Dom<T> {
  return new Dom<T>(...args);
}
/**
 * Building the DOM from pug template
 * @param pug Template content
 * @param option Template compile options
 */
$.pug = Dom.pug;
/**
 * Building the DOM from html
 */
$.html = Dom.html;
/**
 * Building the DOM from pug template file
 * @param name Template file name
 * @param option Template compile options
 * @param shared Whether it is a shared template
 */
$.layout = Dom.layout;
/**
 * Building new DOM objects from strings, HTMLElement objects, DOM objects
 */
$.from = Dom.from;
/**
 * Creating element based on tag name
 * @param tagName Tag name of element
 * @param pack Returns the element or wrapped DOM object directly
 */
$.new = Dom.new;
