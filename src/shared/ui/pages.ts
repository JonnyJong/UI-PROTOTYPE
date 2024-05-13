import {
  BasicPageSwitchAnimationOptions,
  DrillPageSwitchAnimationOptions,
  EntrancePageSwitchAnimationOptions,
  FadePageSwitchAnimationOptions,
  IPage,
  IPageUtils,
  IPages,
  IPagesEvent,
  PageConstructor,
  PageSwitchAimationOptions,
  PagesEventMap,
  PagesInitOptions,
  SlidePageSwitchAnimationOptions,
} from 'shared/types/pages';
import { $ } from 'shared/utils/dom';
import { run, runSequence } from 'shared/utils/function';
import { defaultPageSwitchAnimation } from 'shared/config/ui.json';
import { OperationSequence } from 'shared/types/function';
import { sleep } from 'shared/utils/timer';
import { getScaleFactor } from 'shared/utils/position';

type Direction = 'bottom' | 'right' | 'left' | 'top';

type HistoryItem = {
  name: string;
  node: HTMLDivElement;
  page: IPage;
  animation?: PageSwitchAimationOptions;
  utils: IPageUtils;
};
type PageCache = {
  node: HTMLDivElement;
  page: IPage;
  utils: IPageUtils;
};

//#region Animation
type AnimationHandler = (
  container: HTMLDivElement,
  items: { a?: HistoryItem; b: HistoryItem },
  options: PageSwitchAimationOptions,
  forward: boolean
) => any;
async function entranceAnimation(
  container: HTMLDivElement,
  { a, b }: { a?: HistoryItem; b: HistoryItem },
  options: BasicPageSwitchAnimationOptions & EntrancePageSwitchAnimationOptions,
  forward: boolean
) {
  const SPEED_FACTOR = 1;
  const animationDirection = forward ? '' : ' reverse';
  let direction = 'bottom';
  if (['bottom', 'right', 'left', 'top'].includes(options?.from as any)) {
    direction = options.from as any;
  }
  let nodeA = a?.node;
  let nodeB = b.node;
  let sequence: OperationSequence = [
    () => {
      if (!nodeA) return;
      if (forward) run(a?.page.onHide);
      nodeA.style.animation = '';
    },
    () => {
      if (!nodeA) return;
      nodeA.style.animation = `.1s page-swich-entrance-a${animationDirection}`;
      return 100;
    },
    () => {
      if (nodeA) {
        nodeA.style.animation = '';
      }
      nodeB.style.animation = '';
      if (forward) {
        nodeA?.remove();
        container.append(nodeB);
        run(b.page.onShow, options.hero);
      } else {
        container.append(nodeA as Node);
        nodeB.remove();
        run(a?.page.onShow);
      }
    },
    () => {
      nodeB.style.animation = `.4s page-swich-entrance-b-${direction} cubic-bezier(0, ${SPEED_FACTOR}, 0, ${SPEED_FACTOR})${animationDirection}`;
      return 400;
    },
    () => {
      if (!forward) run(b.page.onHide, options.hero);
      nodeB.style.animation = '';
    },
  ];
  if (!forward) {
    sequence.reverse();
  }
  return runSequence(sequence, true);
  // .1s opacity .75, .4s translate 210px
}
async function slideAnimation(
  container: HTMLDivElement,
  { a, b }: { a?: HistoryItem; b: HistoryItem },
  options: BasicPageSwitchAnimationOptions & SlidePageSwitchAnimationOptions,
  forward: boolean
) {
  const SPEED_FACTOR = 1;
  const MIRROR: { [name: string]: Direction } = {
    left: 'right',
    right: 'left',
    top: 'bottom',
    bottom: 'top',
  };
  let direction = options.from ?? 'right';
  let nodeA: HTMLDivElement | undefined = a?.node;
  let nodeB: HTMLDivElement | undefined = b.node;
  let pageA: IPage | undefined = a?.page;
  let pageB: IPage | undefined = b.page;
  if (!forward) {
    direction = MIRROR[direction];
    [nodeA, nodeB] = [nodeB, nodeA];
    [pageA, pageB] = [pageB, pageA];
  }
  // Animation
  run(pageA?.onHide, !forward ? options.hero : undefined);
  if (nodeA)
    nodeA.style.animation = `.1s page-switch-slide-a-${direction} cubic-bezier(${SPEED_FACTOR}, 0, ${SPEED_FACTOR}, 0)`;
  await sleep(100);
  if (nodeA) {
    nodeA.remove();
    nodeA.style.animation = '';
  }
  if (nodeB) {
    nodeB.style.animation = `.4s page-switch-slide-b-${direction} cubic-bezier(0, ${SPEED_FACTOR}, 0, ${SPEED_FACTOR})`;
    container.append(nodeB);
    run(pageB?.onShow, forward ? options.hero : undefined);
  }
  await sleep(400);
  if (nodeB) {
    nodeB.style.animation = '';
  }
  // Move 100px (0.15s, 0.4s)
}
async function drillAnimation(
  container: HTMLDivElement,
  { a, b }: { a?: HistoryItem; b: HistoryItem },
  options: BasicPageSwitchAnimationOptions & DrillPageSwitchAnimationOptions,
  forward: boolean
) {
  const SPEED_FACTOR = 1;
  const INCREMENT = 400;
  let directionA = options.from ?? 'in';
  let nodeA: HTMLDivElement | undefined = a?.node;
  let nodeB: HTMLDivElement | undefined = b.node;
  let pageA: IPage | undefined = a?.page;
  let pageB: IPage | undefined = b.page;
  if (!forward) {
    directionA = directionA === 'in' ? 'out' : 'in';
    [nodeA, nodeB] = [nodeB, nodeA];
    [pageA, pageB] = [pageB, pageA];
  }
  let directionB = directionA === 'in' ? 'out' : 'in';
  let { width, height } = container.getBoundingClientRect();
  let scale1 = String(getScaleFactor(width, height, INCREMENT));
  let scale2 = String(getScaleFactor(width, height, -INCREMENT));
  // Animation
  container.style.setProperty('--page-switch-drill-scale-1', scale1);
  container.style.setProperty('--page-switch-drill-scale-2', scale2);
  run(pageA?.onHide, !forward ? options.hero : undefined);
  if (nodeA)
    nodeA.style.animation = `.1s page-switch-drill-${directionA} cubic-bezier(${SPEED_FACTOR}, 0, ${SPEED_FACTOR}, 0)`;
  if (nodeB) {
    container.append(nodeB);
    nodeB.style.animation = `.5s page-switch-drill-${directionB} reverse cubic-bezier(${SPEED_FACTOR}, 0, ${SPEED_FACTOR}, 0)`;
  }
  run(pageB?.onShow, forward ? options.hero : undefined);
  await sleep(100);
  if (nodeA) {
    nodeA.remove();
    nodeA.style.animation = '';
  }
  await sleep(400);
  if (nodeB) nodeB.style.animation = '';
  container.style.removeProperty('--page-switch-drill-scale-1');
  container.style.removeProperty('--page-switch-drill-scale-2');
  // scale +-100px opacity (.1s, .5s begin in same time)
}
async function fadeAnimation(
  container: HTMLDivElement,
  { a, b }: { a?: HistoryItem; b: HistoryItem },
  options: BasicPageSwitchAnimationOptions & FadePageSwitchAnimationOptions,
  forward: boolean
) {
  let durationA = Math.max(options.outroDuration ?? 100, 0);
  let durationB = Math.max(options.introDuration ?? 100, 0);
  let startB = Math.max(options.introWhen ?? 0, 0);
  let nodeA: HTMLDivElement | undefined = a?.node;
  let nodeB: HTMLDivElement | undefined = b.node;
  let pageA: IPage | undefined = a?.page;
  let pageB: IPage | undefined = b.page;
  if (!forward) {
    startB = Math.max(durationB - durationA + startB, 0);
    [durationA, durationB] = [durationB, durationA];
    [nodeA, nodeB] = [nodeB, nodeA];
    [pageA, pageB] = [pageB, pageA];
  }
  // Animation
  run(pageA?.onHide, !forward ? options.hero : undefined);
  nodeA?.animate(
    [
      {
        opacity: 1,
      },
      {
        opacity: 0,
      },
    ],
    durationA
  );
  setTimeout(() => {
    if (!nodeA) return;
    nodeA.remove();
  }, durationA);
  await sleep(startB);
  if (!nodeB) return;
  container.append(nodeB);
  run(pageB?.onShow, forward ? options.hero : undefined);
  nodeB.animate(
    [
      {
        opacity: 0,
      },
      {
        opacity: 1,
      },
    ],
    durationB
  );
}
const animations: { [name: string]: AnimationHandler } = {
  entrance: entranceAnimation as AnimationHandler,
  slide: slideAnimation as AnimationHandler,
  drill: drillAnimation as AnimationHandler,
  fade: fadeAnimation as AnimationHandler,
};

