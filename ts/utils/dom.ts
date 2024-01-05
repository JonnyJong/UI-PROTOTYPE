import { Attributes } from "../type";

export function createElement<T extends HTMLElement>(tagName: string, ...classList: string[]): T;
export function createElement<T extends HTMLElement>(tagName: string, attr: Attributes, ...classList: string[]): T;
export function createElement<T extends HTMLElement>(tagName: string, attr: string | Attributes, ...classList: string[]): T {
  let element = document.createElement(tagName) as T;
  if (typeof attr === 'string') {
    element.classList.add(attr);
  } else if (typeof attr === 'object') {
    for (const name in attr) {
      if (!Object.prototype.hasOwnProperty.call(attr, name)) continue;
      element.setAttribute(name, attr[name]);
    }
  }
  element.classList.add(...classList);
  return element;
}