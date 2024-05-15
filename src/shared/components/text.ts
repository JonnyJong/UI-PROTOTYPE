import { $, Dom } from 'shared/utils/dom';
import { unid } from 'shared/utils/id';
import { setPosition } from 'shared/utils/position';
import type { UIScroll } from './scroll';

/** [Document](https://ui-prototype.jonnys.top/zh/ui/#uitextsuggest) */
export interface UITextSuggest {
  /** [Document](https://ui-prototype.jonnys.top/zh/ui/#label) */
  label: string | HTMLElement | Dom;
  /** [Document](https://ui-prototype.jonnys.top/zh/ui/#text) */
  text?: string;
  /** [Document](https://ui-prototype.jonnys.top/zh/ui/#action_3) */
  action?: Function;
}
/** [Document](https://ui-prototype.jonnys.top/zh/ui/#autosuggest_1) */
export type AutoSuggest = (value: string) => (string | UITextSuggest)[];
/** [Document](https://ui-prototype.jonnys.top/zh/ui/#uitextbutton) */
export interface UITextButton {
  /** [Document](https://ui-prototype.jonnys.top/zh/ui/#icon_1) */
  icon: string;
  /** [Document](https://ui-prototype.jonnys.top/zh/ui/#action_4) */
  action: (text: UIText, id?: string) => any;
  /** [Document](https://ui-prototype.jonnys.top/zh/ui/#tooltip_1) */
  tooltip?: string;
  /** [Document](https://ui-prototype.jonnys.top/zh/ui/#id_1) */
  id?: string;
  /** [Document](https://ui-prototype.jonnys.top/zh/ui/#disabled_2) */
  disabled?: boolean;
  /** [Document](https://ui-prototype.jonnys.top/zh/ui/#hidden_1) */
  hidden?: boolean;
}

const BORDER_PUG = `
.ui-text-border-shaping
  .ui-text-border
`;
const INDICATOR_PUG = `
.ui-text-indicator-shaping
  .ui-text-indicator
`;
const BUTTON_SIZE = 24;

function suggestFilter(
  value: (string | UITextSuggest)[]
): (string | UITextSuggest)[] {
  return value
    .filter((v, i) => {
      if (typeof v === 'string') return value.indexOf(v) === i;
      if (typeof v !== 'object') return false;
      return (
        typeof v.label === 'string' ||
        v.label instanceof HTMLElement ||
        v.label instanceof Dom
      );
    })
    .map((v) => {
      if (typeof v === 'string') return v;
      return { ...v };
    });
}

function querySuggest(
  input: string,
  value: (string | UITextSuggest)[]
): (string | UITextSuggest)[] {
  if (input.trim() === '') return value;
  let suggest: (string | UITextSuggest)[] = [];
  let keywords = input.split(' ').filter((v, i, a) => {
    return v.trim() !== '' && a.indexOf(v) === i;
  });
  for (const s of value) {
    if (typeof s === 'string') {
      if (keywords.some((v) => !s.includes(v))) continue;
      suggest.push(s);
      continue;
    }
    if (!s.text || keywords.every((v) => (s.text as string).includes(v))) {
      suggest.push(s);
    }
  }
  return suggest;
}

function createSuggestItem(
  suggest: string | UITextSuggest,
  index: number,
  acceptSuggest: (index: number) => void
): HTMLElement {
  const suggestItem = $.pug('.ui-text-suggest-item').at(0);
  if (typeof suggest === 'string') {
    suggestItem.textContent = suggest;
  } else {
    if (typeof suggest.label === 'string') {
      suggestItem.textContent = suggest.label;
    } else if (suggest.label instanceof HTMLElement) {
      suggestItem.append(suggest.label);
    } else {
      suggestItem.append(...suggest.label.doms);
    }
  }
  suggestItem.addEventListener('click', () => acceptSuggest(index));
  return suggestItem;
}

function buttonFilter(value: UITextButton[]): UITextButton[] {
  return value
    .filter((v) => {
      return typeof v.icon === 'string' && typeof v.action === 'function';
    })
    .map((v) => {
      return { ...v };
    });
}

