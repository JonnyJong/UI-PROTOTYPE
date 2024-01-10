const { existsSync } = require("fs");
const path = require("path");
const { renderFile } = require("pug");
const { writeFile } = require("../shared/fs");
const { src2dist } = require("../shared/path");
const { readdir } = require("fs/promises");
const { getConfig } = require("../shared/config");

async function compile(name) {
  const mainLayout = path.join('./src/renderer', name, 'views/_main.pug');
  if (!existsSync(mainLayout)) return;
  try {
    let html = renderFile(mainLayout, {
      config: getConfig,
    });
    await writeFile(src2dist(mainLayout, '../main.html'), html, 'utf8');
  } catch (error) {
    console.error(error);
  }
}

async function compilePug() {
  let dirents = await readdir('./src/renderer', { withFileTypes: true });
  for (const dirent of dirents) {
    if (!dirent.isDirectory()) continue;
    await compile(dirent.name);
  }
}

module.exports = { compilePug };

if (require.main === module) {
  compilePug();
}
