const { existsSync } = require('fs');
const { readdir, writeFile, readFile } = require('fs/promises');
const path = require('path');
const { parse } = require('yaml');

const DEFAULT_LOCAL = require('../package.json').defaultLocale

function walkKeys(object, keys, name) {
  for (const key in object) {
    if (typeof object[key] === 'string') {
      keys.push([...name, key].join('.'));
    } else {
      walkKeys(object[key], keys, [...name, key]);
    }
  }
}

async function generateDeclare(json) {
  try {
    let keys = [];
    walkKeys(json, keys, []);
    let dts = `export type LocaleKeys = '${keys.join("' | '")}';`;
    await writeFile(path.join(__dirname, '../ts/types/locale.d.ts'), dts, 'utf-8');
  } catch (error) {
    console.error(error);
    console.warn('Failed to generate locale keys list');
  }
}

async function compileLocale() {
  try {
    const files = await readdir(path.join(__dirname, '../locale'));

    let locales = {};
    for (const file of files) {
      let { name } = path.parse(file);
      let lang = await renderFile(path.join(__dirname, '../locale', file));
      if (!lang) continue;
      locales[name] = lang;
    }

    await writeFile(path.join(__dirname, '../dist/locales.json'), JSON.stringify(locales, null, 0));
    
    return 0;
  } catch (error) {
    console.error(error);
    console.error('Failed to compile locale');
    return 1;
  }
}

async function renderFile(file) {
  let { name } = path.parse(file);
  try {
    const yaml = await readFile(file, 'utf-8');
    const json = parse(yaml);

    if (name === DEFAULT_LOCAL) {
      await generateDeclare(json);
    }

    await writeFile(path.join(__dirname, '../dist/locale', name + '.json'), JSON.stringify(json, null, 0));
    return json.language;
  } catch (error) {
    console.error(error);
    console.error(`Failed to render ${name}`);
  }
}

module.exports = { compileLocale };

if (require.main === module) {
  const dir = path.join(__dirname, '../dist/locale');
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  renderFile(process.argv[2]);
}