/**
 * Hero Animation Options Interface
 * @interface HeroOptions
 * @status experimental
 *
 * [Document](https://ui-prototype.jonnys.top/zh/ui/#herooptions)
 */
export interface HeroOptions {
  // TODO: Design hero animation interface
  /**
   * The node to which the animation is to be applied
   *
   * [Document](https://ui-prototype.jonnys.top/zh/ui/#node_1)
   */
  node: HTMLElement;
  /**
   * Rectangular boundaries of nodes
   *
   * [Document](https://ui-prototype.jonnys.top/zh/ui/#rect)
   */
  rect: DOMRect;
}

/** [Document](https://ui-prototype.jonnys.top/zh/ui/#basicpageswitchanimationoptions) */
export interface BasicPageSwitchAnimationOptions {
  /** [Document](https://ui-prototype.jonnys.top/zh/ui/#hero) */
  hero?: HeroOptions;
}
/** [Document](https://ui-prototype.jonnys.top/zh/ui/#entrancepageswitchanimationoptions) */
export interface EntrancePageSwitchAnimationOptions {
  type: 'entrance';
  /**
   * @default 'bottom'
   *
   * [Document](https://ui-prototype.jonnys.top/zh/ui/#from)
   */
  from?: 'bottom' | 'right' | 'left' | 'top';
}
/** [Document](https://ui-prototype.jonnys.top/zh/ui/#slidepageswitchanimationoptions) */
export interface SlidePageSwitchAnimationOptions {
  type: 'slide';
  /**
   * @default 'right'
   *
   * [Document](https://ui-prototype.jonnys.top/zh/ui/#from_1)
   */
  from?: 'right' | 'left' | 'bottom' | 'top';
}
/** [Document](https://ui-prototype.jonnys.top/zh/ui/#drillpageswitchanimationoptions) */
export interface DrillPageSwitchAnimationOptions {
  type: 'drill';
  /**
   * @default 'in'
   *
   * [Document](https://ui-prototype.jonnys.top/zh/ui/#from_2)
   */
  from?: 'in' | 'out';
}
/** [Document](https://ui-prototype.jonnys.top/zh/ui/#fadepageswitchanimationoptions) */
export interface FadePageSwitchAnimationOptions {
  type: 'fade';
  /**
   * @description
   * Unit in milliseconds
   * @default 100
   *
   * [Document](https://ui-prototype.jonnys.top/zh/ui/#outroduration)
   */
  outroDuration?: number;
  /**
   * @description
   * Unit in milliseconds
   * @default 100
   *
   * [Document](https://ui-prototype.jonnys.top/zh/ui/#introduration)
   */
  introDuration?: number;
  /**
   * @description
   * Unit in milliseconds
   * @default 0
   *
   * [Document](https://ui-prototype.jonnys.top/zh/ui/#introwhen)
   */
  introWhen?: number;
}
/** [Document](https://ui-prototype.jonnys.top/zh/ui/#pageswitchaimationoptions) */
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
 *
 * [Document](https://ui-prototype.jonnys.top/zh/ui/#ipageutils)
 */
export interface IPageUtils {
  /**
   * Close page
   * @description Only if the page is the current page
   *
   * [Document](https://ui-prototype.jonnys.top/zh/ui/#close)
   */
  close(): void;
}

/** [Document](https://ui-prototype.jonnys.top/zh/ui/#ipage) */
export interface IPage {
  /**
   * Page show callback
   * @param heroOptions Hero animation options
   *
   * [Document](https://ui-prototype.jonnys.top/zh/ui/#onshow)
   */
  onShow?(heroOptions?: HeroOptions): any;
  /**
   * Page hide callback
   * @param heroOptions Hero animation options
   *
   * [Document](https://ui-prototype.jonnys.top/zh/ui/#onhide)
   */
  onHide?(heroOptions?: HeroOptions): any;
  /**
   * Page close callback
   * @returns {any} True to prevent the default behavior.
   *
   * [Document](https://ui-prototype.jonnys.top/zh/ui/#onclose)
   */
  onClose?(): any;
}

/** [Document](https://ui-prototype.jonnys.top/zh/ui/#pageconstructor) */
export interface PageConstructor {
  /**
   * Enable single instance
   * @description Only one page instance and node are created when true
   * @static
   *
   * [Document](https://ui-prototype.jonnys.top/zh/ui/#singleton_instance)
   */
  readonly SINGLETON_INSTANCE?: boolean;
  /**
   * Enable page templates
   * @static
   *
   * [Document](https://ui-prototype.jonnys.top/zh/ui/#layout_template)
   */
  readonly LAYOUT_TEMPLATE?: boolean;
  /**
   * Generate page template options
   * @static
   *
   * [Document](https://ui-prototype.jonnys.top/zh/ui/#getlayoutoptions)
   */
  getLayoutOptions?(options?: any): any;
  /**
   *
   * @param node Page container node
   * @param utils Page Utils
   * @param options Page open options
   *
   * [Document](https://ui-prototype.jonnys.top/zh/ui/#_7)
   */
  new (node: HTMLDivElement, utils: IPageUtils, options?: any): IPage;
}

/**
 * Page event class
 * @template T Event type
 * @interface IPagesEvent
 *
 * [Document](https://ui-prototype.jonnys.top/zh/ui/#ipagesevent)
 */
export declare class IPagesEvent<T extends keyof PagesEventMap> {
  /**
   * Target page instance
   * @readonly
   *
   * [Document](https://ui-prototype.jonnys.top/zh/ui/#target)
   */
  readonly target: IPage;
  /**
   * Target page element
   * @readonly
   *
   * [Document](https://ui-prototype.jonnys.top/zh/ui/#node)
   */
  readonly node: HTMLDivElement;
  /**
   * Event type
   * @readonly
   *
   * [Document](https://ui-prototype.jonnys.top/zh/ui/#type)
   */
  readonly type: T;
  /**
   * Prevent event default behaviours
   * @method
   *
   * [Document](https://ui-prototype.jonnys.top/zh/ui/#prevent)
   */
  prevent(): void;
}

/** [Document](https://ui-prototype.jonnys.top/zh/ui/#pageseventmap) */
export interface PagesEventMap {
  open: IPagesEvent<'open'>;
  back: IPagesEvent<'back'>;
  jump: IPagesEvent<'jump'>;
  home: IPagesEvent<'home'>;
  shortcut: IPagesEvent<'shortcut'>;
}

/** [Document](https://ui-prototype.jonnys.top/zh/ui/#pagesinitoptions) */
export interface PagesInitOptions {
  /**
   * Homepage name
   *
   * [Document](https://ui-prototype.jonnys.top/zh/ui/#home_1)
   */
  home?: string;
  /**
   * Whether the shortcut is disabled
   *
   * [Document](https://ui-prototype.jonnys.top/zh/ui/#shortcutdisabled_1)
   */
  shortcutDisabled?: boolean;
}

/**
 * Page Management Interface
 * @interface
 *
 * [Document](https://ui-prototype.jonnys.top/zh/ui/#ipages)
 */
export declare class IPages {
  /**
   * Page history
   * @readonly
   *
   * [Document](https://ui-prototype.jonnys.top/zh/ui/#history)
   */
  readonly history: string[];
  /**
   * Whether the shortcut is disabled
   *
   * [Document](https://ui-prototype.jonnys.top/zh/ui/#shortcutdisabled)
   */
  shortcutDisabled: boolean;
  /**
   * Initializes the pages
   * @description Should not be called multiple times.
   * @method
   *
   * [Document](https://ui-prototype.jonnys.top/zh/ui/#init_1)
   */
  init(options?: PagesInitOptions): void;
  /**
   * Clear history and go back to homepage
   *
   * [Document](https://ui-prototype.jonnys.top/zh/ui/#home)
   */
  home(): Promise<boolean>;
  /**
   * Back to previous page
   *
   * [Document](https://ui-prototype.jonnys.top/zh/ui/#back)
   */
  back(): Promise<void>;
  /**
   * Open a new page
   * @param name Page name
   * @param options Page constructor options
   * @param animation Page switch animation options,
   * default animation type is `entrance`
   * @returns Returns true if the page was opened successfully
   *
   * [Document](https://ui-prototype.jonnys.top/zh/ui/#open)
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
   *
   * [Document](https://ui-prototype.jonnys.top/zh/ui/#jump)
   */
  jump(index: number): Promise<boolean>;
  /**
   * Define new page
   * @param name Unique name of the page
   * Contains only letters, numbers, hyphens and underscores
   * @param constructor Page class
   *
   * [Document](https://ui-prototype.jonnys.top/zh/ui/#define)
   */
  define(name: string, constructor: PageConstructor): void;
  /**
   * Add a event listener
   * @param name Event name
   * @param listener Event listener
   *
   * [Document](https://ui-prototype.jonnys.top/zh/ui/#on)
   */
  on<K extends keyof PagesEventMap>(
    name: K,
    listener: (event: PagesEventMap[K]) => any
  ): void;
  /**
   * Remove a event listener
   * @param name Event name
   * @param listener Event listener
   *
   * [Document](https://ui-prototype.jonnys.top/zh/ui/#off)
   */
  off<K extends keyof PagesEventMap>(
    name: K,
    listener: (event: PagesEventMap[K]) => any
  ): void;
}
