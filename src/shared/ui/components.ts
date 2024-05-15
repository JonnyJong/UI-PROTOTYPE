type ComponentNameMap = 'lang' | 'scroll' | 'text' | 'tooltip';
const ComponentNames: ComponentNameMap[] = [
  'lang',
  'scroll',
  'text',
  'tooltip',
];

/** [Document](https://ui-prototype.jonnys.top/zh/ui/#initcomponents) */
export function initComponents(...componentNames: ComponentNameMap[]) {
  for (const name of componentNames) {
    try {
      require('../components/' + name);
    } catch (error) {
      console.error(error);
      console.error('Failed to load component:', name);
    }
  }
}

/** [Document](https://ui-prototype.jonnys.top/zh/ui/#initallcomponents) */
export function initAllComponents() {
  initComponents(...ComponentNames);
}
