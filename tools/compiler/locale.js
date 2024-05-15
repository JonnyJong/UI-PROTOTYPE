const { readdir, readFile } = require('fs/promises');
const { eachInDir, writeFile } = require('../shared/fs');
const path = require('path');
const yaml = require('yaml');

const DEFAULT_LOCALE = require('../../src/shared/config/default.json').locale;
const DTSTemplate = `/** [Document](https://ui-prototype.jonnys.top/zh/locales/#localedict) */
export type LocaleDict = { [key: string]: string | LocaleDict };

/** [Document](https://ui-prototype.jonnys.top/zh/locales/#localekeys) */
export type LocaleKeys = `;

function walkKeys(object, keys, name) {
  for (const key in object) {
    if (typeof object[key] === 'string') {
      keys.push([...name, key].join('.'));
    } else {
      walkKeys(object[key], keys, [...name, key]);
    }
  }
}

async function generateDTS(locale) {
  try {
    let keys = [];
    walkKeys(locale, keys, []);
    let dts = `${DTSTemplate}${keys.join("'|'")}';\n`;
    await writeFile('./src/shared/types/locales.d.ts', dts, 'utf8');
  } catch (error) {
    console.error(error);
  }
}

async function compile(name) {
  let dist = {};
  await eachInDir(path.join('./locales', name), async (file) => {
    if (!['.yml', 'yaml'].includes(path.extname(file))) return;
    let source = await readFile(file, 'utf8');
    try {
      let obj = yaml.parse(source);
      dist = Object.assign(dist, obj);
    } catch (error) {
      console.error(error);
    }
  });
  return dist;
}

async function compileLocales() {
  let locales = {};

  let dirents = await readdir('./locales', { withFileTypes: true });
  for (const dirent of dirents) {
    if (!dirent.isDirectory()) continue;

    let dist = await compile(dirent.name);

    if (typeof dist.language !== 'string') continue;
    locales[dirent.name] = dist.language;
    await writeFile(
      path.join('./dist/locales', dirent.name + '.json'),
      JSON.stringify(dist, undefined, 0),
      'utf8'
    );

    if (dirent.name !== DEFAULT_LOCALE) continue;
    await generateDTS(dist);
  }

  try {
    await writeFile(
      './dist/locales.json',
      JSON.stringify(locales, undefined, 0),
      'utf8'
    );
  } catch (error) {
    console.error(error);
  }
}

module.exports = { compileLocales };

if (require.main === module) {
  compileLocales();
}
