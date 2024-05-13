import { IPage } from 'shared/types/pages';

export class PageHome implements IPage {
  static readonly SINGLETON_INSTANCE = true;
  static readonly LAYOUT_TEMPLATE = true;
}