/** [Document](https://ui-prototype.jonnys.top/zh/ui/#uitext) */
export class UIText extends HTMLElement {
  #inited = false;
  #id = unid();
  #disabled: boolean = false;
  #header = $.pug<HTMLLabelElement>('label.ui-text-header').at(0);
  #placeholder = $.pug<HTMLDivElement>('.ui-text-placeholder').at(0);
  #inputBox: HTMLInputElement | HTMLTextAreaElement = null as any;
  #inputBoxScroll: UIScroll | null = null;
  #border = $.pug<HTMLDivElement>(BORDER_PUG).at(0);
  #indicator = $.pug<HTMLDivElement>(INDICATOR_PUG).at(0);
  #autoSuggestBox = $.pug<HTMLDivElement>('.ui-text-suggest').at(0);
  #autoSuggestList = $.pug<HTMLDivElement>('.ui-text-suggest-list').at(0);
  #autoSuggest: (string | UITextSuggest)[] | AutoSuggest = [];
  #currentSuggest: (string | UITextSuggest)[] = [];
  #prevSuggestValue: string | null = null;
  #prevValue: string | null = null;
  #leftButtons: UITextButton[] = [];
  #rightButtons: UITextButton[] = [];
  #leftButtonsContainer = $.pug<HTMLDivElement>(
    '.ui-text-buttons.ui-text-buttons-left'
  ).at(0);
  #rightButtonsContainer = $.pug<HTMLDivElement>(
    '.ui-text-buttons.ui-text-buttons-right'
  ).at(0);
  //#region Private
  connectedCallback() {
    if (this.#inited) return;
    this.#inited = true;
    this.#disabled = this.hasAttribute('disabled');
    this.#header.innerHTML = this.getAttribute('header') ?? '';
    this.#header.htmlFor = 'ui-text-' + this.#id;
    this.#resizeObserver.observe(this.#header);
    this.#placeholder.innerHTML = this.getAttribute('placeholder') ?? '';
    if (customElements.get('ui-scroll')) {
      let scroll = $.new('ui-scroll');
      scroll.classList.add('ui-text-suggest-scroll');
      scroll.target = this.#autoSuggestList;
      this.#autoSuggestBox.append(scroll);
      this.#inputBoxScroll = $.new('ui-scroll');
      this.#inputBoxScroll.classList.add('ui-text-scroll');
    }
    this.#initInputBox(this.hasAttribute('multi-line') ? 'textarea' : 'input');
    let value = this.getAttribute('value');
    if (value) {
      this.#inputBox.value = value;
      this.#placeholder.classList.add('ui-text-placeholder-hidden');
    }
    this.#inputBox.readOnly = this.hasAttribute('readonly');
    this.#resizeHandler();
    this.#autoSuggestBox.append(this.#autoSuggestList);
    this.#autoSuggestBox.addEventListener('pointerdown', (ev) => {
      ev.preventDefault();
    });
    this.append(
      this.#header,
      this.#inputBox,
      this.#placeholder,
      this.#border,
      this.#indicator,
      this.#leftButtonsContainer,
      this.#rightButtonsContainer
    );
    if (this.#inputBoxScroll) {
      this.append(this.#inputBoxScroll);
    }
  }
  #resizeHandler = () => {
    let { width } = this.getBoundingClientRect();
    let { height } = this.#header.getBoundingClientRect();
    this.#autoSuggestBox.style.width = width - 3 + 'px';
    this.style.setProperty('--ui-text-header-height', height + 'px');
  };
  #resizeObserver = new ResizeObserver(this.#resizeHandler);
  #initInputBox(type: 'input' | 'textarea') {
    // Basic
    let value = '';
    let readOnly = false;
    if (this.#inputBox) {
      value = this.#inputBox.value;
      readOnly = this.#inputBox.readOnly;
      if (this.#inputBoxScroll) this.#inputBoxScroll.target = null;
      this.#resizeObserver.unobserve(this.#inputBox);
      this.#inputBox.remove();
    }
    this.#inputBox = $.new(type);
    this.#inputBox.classList.add('ui-text-input');
    this.#inputBox.value = value;
    this.#inputBox.id = 'ui-text-' + this.#id;
    this.#inputBox.disabled = this.#disabled;
    this.#inputBox.readOnly = readOnly;
    if (this.#inited) this.#placeholder.before(this.#inputBox);
    this.#resizeObserver.observe(this.#inputBox);
    // Event
    this.#inputBox.addEventListener('input', () => {
      this.#placeholder.classList.toggle(
        'ui-text-placeholder-hidden',
        this.#inputBox.value !== ''
      );
      if (type === 'input') {
        this.#suggest();
        this.#prevValue = null;
        return;
      }
      this.#autoResize();
    });
    if (type === 'textarea') {
      this.#autoResize();
      if (this.#inputBoxScroll) this.#inputBoxScroll.target = this.#inputBox;
      return;
    }
    this.#inputBox.addEventListener('keydown', (e) => {
      switch ((e as KeyboardEvent).key) {
        case 'Enter':
          return this.#acceptSuggest();
        case 'Escape':
          return this.#hideSuggest();
        case 'ArrowUp':
        case 'ArrowDown':
          e.preventDefault();
          return this.#selectSuggest((e as KeyboardEvent).key === 'ArrowUp');
      }
    });
    this.#inputBox.addEventListener('blur', this.#hideSuggest);
    this.#setInputPadding();
  }
  #autoResize() {
    if (!this.multiLine) return;
    let prevHeight = getComputedStyle(this.#inputBox).height;
    this.#inputBox.style.transition = '0s';
    this.#inputBox.style.height = '0';
    let nowHeight = this.#inputBox.scrollHeight;
    this.#inputBox.style.height = prevHeight;
    setTimeout(() => {
      this.#inputBox.style.transition = '';
      this.#inputBox.style.height = `${nowHeight}px`;
    });
  }
  #suggest() {
    // Query
    if (Array.isArray(this.#autoSuggest)) {
      let value = this.value.trim();
      if (this.#prevSuggestValue === value) return this.#showSuggest();
      this.#currentSuggest = querySuggest(value, this.#autoSuggest);
      this.#prevSuggestValue = value;
    } else {
      this.#currentSuggest = suggestFilter(this.#autoSuggest(this.value));
    }
    // Show
    this.#autoSuggestList.innerHTML = '';
    if (this.#currentSuggest.length === 0) {
      this.#hideSuggest();
      return;
    }
    this.#currentSuggest.forEach((suggest, index) => {
      this.#autoSuggestList.append(
        createSuggestItem(suggest, index, this.#acceptSuggest)
      );
    });
    if (this.hasAttribute('suggest-showed')) return;
    document.body.append(this.#autoSuggestBox);
    this.#showSuggest();
  }
  #autoMoveSuggestBox = () => {
    if (
      this.#currentSuggest.length === 0 ||
      !this.hasAttribute('suggest-showed')
    )
      return;
    this.#showSuggest();
  };
  #showSuggest() {
    if (this.#currentSuggest.length === 0) return;
    let { top, right, bottom, left } = this.#inputBox.getBoundingClientRect();
    let side = setPosition(
      this.#autoSuggestBox,
      this.#autoSuggestBox.getBoundingClientRect(),
      {
        top: top + 1.5,
        right,
        bottom: bottom + 2,
        left,
      }
    ).v;
    this.setAttribute('suggest-showed', side);
    this.#autoSuggestBox.setAttribute('suggest-showed', side);
    requestAnimationFrame(this.#autoMoveSuggestBox);
  }
  #hideSuggest = () => {
    this.#autoSuggestBox.remove();
    this.removeAttribute('suggest-showed');
  };
  #selectSuggest(isUp = false) {
    if (
      this.#currentSuggest.length === 0 ||
      !this.hasAttribute('suggest-showed')
    )
      return;
    // Select
    let currentSelect = this.#autoSuggestList.querySelector(
      '.ui-text-suggest-item-selected'
    ) as HTMLElement;
    let index = [...this.#autoSuggestList.children].indexOf(currentSelect);
    index += isUp ? -1 : 1;
    if (index < -1) {
      index = this.#autoSuggestList.children.length - 1;
    }
    if (index >= this.#autoSuggestList.children.length) {
      index = -1;
    }
    currentSelect?.classList.remove('ui-text-suggest-item-selected');
    this.#autoSuggestList.children[index]?.classList.add(
      'ui-text-suggest-item-selected'
    );
    this.#autoSuggestList.children[index]?.scrollIntoView({
      behavior: 'smooth',
      inline: 'start',
      block: 'center',
    });
    // AutoFill
    if (this.#prevValue === null) {
      this.#prevValue = this.value;
    }
    if (index < 0) {
      this.#inputBox.value = this.#prevValue;
    } else {
      let suggest = this.#currentSuggest[index];
      if (typeof suggest === 'string') {
        this.#inputBox.value = suggest;
        return;
      }
      if (typeof suggest.text === 'string') {
        this.#inputBox.value = suggest.text;
      }
    }
  }
  #acceptSuggest = (index?: number) => {
    if (
      this.#currentSuggest.length === 0 ||
      !this.hasAttribute('suggest-showed')
    )
      return;
    if (typeof index !== 'number') {
      index = [...this.#autoSuggestList.children].indexOf(
        this.#autoSuggestList.querySelector(
          '.ui-text-suggest-item-selected'
        ) as HTMLElement
      );
    }
    if (index < 0) return;
    let suggest = this.#currentSuggest[index];
    if (typeof suggest === 'string') {
      this.value = suggest;
      this.#suggest();
      return;
    }
    if (typeof suggest.action === 'function') {
      return setTimeout(() => suggest.action!());
    }
    if (typeof suggest.text === 'string') {
      this.value = suggest.text;
      this.#suggest();
    }
  };
  #redrawButtons(side: 'left' | 'right') {
    let container =
      side === 'left'
        ? this.#leftButtonsContainer
        : this.#rightButtonsContainer;
    let buttons = side === 'left' ? this.#leftButtons : this.#rightButtons;
    let buttonElements = [];
    for (const button of buttons) {
      let btn = $.pug<HTMLDivElement>('.ui-text-button');
      let icon = $.pug('.icon');
      icon.class.add('icon-' + button.icon);
      btn.append(icon);
      if (typeof button.tooltip === 'string') {
        btn.attr.set('tooltip', button.tooltip);
      }
      if (button.id) {
        btn.data.id = button.id;
      }
      btn.class.toggle('ui-text-button-disabled', !!button.disabled);
      btn.class.toggle('ui-text-button-hidden', !!button.hidden);
      btn.on('click', () => button.action(this, button.id));
      btn.on('pointerdown', (ev) => ev.preventDefault());
      buttonElements.push(btn.at(0));
    }
    container.innerHTML = '';
    container.append(...buttonElements);
    this.#setInputPadding();
  }
  #setInputPadding() {
    let paddingLeft = 0;
    let paddingRight = 0;
    for (const btn of this.#leftButtons) {
      if (btn.hidden) continue;
      paddingLeft += BUTTON_SIZE;
    }
    for (const btn of this.#rightButtons) {
      if (btn.hidden) continue;
      paddingRight += BUTTON_SIZE;
    }
    this.#inputBox.style.setProperty('--ui-text-btn-left', `${paddingLeft}px`);
    this.#inputBox.style.setProperty(
      '--ui-text-btn-right',
      `${paddingRight}px`
    );
  }
  #setBtnStatus(id: string, status: 'disabled' | 'hidden', value?: boolean) {
    let indexL = this.#leftButtons.findIndex((btn) => btn.id === id);
    let indexR = this.#rightButtons.findIndex((btn) => btn.id === id);
    let btnL = this.#leftButtons[indexL];
    let btnR = this.#rightButtons[indexR];
    if (btnL) {
      btnL.hidden = typeof value === 'boolean' ? value : !btnL.hidden;
      this.#leftButtonsContainer.children[indexL].classList.toggle(
        `ui-text-button-${status}`,
        btnL.hidden
      );
    }
    if (btnR) {
      btnR.hidden = typeof value === 'boolean' ? value : !btnR.hidden;
      this.#rightButtonsContainer.children[indexR].classList.toggle(
        `ui-text-button-${status}`,
        btnR.hidden
      );
    }
    this.#setInputPadding();
  }
  //#region Public
  /**
   * Whether the text box is multi-line.
   */
  /** [Document](https://ui-prototype.jonnys.top/zh/ui/#multiline) */
  get multiLine() {
    return this.#inputBox.tagName === 'TEXTAREA';
  }
  set multiLine(value) {
    if (value === this.multiLine) return;
    this.#initInputBox(value ? 'textarea' : 'input');
  }
  /**
   * Whether the text box is disabled.
   *
   * [Document](https://ui-prototype.jonnys.top/zh/ui/#disabled_1)
   */
  get disabled() {
    return this.#disabled;
  }
  set disabled(value) {
    this.#disabled = value;
    this.#inputBox.disabled = value;
    if (value) {
      this.setAttribute('disabled', '');
      return;
    }
    this.removeAttribute('disabled');
  }
  /**
   * Sets or retrieves the value indicated
   * whether the content of the object is read-only.
   *
   * [Document](https://ui-prototype.jonnys.top/zh/ui/#readonly)
   */
  get readonly() {
    return this.#inputBox.readOnly;
  }
  set readonly(value) {
    this.#inputBox.readOnly = value;
  }
  /**
   * The text box's header.
   *
   * [Document](https://ui-prototype.jonnys.top/zh/ui/#header)
   */
  get header(): string | HTMLElement[] {
    if (this.#header.children) {
      return [...this.#header.children] as HTMLElement[];
    }
    return this.#header.textContent as string;
  }
  set header(value: string | HTMLElement[]) {
    this.#header.innerHTML = '';
    if (Array.isArray(value)) {
      this.#header.append(...value);
      return;
    }
    this.#header.textContent = value;
  }
  /**
   * Gets or sets a text string that is displayed in an input field
   * as a hint or prompt to users
   * as the format or type of information they need to enter.
   * The text appears in an input field until the user puts focus on the field.
   *
   * [Document](https://ui-prototype.jonnys.top/zh/ui/#placeholder)
   */
  get placeholder(): string | HTMLElement[] {
    if (this.#placeholder.children) {
      return [...this.#placeholder.children] as HTMLElement[];
    }
    return this.#placeholder.textContent as string;
  }
  set placeholder(value: string | HTMLElement[]) {
    this.#placeholder.innerHTML = '';
    if (Array.isArray(value)) {
      this.#placeholder.append(...value);
      return;
    }
    this.#placeholder.textContent = value;
  }
  /**
   * Returns the value currently entered by the user,
   * or the value previously entered by the user
   * when the user is selecting a suggestion.
   *
   * [Document](https://ui-prototype.jonnys.top/zh/ui/#value)
   */
  get value() {
    if (typeof this.#prevValue === 'string') return this.#prevValue;
    return this.#inputBox.value;
  }
  set value(value) {
    this.#inputBox.value = value;
    this.#placeholder.classList.toggle(
      'ui-text-placeholder-hidden',
      this.#inputBox.value !== ''
    );
    this.#prevValue = null;
  }
  /**
   * Auto Suggestions for Input Boxes invokes and generates auto suggestions
   * or matches that are displayed near the input box when the user types.
   *
   * [Document](https://ui-prototype.jonnys.top/zh/ui/#autosuggest)
   */
  get autoSuggest() {
    if (typeof this.#autoSuggest === 'function') return this.#autoSuggest;
    return suggestFilter(this.#autoSuggest);
  }
  set autoSuggest(value) {
    if (typeof value === 'function') {
      this.#autoSuggest = value;
    } else if (Array.isArray(value)) {
      this.#autoSuggest = suggestFilter(value);
    }
    this.#prevSuggestValue = null;
    this.#suggest();
  }
  /**
   * Retrieve whether the user is selecting a suggest.
   *
   * [Document](https://ui-prototype.jonnys.top/zh/ui/#isselectingsuggest)
   */
  get isSelectingSuggest() {
    return (
      this.#currentSuggest.length > 0 &&
      this.hasAttribute('suggest-showed') &&
      !!this.#autoSuggestList.querySelector('.ui-text-suggest-item-selected')
    );
  }
  /**
   * Buttons on the left side of the input box.
   *
   * [Document](https://ui-prototype.jonnys.top/zh/ui/#leftbuttons)
   */
  get leftButtons() {
    return buttonFilter(this.#leftButtons);
  }
  set leftButtons(value: UITextButton[]) {
    this.#leftButtons = buttonFilter(value);
    this.#redrawButtons('left');
  }
  /**
   * Buttons on the right side of the input box.
   *
   * [Document](https://ui-prototype.jonnys.top/zh/ui/#rightbuttons)
   */
  get rightButtons() {
    return buttonFilter(this.#rightButtons);
  }
  set rightButtons(value: UITextButton[]) {
    this.#rightButtons = buttonFilter(value);
    this.#redrawButtons('right');
  }
  /**
   * Toggle button hidden or shown.
   * @param id button's id
   * @param force force hidden or shown
   *
   * [Document](https://ui-prototype.jonnys.top/zh/ui/#togglebuttonhidden_1)
   */
  toggleButtonHidden(id: string, force?: boolean) {
    this.#setBtnStatus(id, 'hidden', force);
  }
  /**
   * Toggle button enabled or disabled.
   * @param id button's id
   * @param force force enabled or disabled
   * [Document](https://ui-prototype.jonnys.top/zh/ui/#togglebuttondisabled_1)
   */
  toggleButtonDisabled(id: string, force?: boolean) {
    this.#setBtnStatus(id, 'disabled', force);
  }
  // TODO：Input Verification
  /* TODO: more types of text
    - password
    - number
    - email
    - tel
    - url
    - etc
   */
  //#region Static
  /**
   * Generate a clear button for the input box.
   * @param text input box object
   * @param btnId button's id
   * @returns button object and event listener
   *
   * [Document](https://ui-prototype.jonnys.top/zh/ui/#generateclearbutton)
   */
  static generateClearButton(
    text: UIText,
    btnId = 'clear'
  ): {
    button: UITextButton;
    handler: Function;
  } {
    const handler = () => {
      text.toggleButtonHidden(btnId, text.value === '');
    };
    text.addEventListener('input', handler);
    return {
      button: {
        id: btnId,
        icon: 'Clear',
        action() {
          text.value = '';
        },
        hidden: text.value === '',
      },
      handler,
    };
  }
}
customElements.define('ui-text', UIText);
