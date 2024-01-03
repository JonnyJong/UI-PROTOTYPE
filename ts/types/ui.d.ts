export type UILangData = { [key: string]: string };
export class UILang extends HTMLElement {
  key: string;
  data: UILangData;
  /**
   * @readonly
   */
  textContent: string | null;
  /**
   * @readonly
   */
  innerText: string;
  /**
   * @readonly
   */
  innerHTML: string;
}