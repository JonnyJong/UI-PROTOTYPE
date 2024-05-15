import { locale } from 'shared/ui/locale';

/** [Document](https://ui-prototype.jonnys.top/zh/ui/#uilang) */
export class UILang extends HTMLElement {
  #inited = false;
  #key: string = '';
  connectedCallback() {
    if (this.#inited) return;
    this.#inited = true;
    if (!this.#key) {
      this.#key = this.textContent!;
    }
    this.update();
  }
  /**
   * The key of the locale text.
   *
   * [Document](https://ui-prototype.jonnys.top/zh/ui/#key)
   */
  get key() {
    return this.#key;
  }
  set key(value) {
    this.#key = String(value);
    this.update();
  }
  /**
   * Updating of translated text.
   *
   * [Document](https://ui-prototype.jonnys.top/zh/ui/#update)
   */
  update() {
    this.textContent = this.#key === '' ? '' : locale(this.key as any);
  }
}
customElements.define('ui-lang', UILang);
