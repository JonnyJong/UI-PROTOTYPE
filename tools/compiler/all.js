const path = require("path");
const { eachInDir } = require("../shared/fs");
const { compileLocales } = require("./locale");
const { compilePug } = require("./view");
const { compileStyle } = require("./style");
const { copyAssets } = require("./assets");

async function compileAll() {
  await compileLocales();
  await compilePug();
  await eachInDir('./src/renderer', (file)=>{
    if (path.parse(file).ext === '.styl') {
      return compileStyle(file);
    }
    return copyAssets(file);
  });
}

compileAll();