//#region Event
interface PagesEventConstructorOptions<K extends keyof PagesEventMap>
  extends IPagesEvent<K> {}

class PagesEvent<K extends keyof PagesEventMap> implements IPagesEvent<K> {
  #target: IPage;
  #node: HTMLDivElement;
  #type: K;
  #prevent: () => void;
  constructor(options: PagesEventConstructorOptions<K>) {
    this.#target = options.target;
    this.#node = options.node;
    this.#type = options.type;
    this.#prevent = options.prevent;
  }
  get target() {
    return this.#target;
  }
  get node() {
    return this.#node;
  }
  get type() {
    return this.#type;
  }
  get prevent() {
    return this.#prevent;
  }
}
interface DispatchEventOptions<K extends keyof PagesEventMap> {
  target: IPage;
  node: HTMLDivElement;
}

class Pages implements IPages {
  #pagesContainer = $.pug<HTMLDivElement>('.pages-container');
  #pages: { [name: string]: PageConstructor } = {};
  /**
   * The singleton page is stored here after initialisation
   */
  #pagesCache: { [name: string]: PageCache } = {};
  #history: HistoryItem[] = [];
  #shortcutDisabled = false;
  #homapageName = 'home';
  #events: {
    [name in keyof PagesEventMap]: Set<(event: PagesEventMap[name]) => any>;
  } = {
    open: new Set(),
    back: new Set(),
    home: new Set(),
    jump: new Set(),
    shortcut: new Set(),
  };
  //#region Private
  #dispatchEvent<K extends keyof PagesEventMap>(
    name: K,
    options: DispatchEventOptions<K>
  ): boolean {
    if (!(name in this.#events)) {
      throw Error(`Non-existent page event types`);
    }
    let prevented = false;
    const event = new PagesEvent({
      target: options.target,
      node: options.node,
      type: name,
      prevent: () => {
        prevented = true;
      },
    });
    this.#events[name].forEach((listener) => {
      try {
        // HACK: (TS2345)
        listener(event as any);
      } catch (error) {
        console.error(error);
      }
    });
    return prevented;
  }
  async #generatePageNode(
    name: string,
    page: PageConstructor,
    options?: any
  ): Promise<HTMLDivElement> {
    let node = $.pug<HTMLDivElement>(`.page.page-${name}`).at(0);
    if (!page.LAYOUT_TEMPLATE) return node;
    let layoutOptions = await run(page.getLayoutOptions, options);
    node.append(
      ...$.layout(
        'pages/' + name,
        layoutOptions instanceof Error ? {} : layoutOptions
      ).doms
    );
    return node;
  }
  async #generatePageCache(name: string, options?: any, cache?: PageCache) {
    let pageConstructor = this.#pages[name];
    if (cache) return cache;
    let node: HTMLDivElement = await this.#generatePageNode(
      name,
      pageConstructor,
      options
    );
    let page: IPage;
    let utils: IPageUtils = {
      close: () => {
        this.#requestClosePage(page);
      },
    };
    page = new pageConstructor(node, utils);
    cache = {
      node,
      utils,
      page: page,
    };
    return cache;
  }
  #requestClosePage(page: IPage) {}
  //#region Public
  get history() {
    return this.#history.map((page) => page.name);
  }
  get shortcutDisabled() {
    return this.#shortcutDisabled;
  }
  set shortcutDisabled(value) {
    this.#shortcutDisabled = !!value;
  }
  init(options?: PagesInitOptions): void {
    // Options
    if (options?.home) {
      this.#homapageName = options.home;
    }
    if (typeof options?.shortcutDisabled === 'boolean') {
      this.#shortcutDisabled = options.shortcutDisabled;
    }
    // Container
    document.body.append(this.#pagesContainer.at(0));
    // Home
    this.home();
    // Shortcut
    window.addEventListener('mousedown', ({ button }) => {
      if (this.#shortcutDisabled || button !== 3) return;
      let currentItem = this.#history[this.#history.length - 1];
      if (!currentItem) return;
      let prevented = this.#dispatchEvent('shortcut', {
        target: currentItem.page,
        node: currentItem.node,
      });
      if (prevented) return;
      this.back();
    });
  }
  async home(
    options?: any,
    animation?: PageSwitchAimationOptions
  ): Promise<boolean> {
    let pageConstructor = this.#pages[this.#homapageName];
    if (!pageConstructor) return false;
    // Create
    let cache = await this.#generatePageCache(
      this.#homapageName,
      options,
      this.#pagesCache[this.#homapageName]
    );
    let item: HistoryItem = {
      name: this.#homapageName,
      animation,
      ...cache,
    };
    // Event
    let prevented = this.#dispatchEvent('home', {
      target: cache.page,
      node: cache.node,
    });
    if (prevented) return false;
    for (const item of this.#history) {
      if (this.#pages[item.name].SINGLETON_INSTANCE) continue;
      prevented = (await run(item.page.onClose)) === true;
      if (prevented) return false;
    }
    // Switch
    if (
      !this.#pagesCache[this.#homapageName] &&
      pageConstructor.SINGLETON_INSTANCE
    ) {
      this.#pagesCache[this.#homapageName] = cache;
    }
    if (!animation || !(animation.type in animations)) {
      animation = {
        type: defaultPageSwitchAnimation as any,
      };
    }
    await animations[animation.type](
      this.#pagesContainer.at(0),
      { a: this.#history[this.#history.length - 1], b: item },
      animation,
      true
    );
    this.#history = [item];
    return true;
  }
  async back() {
    if (this.#history.length <= 1) return;
    let currentItem = this.#history[this.#history.length - 1];
    // Event
    let prevented = this.#dispatchEvent('back', {
      target: currentItem.page,
      node: currentItem.node,
    });
    if (prevented) return;
    if (!this.#pages[currentItem.name].SINGLETON_INSTANCE) {
      prevented = (await run(currentItem.page.onClose)) === true;
    }
    if (prevented) return;
    // Switch
    let prevItem = this.#history[this.#history.length - 2];
    let animation = currentItem.animation;
    if (!animation || !(animation.type in animations)) {
      animation = {
        type: defaultPageSwitchAnimation as any,
      };
    }
    await animations[animation.type](
      this.#pagesContainer.at(0),
      {
        a: prevItem,
        b: currentItem,
      },
      animation,
      false
    );
    this.#history.pop();
  }
  async open(
    name: string,
    options?: any,
    animation?: PageSwitchAimationOptions
  ): Promise<boolean> {
    let pageConstructor = this.#pages[name];
    if (!pageConstructor) return false;
    // Check Cache & Create
    let cache = await this.#generatePageCache(
      name,
      options,
      this.#pagesCache[name]
    );
    let item: HistoryItem = {
      name,
      animation,
      ...cache,
    };
    // Event
    let prevented = this.#dispatchEvent('open', {
      target: cache.page,
      node: cache.node,
    });
    if (prevented) return false;
    if (!this.#pagesCache[name] && pageConstructor.SINGLETON_INSTANCE) {
      this.#pagesCache[name] = cache;
    }
    // Switch
    if (!animation || !(animation.type in animations)) {
      animation = {
        type: defaultPageSwitchAnimation as any,
      };
    }
    await animations[animation.type](
      this.#pagesContainer.at(0),
      { a: this.#history[this.#history.length - 1], b: item },
      animation,
      true
    );
    this.#history.push(item);
    return true;
  }
  async jump(index: number): Promise<boolean> {
    let targetItem = this.#history[index];
    if (!targetItem || targetItem === this.#history[this.#history.length - 1])
      return false;
    // Event
    let prevented = this.#dispatchEvent('jump', {
      target: targetItem.page,
      node: targetItem.node,
    });
    for (const item of this.#history.slice(index + 1)) {
      if (this.#pages[item.name].SINGLETON_INSTANCE) continue;
      prevented = (await run(item.page.onClose)) === true;
      if (prevented) return false;
    }
    // Switch
    let currentItem = this.#history[this.#history.length - 1];
    let animation = { ...(currentItem.animation as PageSwitchAimationOptions) };
    if (!animation || !(animation.type in animations)) {
      animation = {
        type: defaultPageSwitchAnimation as any,
      };
    }
    delete animation.hero;
    await animations[animation.type](
      this.#pagesContainer.at(0),
      {
        a: targetItem,
        b: currentItem,
      },
      animation,
      false
    );
    this.#history.splice(index + 1, this.#history.length);
    return true;
  }
  define(name: string, constructor: PageConstructor): void {
    const nameValidation = /^[A-Za-z0-9\-_]+$/;
    if (typeof name !== 'string' || !nameValidation.test(name)) {
      throw new Error(`"${name}" is not a valid page name`);
    }
    if (name in this.#pages) {
      throw new Error(
        `the name "${name}" has already been used with this registry`
      );
    }
    if (typeof constructor !== 'function') {
      throw new Error(`Parameter constructor is not of type 'Function'`);
    }
    this.#pages[name] = constructor;
  }
  on<K extends keyof PagesEventMap>(
    name: K,
    listener: (event: PagesEventMap[K]) => any
  ): void {
    if (!(name in this.#events) || typeof listener !== 'function') return;
    this.#events[name].add(listener);
  }
  off<K extends keyof PagesEventMap>(
    name: K,
    listener: (event: PagesEventMap[K]) => any
  ): void {
    if (!(name in this.#events) || typeof listener !== 'function') return;
    this.#events[name].delete(listener);
  }
}

export const pages = new Pages();
