import { UIText } from 'shared/components/text';
import { Dom } from 'shared/utils/dom';
import { OutlineRect } from './position';

export type TitlebarButton = {
  /**
   * Should be unique; duplicates will be ignored.
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
   */
  icon: string;
  /**
   * Button tooltip.
   */
  tooltip?: string;
  /**
   * Indicates whether the button is visible.
   */
  hidden?: boolean;
  /**
   * Indicates whether the button is disabled.
   */
  disabled?: boolean;
  /**
   * Button triggered action.
   */
  action: Function;
};
export interface TitlebarAvatar {
  img: string;
  action?: (rect: OutlineRect) => any;
}
/**
 * Window titlebar.
 * @class
 */
export declare class Titlebar {
  /**
   * Initializes the titlebar.
   * @description Should not be called multiple times.
   * @method
   */
  init(): void;
  /**
   * Application state information.
   */
  state: string | HTMLElement | Dom;
  /**
   * Array of buttons displayed in the titlebar.
   */
  buttons: TitlebarButton[];
  /**
   * Search bar.
   */
  searchbar: UIText | HTMLInputElement | null;
  /**
   * Titlebar avatar button.
   */
  avatar?: TitlebarAvatar;
  /**
   * Array of window control buttons in the titlebar.
   */
  windowControls: TitlebarButton[];
  /**
   * Indicates whether the window control for minimizing is visible.
   */
  windowControlMinimize: boolean;
  /**
   * Indicates whether the window control for resizing is visible.
   */
  windowControlResize: boolean;
  /**
   * Specifies the behavior of the window control close button.
   * Possible values:
   * - 'close' (closes the window),
   * - 'hide' (hides the window),
   * - 'none' (no action and the close button is not visible).
   */
  windowControlClose: 'close' | 'hide' | 'none';
  /**
   * Toggles the visibility of a button by its ID.
   * @method
   * @param id - The unique ID of the button.
   * @param hidden - False to show the button, true to hide it.
   */
  toggleButtonHidden(id: string, hidden?: boolean): void;
  /**
   * Toggles the disabled state of a button by its ID.
   * @method
   * @param id - The unique ID of the button.
   * @param disabled - False to enable the button, true to disable it.
   */
  toggleButtonDisabled(id: string, disabled?: boolean): void;
  /**
   * Toggles the visibility of a window control button by its ID.
   * @method
   * @param id - The unique ID of the window control button.
   * @param hidden - False to show the window control button, true to hide it.
   */
  toggleWindowControlHidden(id: string, hidden?: boolean): void;
  /**
   * Toggles the disabled state of a window control button by its ID.
   * @method
   * @param id - The unique ID of the window control button.
   * @param disabled - False to enable the window control button, true to disable it.
   */
  toggleWindowControlDisabled(id: string, disabled?: boolean): void;
}
