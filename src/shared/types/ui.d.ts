import { UIText } from 'shared/components/text';
import { Dom } from 'shared/utils/dom';
import { OutlineRect } from './position';

/** [Document](https://ui-prototype.jonnys.top/zh/ui/#titlebarbutton) */
export type TitlebarButton = {
  /**
   * Should be unique; duplicates will be ignored.
   *
   * [Document](https://ui-prototype.jonnys.top/zh/ui/#id)
   */
  id: string;
  /**
   * Class name for the button's icon.
   * @example
   * Usage in TypeScript
   * ```typescript
   * { icon: 'ChromeClose' };
   * ```
   * Render in HTML
   * ```html
   * <div class="icon icon-ChromeClose"></div>
   * ```
   *
   * [Document](https://ui-prototype.jonnys.top/zh/ui/#icon)
   */
  icon: string;
  /**
   * Button tooltip.
   *
   * [Document](https://ui-prototype.jonnys.top/zh/ui/#tooltip)
   */
  tooltip?: string;
  /**
   * Indicates whether the button is visible.
   *
   * [Document](https://ui-prototype.jonnys.top/zh/ui/#hidden)
   */
  hidden?: boolean;
  /**
   * Indicates whether the button is disabled.
   *
   * [Document](https://ui-prototype.jonnys.top/zh/ui/#disabled)
   */
  disabled?: boolean;
  /**
   * Button triggered action.
   *
   * [Document](https://ui-prototype.jonnys.top/zh/ui/#action)
   */
  action: Function;
};

/** [Document](https://ui-prototype.jonnys.top/zh/ui/#titlebaravatar) */
export interface TitlebarAvatar {
  /** [Document](https://ui-prototype.jonnys.top/zh/ui/#img) */
  img: string;
  /** [Document](https://ui-prototype.jonnys.top/zh/ui/#action_1) */
  action?: (rect: OutlineRect) => any;
}
/**
 * Window titlebar.
 *
 * [Document](https://ui-prototype.jonnys.top/zh/ui/#titlebar_1)
 */
export interface Titlebar {
  /**
   * Initializes the titlebar.
   * @description Should not be called multiple times.
   * @method
   *
   * [Document](https://ui-prototype.jonnys.top/zh/ui/#init)
   */
  init(): void;
  /**
   * Application state information.
   *
   * [Document](https://ui-prototype.jonnys.top/zh/ui/#state)
   */
  state: string | HTMLElement | Dom;
  /**
   * Array of buttons displayed in the titlebar.
   *
   * [Document](https://ui-prototype.jonnys.top/zh/ui/#buttons)
   */
  buttons: TitlebarButton[];
  /**
   * Search bar.
   *
   * [Document](https://ui-prototype.jonnys.top/zh/ui/#searchbar)
   */
  searchbar: UIText | HTMLInputElement | null;
  /**
   * Titlebar avatar button.
   *
   * [Document](https://ui-prototype.jonnys.top/zh/ui/#avatar)
   */
  avatar?: TitlebarAvatar;
  /**
   * Array of window control buttons in the titlebar.
   *
   * [Document](https://ui-prototype.jonnys.top/zh/ui/#windowcontrols)
   */
  windowControls: TitlebarButton[];
  /**
   * Indicates whether the window control for minimizing is visible.
   *
   * [Document](https://ui-prototype.jonnys.top/zh/ui/#windowcontrolminimize)
   */
  windowControlMinimize: boolean;
  /**
   * Indicates whether the window control for resizing is visible.
   *
   * [Document](https://ui-prototype.jonnys.top/zh/ui/#windowcontrolresize)
   */
  windowControlResize: boolean;
  /**
   * Specifies the behavior of the window control close button.
   * Possible values:
   * - 'close' (closes the window),
   * - 'hide' (hides the window),
   * - 'none' (no action and the close button is not visible).
   *
   * [Document](https://ui-prototype.jonnys.top/zh/ui/#windowcontrolclose)
   */
  windowControlClose: 'close' | 'hide' | 'none';
  /**
   * Toggles the visibility of a button by its ID.
   * @method
   * @param id - The unique ID of the button.
   * @param hidden - False to show the button, true to hide it.
   *
   * [Document](https://ui-prototype.jonnys.top/zh/ui/#togglebuttonhidden)
   */
  toggleButtonHidden(id: string, hidden?: boolean): void;
  /**
   * Toggles the disabled state of a button by its ID.
   * @method
   * @param id - The unique ID of the button.
   * @param disabled - False to enable the button, true to disable it.
   *
   * [Document](https://ui-prototype.jonnys.top/zh/ui/#togglebuttondisabled)
   */
  toggleButtonDisabled(id: string, disabled?: boolean): void;
  /**
   * Toggles the visibility of a window control button by its ID.
   * @method
   * @param id - The unique ID of the window control button.
   * @param hidden - False to show the window control button, true to hide it.
   *
   * [Document](https://ui-prototype.jonnys.top/zh/ui/#togglewindowcontrolhidden)
   */
  toggleWindowControlHidden(id: string, hidden?: boolean): void;
  /**
   * Toggles the disabled state of a window control button by its ID.
   * @method
   * @param id - The unique ID of the window control button.
   * @param disabled - False to enable the window control button, true to disable it.
   *
   * [Document](https://ui-prototype.jonnys.top/zh/ui/#togglewindowcontroldisabled)
   */
  toggleWindowControlDisabled(id: string, disabled?: boolean): void;
}
