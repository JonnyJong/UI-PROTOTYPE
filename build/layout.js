const { existsSync } = require("fs");
const { writeFile } = require("fs/promises");
const path = require("path");
const { renderFile } = require("pug");

async function compileLayout() {
  try {
    const html = renderFile(path.join(__dirname, '../layout/index.pug'));
    await writeFile(path.join(__dirname, '../dist/index.html'), html, 'utf-8');
    return 0;
  } catch (error) {
    console.error(error);
    console.error('Failed to compile layout');
    return 1;
  }
}

module.exports = { compileLayout };

if (require.main === module) {
  const dir = path.join(__dirname, '../dist');
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  
  compileLayout();
}