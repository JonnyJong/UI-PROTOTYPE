import { ipcRenderer } from 'electron';
import rfdc from 'rfdc';
import {
  Titlebar as ITitlebar,
  TitlebarAvatar,
  TitlebarButton,
} from 'shared/types/ui';
import {
  windowControlButtonWidth,
  titlebarAvatarSize,
} from 'shared/config/ui.json';
import { $, Dom } from 'shared/utils/dom';
import { UIText } from 'shared/components/text';

const BUTTON_LEFT = 6;
const BUTTON_SIZE = 36;
const APP_LOGO_SIZE = 8 * 2 + 20;
const AVATAR_PADDING = 24 + 24;

const BUTTON_PUG = `
.titlebar-button(tooltip=tooltip data-id=id)
  div(class="titlebar-button-icon icon icon-" + icon)
`;
const CONTROL_BUTTON_PUG = `
.window-control(tooltip=tooltip data-id=id)
  div(class="icon icon-" + icon)
`;

class Titlebar implements ITitlebar {
  #titlebarElement!: Dom;
  #buttonsElement!: Dom;
  #appTitleElement!: Dom;
  #stateElement!: Dom;
  #flexElement!: Dom;
  #windowControlsElement!: Dom;
  #windowControlMinimizeElement!: Dom;
  #windowControlResizeElement!: Dom;
  #windowControlCloseElement!: Dom;
  #windowControlsContainerElement!: Dom;
  #state: string | HTMLElement | Dom = '';
  #buttons: TitlebarButton[] = [];
  #searchbar: UIText | HTMLInputElement | null = null;
  #avatar?: TitlebarAvatar;
  #avatarElement!: Dom;
  #windowControls: TitlebarButton[] = [];
  #windowControlMinimize: boolean = true;
  #windowControlResize: boolean = true;
  #windowControlClose: 'close' | 'hide' | 'none' = 'close';
  #mutationObserver = new MutationObserver(() => {
    if (this.#flexElement.children.length > 0) return;
    this.searchbar = null;
  });
  /**
   * @method
   * @description
   * Ensuring it is called after each modification to the titlebar.
   */
  #resize() {
    // Calc
    let btnWidth = BUTTON_LEFT;
    let winCtrlWidth = 0;
    for (const btn of this.#buttons) {
      if (btn.hidden) continue;
      btnWidth += BUTTON_SIZE;
    }
    if (this.#windowControlClose !== 'none')
      winCtrlWidth += windowControlButtonWidth;
    if (this.#windowControlResize) winCtrlWidth += windowControlButtonWidth;
    if (this.#windowControlMinimize) winCtrlWidth += windowControlButtonWidth;
    for (const btn of this.#windowControls) {
      if (btn.hidden) continue;
      winCtrlWidth += windowControlButtonWidth;
    }
    let left = btnWidth + APP_LOGO_SIZE + this.#appTitleElement.rect[0].width;
    let right = winCtrlWidth;
    if (this.#avatar) {
      right += titlebarAvatarSize + AVATAR_PADDING;
    }
    const diff = Math.min(left, right);
    left -= diff;
    right -= diff;
    // Set Style
    this.#flexElement.style.padding = `0 ${left}px 0 ${right}px`;
    this.#titlebarElement.style['--window-control-width'] = winCtrlWidth + 'px';
  }
  #updateWindowControls() {
    ipcRenderer.send('win:controls', {
      close: this.#windowControlClose,
      resize: this.#windowControlResize,
      minimize: this.#windowControlMinimize,
    });
  }
  async init() {
    // Initialize variables
    this.#titlebarElement = $('#titlebar');
    this.#buttonsElement = $('#titlebar-buttons');
    this.#appTitleElement = $('#app-title');
    this.#stateElement = $('#app-state');
    this.#flexElement = $('#titlebar-flex');
    this.#avatarElement = $('#titlebar-avatar');
    this.#windowControlsElement = $('#window-controls');
    this.#windowControlMinimizeElement = $('#window-minimize');
    this.#windowControlResizeElement = $('#window-resize');
    this.#windowControlCloseElement = $('#window-close');
    this.#windowControlsContainerElement = $('#window-controls-container');
    let controls = await ipcRenderer.invoke('win:controls');
    this.windowControlClose = controls.close;
    this.windowControlMinimize = controls.minimize;
    this.windowControlResize = controls.resize;
    this.#resize();
    // Setup events
    this.#windowControlMinimizeElement.on('click', () => {
      if (!this.#windowControlMinimize) return;
      ipcRenderer.send('win:minimize');
    });
    this.#windowControlResizeElement.on('click', () => {
      if (!this.#windowControlResize) return;
      ipcRenderer.send('win:resize');
    });
    this.#windowControlCloseElement.on('click', () => {
      if (this.#windowControlClose === 'none') return;
      ipcRenderer.send('win:' + this.#windowControlClose);
    });
    ipcRenderer.on('win:controls', (_, controls) => {
      this.windowControlClose = controls.close;
      this.windowControlMinimize = controls.minimize;
      this.windowControlResize = controls.resize;
      this.#resize();
    });
  }
  get state(): string | HTMLElement | Dom {
    return this.#state;
  }
  set state(value: string | HTMLElement | Dom) {
    if (typeof value === 'string') {
      this.#stateElement.at(0).innerHTML = value;
    } else if (value instanceof HTMLElement || value instanceof Dom) {
      this.#stateElement.at(0).innerHTML = '';
      this.#stateElement.append(value);
    } else {
      return;
    }
    this.#state = value;
    this.#resize();
  }
  get buttons(): TitlebarButton[] {
    return rfdc()(this.#buttons);
  }
  set buttons(buttons: TitlebarButton[]) {
    let btns: Dom[] = [];
    for (const button of buttons) {
      let { id, icon, tooltip, action, hidden, disabled } = button;
      const btn = $.pug(BUTTON_PUG, {
        id,
        icon,
        tooltip,
      });
      if (hidden) btn.class.add('titlebar-button-hidden');
      if (disabled) btn.class.add('titlebar-button-disabled');
      btn.on('click', () => action());
      btns.push(btn);
    }
    this.#buttons = rfdc()(buttons);
    this.#buttonsElement.at(0).innerHTML = '';
    this.#buttonsElement.append(...btns);
    this.#resize();
  }
  get searchbar() {
    return this.#searchbar;
  }
  set searchbar(value) {
    this.#flexElement.at(0).innerHTML = '';
    if (!value) {
      this.#mutationObserver.disconnect();
      this.#searchbar = null;
      return;
    }
    this.#flexElement.append(value);
    this.#searchbar = value;
    this.#mutationObserver.observe(this.#flexElement.at(0), {
      childList: true,
    });
  }
  get avatar() {
    if (!this.#avatar) return;
    return { ...this.#avatar };
  }
  set avatar(value) {
    this.#avatarElement.at(0).innerHTML = '';
    if (!value) {
      this.#avatar = undefined;
      return;
    }
    let img = $.pug<HTMLImageElement>('img(src=src)', { src: value.img });
    if (typeof value.action === 'function') {
      img.on('click', () => {
        let { top, left } = this.#avatarElement.rect[0];
        value!.action!({
          top,
          left,
          bottom: top + titlebarAvatarSize,
          right: left + titlebarAvatarSize,
        });
      });
    }
    this.#avatarElement.append(img);
    this.#avatar = { ...value };
    this.#resize();
  }
  get windowControls(): TitlebarButton[] {
    return rfdc()(this.#windowControls);
  }
  set windowControls(controls: TitlebarButton[]) {
    let btns: Dom[] = [];
    for (const control of controls) {
      let { id, icon, tooltip, action, hidden, disabled } = control;
      let btn = $.pug(CONTROL_BUTTON_PUG, { id, icon, tooltip });
      if (hidden) btn.class.add('window-control-hidden');
      if (disabled) btn.class.add('window-control-disabled');
      btn.on('click', () => action());
      btns.push(btn);
    }
    this.#windowControls = rfdc()(controls);
    this.#windowControlsElement.at(0).innerHTML = '';
    this.#windowControlsElement.append(...btns);
    this.#resize();
  }
  get windowControlClose(): 'close' | 'hide' | 'none' {
    return this.#windowControlClose;
  }
  set windowControlClose(value: 'close' | 'hide' | 'none') {
    if (!['close', 'hide', 'none'].includes(value)) return;
    this.#windowControlClose = value;
    this.#updateWindowControls();
  }
  get windowControlResize(): boolean {
    return this.#windowControlResize;
  }
  set windowControlResize(value: boolean) {
    this.#windowControlResize = !!value;
    this.#windowControlResizeElement.class.toggle(
      'window-control-hidden',
      !value
    );
    this.#updateWindowControls();
  }
  get windowControlMinimize(): boolean {
    return this.#windowControlMinimize;
  }
  set windowControlMinimize(value: boolean) {
    this.#windowControlMinimize = !!value;
    this.#windowControlMinimizeElement.class.toggle(
      'window-control-hidden',
      !value
    );
    this.#updateWindowControls();
  }
  toggleButtonHidden(id: string, hidden?: boolean): void {
    let button = this.#buttons.find((btn) => btn.id === id);
    if (!button) return;
    let btn =
      this.#buttonsElement.at(0).children[this.#buttons.indexOf(button)];
    button.hidden = btn.classList.toggle('titlebar-button-hidden', hidden);
    this.#resize();
  }
  toggleButtonDisabled(id: string, disabled?: boolean): void {
    let button = this.#buttons.find((btn) => btn.id === id);
    if (!button) return;
    let btn =
      this.#buttonsElement.at(0).children[this.#buttons.indexOf(button)];
    button.disabled = btn.classList.toggle(
      'titlebar-button-disabled',
      disabled
    );
  }
  toggleWindowControlHidden(id: string, hidden?: boolean): void {
    let button = this.#windowControls.find((btn) => btn.id === id);
    if (!button) return;
    let btn =
      this.#windowControlsElement.at(0).children[
        this.#windowControls.indexOf(button)
      ];
    button.hidden = btn.classList.toggle('window-control-hidden', hidden);
    this.#resize();
  }
  toggleWindowControlDisabled(id: string, disabled?: boolean): void {
    let button = this.#windowControls.find((btn) => btn.id === id);
    if (!button) return;
    let btn =
      this.#windowControlsElement.at(0).children[
        this.#windowControls.indexOf(button)
      ];
    button.disabled = btn.classList.toggle('window-control-disabled', disabled);
  }
}

/**
 * Window titlebar
 *
 * [Document](https://ui-prototype.jonnys.top/zh/ui/#titlebar)
 */
export const titlebar = new Titlebar();
