const { render } = require('stylus');
const { eachInDir, writeFile } = require('../shared/fs');
const path = require('path');
const { readFile } = require('fs/promises');
const { src2dist } = require('../shared/path');

async function compileStyle(file) {
  const source = await readFile(file, 'utf8');
  try {
    let { dir, base, name } = path.parse(file);
    const css = render(source, {
      paths: [dir],
      filename: base,
    });
    await writeFile(src2dist(file, name + '.css'), css, 'utf8');
  } catch (error) {
    console.error(error);
  }
}

module.exports = { compileStyle };

if (require.main === module) {
  eachInDir('./src/renderer', (file)=>{
    if (path.parse(file).ext !== '.styl') return;
    return compileStyle(file);
  });
}
