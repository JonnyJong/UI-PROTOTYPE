const { existsSync } = require('fs');
const fs = require('fs/promises');
const path = require('path');

async function writeFile(file, data, encoding) {
  const dir = path.dirname(file);
  if (!existsSync(dir)) {
    await fs.mkdir(dir, { recursive: true });
  }
  return fs.writeFile(file, data, encoding);
}

async function copyFile(src, dest) {
  const dir = path.dirname(dest);
  if (!existsSync(dir)) {
    await fs.mkdir(dir, { recursive: true });
  }
  return fs.copyFile(src, dest)
}

async function eachInDir(dir, callback) {
  let dirents = await fs.readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    if (dirent.name.startsWith('_')) continue;

    let src = path.join(dir, dirent.name);

    if (dirent.isDirectory()) {
      await eachInDir(src, callback);
    } else if (dirent.isFile()) {
      await callback(src);
    }
  }
}

module.exports = { writeFile, copyFile, eachInDir };
