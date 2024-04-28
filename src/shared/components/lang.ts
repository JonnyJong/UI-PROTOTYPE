import { locale } from 'shared/ui/locale';

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
   */
  update() {
    this.textContent = this.#key === '' ? '' : locale(this.key as any);
  }
}
customElements.define('ui-lang', UILang);
