type ComponentNameMap = 'lang';

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
