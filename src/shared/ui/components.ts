type ComponentNameMap = 'lang' | 'scroll' | 'text';
const ComponentNames: ComponentNameMap[] = ['lang', 'scroll', 'text'];

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

export function initAllComponents() {
  initComponents(...ComponentNames);
}
