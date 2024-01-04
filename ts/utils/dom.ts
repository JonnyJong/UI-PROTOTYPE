export function createElement<T extends HTMLElement>(tagName: string, ...classList: string[]): T {
  let element = document.createElement(tagName) as T;
  element.classList.add(...classList);
  return element;
}