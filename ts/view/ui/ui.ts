const COMPONENTS: string[] = ['lang'];

export function initComponents() {
  for (const name of COMPONENTS) {
    require('./component/' + name);
  }
}