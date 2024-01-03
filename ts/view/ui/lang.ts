import { ipcRenderer } from "electron";
import { UILang as ILang, UILangData } from "../../type";
import { error } from "../../utils/error";
class UILang extends HTMLElement implements ILang {
  #inited = false;
  #key: string = '';
  #data: UILangData = {};
  connectedCallback() {
    ipcRenderer.on('locale:update', this.#update);
    if (this.#inited) return this.#update();
    this.#key = super.textContent || '';
    this.#update();
  };
  disconnectedCallback() {
    ipcRenderer.off('locale:update', this.#update);
  };
  #update = async ()=>{
    let str: string = await ipcRenderer.invoke('locale:get', this.#key);
    for (const key in this.#data) {
      if (!Object.prototype.hasOwnProperty.call(this.#data, key)) continue;
      str = str.replaceAll(key, this.#data[key]);
    }
    super.textContent = str;
  };
  get key(): string {
    return this.#key;
  };
  set key(value: string) {
    error(typeof value === 'string', 'key', 'type string', value);
    this.#key = value;
    this.#inited = true;
    this.#update();
  };
  get data(): UILangData {
    return Object.assign({}, this.#data);
  };
  set data(value: UILangData) {
    error(typeof value === 'object', 'data', 'type object', value);
    let newData: UILangData = {};
    for (const key in value) {
      if (!Object.prototype.hasOwnProperty.call(value, key)) continue;
      newData[key] = String(value[key]);
    }
    this.#data = newData;
    this.#update();
  };
  // Block
  set textContent(_: string) {};
  get textContent(): string | null {
    return super.textContent;
  };
  set innerText(_: string) {};
  get innerText(): string {
    return super.innerText;
  };
  set innerHTML(_: any) {};
  get innerHTML(): string {
    return super.innerHTML;
  };
  append(_: any) {};
  appendChild<T extends Node>(node: T): T {
    return node;
  };
  prepend(_: any) {};
  get childNodes(): any {
    return [];
  };
  get firstChild(): null {
    return null;
  };
  get lastChild(): null {
    return null;
  };
  removeChild<T extends Node>(child: T): T {
    return child;
  };
  replaceChild<T extends Node>(_: Node, child: T): T {
    return child;
  };
  replaceChildren(_: any) {};
  setHTML() {};
};

customElements.define('ui-lang', UILang);