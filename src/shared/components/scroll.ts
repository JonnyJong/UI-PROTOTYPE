import { $ } from 'shared/utils/dom';

const SCROLL_INCREMENTAL = 32;

export class UIScroll extends HTMLElement {
  #inited = false;
  #track = $.pug<HTMLDivElement>('.ui-scroll-track').at(0);
  #thumb = $.pug<HTMLDivElement>('.ui-scroll-thumb').at(0);
  #btnUp = $.pug<HTMLDivElement>('.ui-scroll-btn-up.icon.icon-CaretSolidUp').at(
    0
  );
  #btnDown = $.pug<HTMLDivElement>(
    '.ui-scroll-btn-down.icon.icon-CaretSolidDown'
  ).at(0);
  #horizontal = false;
  #target: HTMLElement | null = null;
  #trackSize = 0;
  #thumbSize = 0;
  #targetSize = 0;
  #targetScrollSize = 0;
  #dragStart = 0;
  #dragLength = 0;
  constructor() {
    super();
    // Basic
    this.#horizontal = this.hasAttribute('horizontal');
    let target = this.getAttribute('target');
    if (target) this.target = document.querySelector(target);
    this.#resizeObserver.observe(this);
    // Event
    this.#btnUp.addEventListener('click', () => {
      if (!this.#target) return;
      this.#target.scroll({
        [this.#horizontal ? 'left' : 'top']:
          this.#target[this.#horizontal ? 'scrollLeft' : 'scrollTop'] -
          SCROLL_INCREMENTAL,
        behavior: 'smooth',
      });
    });
    this.#btnDown.addEventListener('click', () => {
      if (!this.#target) return;
      this.#target.scroll({
        [this.#horizontal ? 'left' : 'top']:
          this.#target[this.#horizontal ? 'scrollLeft' : 'scrollTop'] +
          SCROLL_INCREMENTAL,
        behavior: 'smooth',
      });
    });
    this.addEventListener('pointerdown', (e) => {
      if (!this.#target) return;
      e.preventDefault();
      let {
        [this.#horizontal ? 'left' : 'top']: start,
        [this.#horizontal ? 'width' : 'height']: length,
      } = this.getBoundingClientRect();
      this.#dragStart = start + 16;
      this.#dragLength = length - 32;
      let offset = e[this.#horizontal ? 'x' : 'y'];
      if (
        offset < this.#dragStart ||
        offset > this.#dragStart + this.#dragLength
      )
        return;
      window.addEventListener('pointermove', this.#dragHandler);
      window.addEventListener('pointerup', this.#dragendHandler);
      this.#target.scroll({
        [this.#horizontal ? 'left' : 'top']:
          ((offset - this.#thumbSize / 2 - this.#dragStart) /
            this.#dragLength) *
          this.#targetScrollSize,
        behavior: 'smooth',
      });
    });
  }
  //#region Private
  connectedCallback() {
    if (this.#inited) return;
    this.#inited = true;
    this.append(this.#track, this.#thumb, this.#btnUp, this.#btnDown);
  }
  #dragHandler = (e: PointerEvent) => {
    if (!this.#target) return;
    let offset =
      e[this.#horizontal ? 'x' : 'y'] - this.#thumbSize / 2 - this.#dragStart;
    this.#target[this.#horizontal ? 'scrollLeft' : 'scrollTop'] =
      (offset / this.#dragLength) * this.#targetScrollSize;
  };
  #dragendHandler = (e: PointerEvent) => {
    window.removeEventListener('pointermove', this.#dragHandler);
    window.removeEventListener('pointerup', this.#dragendHandler);
  };
  #scrollHandler = () => {
    if (!this.#target) return;
    let scrolled = this.#target[this.#horizontal ? 'scrollLeft' : 'scrollTop'];
    this.#thumb.style[this.#horizontal ? 'left' : 'top'] =
      (scrolled / this.#targetScrollSize) * this.#trackSize + 16 + 'px';
  };
  #observerHandler = () => {
    // Prepare
    if (!this.#target) {
      this.classList.add('ui-scroll-hidden');
      return;
    }
    let targetSize =
      this.#target.getBoundingClientRect()[
        this.#horizontal ? 'width' : 'height'
      ];
    let targetScrollSize =
      this.#target[this.#horizontal ? 'scrollWidth' : 'scrollHeight'];
    if (
      this.#targetSize === targetSize &&
      this.#targetScrollSize === targetScrollSize
    )
      return this.#scrollHandler();
    this.#targetSize = targetSize;
    this.#targetScrollSize = targetScrollSize;
    this.#trackSize =
      this.getBoundingClientRect()[this.#horizontal ? 'width' : 'height'] - 32;
    // Set Scrollbar Style
    let hidden =
      this.#targetScrollSize <= this.#targetSize || this.#trackSize <= 0;
    this.classList.toggle('ui-scroll-hidden', hidden);
    if (hidden) return;
    this.#thumbSize =
      (this.#targetSize / this.#targetScrollSize) * this.#trackSize;
    this.#thumb.style[this.#horizontal ? 'width' : 'height'] =
      this.#thumbSize + 'px';
    this.#scrollHandler();
  };
  #resizeObserver = new ResizeObserver(this.#observerHandler);
  #mutationObserver = new MutationObserver(this.#observerHandler);
  #bindTarget() {
    if (this.#target === null) return;
    this.#resizeObserver.observe(this.#target);
    this.#mutationObserver.observe(this.#target, {
      subtree: true,
      childList: true,
    });
    this.#target.addEventListener('scroll', this.#observerHandler);
    this.#observerHandler();
  }
  #unbindTarget() {
    if (this.#target === null) return;
    this.#resizeObserver.unobserve(this.#target);
    this.#mutationObserver.disconnect();
    this.#target.removeEventListener('scroll', this.#observerHandler);
  }
  //#region Public
  /**
   * Whether the scrollbar is horizontal.
   */
  get horizontal() {
    return this.#horizontal;
  }
  set horizontal(value) {
    if (!!value === this.#horizontal) return;
    this.#horizontal = !!value;
    this.#observerHandler();
  }
  /**
   * Elements associated with the scrollbar.
   */
  get target() {
    return this.#target;
  }
  set target(value) {
    if (!(value instanceof HTMLElement || value === null)) return;
    this.#unbindTarget();
    this.#target = value;
    this.#bindTarget();
  }
}
customElements.define('ui-scroll', UIScroll);
