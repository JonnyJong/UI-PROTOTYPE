/**
 * Hero Animation Options Interface
 * @interface HeroOptions
 * @status experimental
 */
export interface HeroOptions {
  // TODO: Design hero animation interface
  /**
   * The node to which the animation is to be applied
   */
  node: HTMLDivElement;
  /**
   * Rectangular boundaries of nodes
   */
  rect: DOMRect;
}
export interface BasicPageSwitchAnimationOptions {
  hero?: HeroOptions;
}
export interface EntrancePageSwitchAnimationOptions {
  type: 'entrance';
  /**
   * @default 'bottom'
   */
  from?: 'bottom' | 'right' | 'left' | 'top';
}
export interface SlidePageSwitchAnimationOptions {
  type: 'slide';
  /**
   * @default 'right'
   */
  from?: 'right' | 'left' | 'bottom' | 'top';
}
export interface DrillPageSwitchAnimationOptions {
  type: 'drill';
  /**
   * @default 'in'
   */
  from?: 'in' | 'out';
}
export interface FadePageSwitchAnimationOptions {
  type: 'fade';
  /**
   * @description
   * Unit in milliseconds
   * @default 100
   */
  outroDuration?: number;
  /**
   * @description
   * Unit in milliseconds
   * @default 100
   */
  introDuration?: number;
  /**
   * @description
   * Unit in milliseconds
   * @default 0
   */
  introWhen?: number;
}
export type PageSwitchAimationOptions = BasicPageSwitchAnimationOptions &
  (
    | EntrancePageSwitchAnimationOptions
    | SlidePageSwitchAnimationOptions
    | DrillPageSwitchAnimationOptions
    | FadePageSwitchAnimationOptions
  );

/**
 * Page Utils Interface
 * @interface IPageUtils
 */
export interface IPageUtils {
  /**
   * Close page
   * @description Only if the page is the current page
   */
  close(): void;
}

export interface IPage {
  /**
   * Page show callback
   * @param heroOptions Hero animation options
   */
  onShow?(heroOptions?: HeroOptions): any;
  /**
   * Page hide callback
   * @param heroOptions Hero animation options
   */
  onHide?(heroOptions?: HeroOptions): any;
  /**
   * Page close callback
   * @returns {any} True to prevent the default behavior.
   */
  onClose?(): any;
}

export interface PageConstructor {
  /**
   * Enable single instance
   * @description Only one page instance and node are created when true
   * @static
   */
  readonly SINGLETON_INSTANCE?: boolean;
  /**
   * Enable page templates
   * @static
   */
  readonly LAYOUT_TEMPLATE?: boolean;
  /**
   * Generate page template options
   * @static
   */
  getLayoutOptions?(options?: any): any;
  /**
   *
   * @param node Page container node
   * @param utils Page Utils
   * @param options Page open options
   */
  new (node: HTMLDivElement, utils: IPageUtils, options?: any): IPage;
}

/**
 * Page event class
 * @template T Event type
 * @interface IPagesEvent
 */
export declare class IPagesEvent<T extends keyof PagesEventMap> {
  /**
   * Target page instance
   * @readonly
   */
  target: IPage;
  /**
   * Target page element
   * @readonly
   */
  node: HTMLDivElement;
  /**
   * Event type
   * @readonly
   */
  readonly type: T;
  /**
   * Prevent event default behaviours
   * @method
   */
  prevent(): void;
}

export interface PagesEventMap {
  open: IPagesEvent<'open'>;
  back: IPagesEvent<'back'>;
  jump: IPagesEvent<'jump'>;
  home: IPagesEvent<'home'>;
  shortcut: IPagesEvent<'shortcut'>;
}

export interface PagesInitOptions {
  /**
   * Homepage name
   */
  home?: string;
  /**
   * Whether the shortcut is disabled
   */
  shortcutDisabled?: boolean;
}

/**
 * Page Management Interface
 * @interface
 */
export declare class IPages {
  /**
   * Page history
   * @readonly
   */
  readonly history: string[];
  /**
   * Whether the shortcut is disabled
   */
  shortcutDisabled: boolean;
  /**
   * Initializes the pages
   * @description Should not be called multiple times.
   * @method
   */
  init(options?: PagesInitOptions): void;
  /**
   * Clear history and go back to homepage
   */
  home(): Promise<boolean>;
  /**
   * Back to previous page
   */
  back(): Promise<void>;
  /**
   * Open a new page
   * @param name Page name
   * @param options Page constructor options
   * @param animation Page switch animation options,
   * default animation type is `entrance`
   * @returns Returns true if the page was opened successfully
   */
  open(
    name: string,
    options?: any,
    animation?: PageSwitchAimationOptions
  ): Promise<boolean>;
  /**
   * Jump to the specified history
   * @param index History index
   * @returns Returns true if the jump was successful
   */
  jump(index: number): Promise<boolean>;
  /**
   * Define new page
   * @param name Unique name of the page
   * Contains only letters, numbers, hyphens and underscores
   * @param constructor Page class
   */
  define(name: string, constructor: PageConstructor): void;
  /**
   * Add a event listener
   * @param name Event name
   * @param listener Event listener
   */
  on<K extends keyof PagesEventMap>(
    name: K,
    listener: (event: PagesEventMap[K]) => any
  ): void;
  /**
   * Remove a event listener
   * @param name Event name
   * @param listener Event listener
   */
  off<K extends keyof PagesEventMap>(
    name: K,
    listener: (event: PagesEventMap[K]) => any
  ): void;
}
