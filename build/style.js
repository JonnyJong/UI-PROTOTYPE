const { existsSync, mkdirSync } = require('fs');
const { readFile, writeFile } = require('fs/promises');
const path = require('path');
const { render } = require('stylus');

async function compileStyle() {
  try {
    const stylus = await readFile(path.join(__dirname, '../style/main.styl'), 'utf-8');
    const css = render(stylus, {
      paths: [path.join(__dirname, '../style')],
      filename: 'main.styl',
    });
    await writeFile(path.join(__dirname, '../dist/style.css'), css, 'utf-8');
    return 0;
  } catch (error) {
    console.error(error);
    console.error('Failed to compile style');
    return 1;
  }
}

module.exports = { compileStyle };

if (require.main === module) {
  const dir = path.join(__dirname, '../dist');
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  
  compileStyle();
}