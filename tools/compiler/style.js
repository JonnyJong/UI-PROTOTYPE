const { render } = require('stylus');
const { eachInDir, writeFile } = require('../shared/fs');
const path = require('path');
const { readFile } = require('fs/promises');
const { src2dist } = require('../shared/path');

function getConfig(file, keys) {
  if (typeof file !== 'string') return;
  if (typeof keys !== 'string') return;

  let config;
  try {
    config = require(__dirname, '../../src/shared/config', file + '.json');
  } catch {
    return;
  }

  for (const key of keys.split('.')) {
    if (typeof config !== 'object') return;
    config = config[key];
  }

  return config;
}

async function compileStyle(file) {
  const source = await readFile(file, 'utf8');
  try {
    let { dir, base, name } = path.parse(file);
    const css = render(source, {
      paths: [dir],
      filename: base,
      globals: {
        config: getConfig,
      },
    });
    await writeFile(src2dist(file, name + '.css'), css, 'utf8');
  } catch (error) {
    console.error(error);
  }
}

module.exports = { compileStyle };

if (require.main === module) {
  eachInDir('./src', (file)=>{
    if (path.parse(file).ext !== '.styl') return;
    return compileStyle(file);
  });
}
