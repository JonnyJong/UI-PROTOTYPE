const path = require("path");
const { compileLocale } = require("./locale");
const { compileStyle } = require("./style");
const { existsSync } = require("fs");
const { mkdir } = require("fs/promises");
const { compileLayout } = require("./layout");

const DIRS = ['locale'];

async function checkDir() {
  for (let dir of DIRS) {
    dir = path.join(__dirname, '../dist/' + dir);
    if (!existsSync(dir)) {
      await mkdir(dir, { recursive: true });
    }
  }
}

async function main() {
  checkDir();

  let errors = 0;
  
  errors += await compileStyle();
  errors += await compileLocale();
  errors += await compileLayout();

  if (errors > 0) {
    console.error(`${errors} errors occurred`);
    throw undefined;
  }
}

module.exports = { checkDir };

if (require.main = module) {
  main();
}