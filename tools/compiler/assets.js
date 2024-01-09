const path = require("path");
const { src2dist } = require("../shared/path");
const { copyFile, eachInDir } = require("../shared/fs");

async function copyAssets(src) {
  let { name, ext } = path.parse(src);
  
  if (['.ts', '.styl'].includes(ext)) return;

  let dest = src2dist(src, name);
  try {
    await copyFile(src, dest);
  } catch (error) {
    console.error(error);
  }
}

module.exports = { copyAssets };

if (require.main === module) {
  let src = process.argv[2];
  if (src) {
    copyAssets(src);
  } else {
    eachInDir('./src', copyAssets);
  }
}
