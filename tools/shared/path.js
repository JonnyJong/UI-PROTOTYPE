const path = require("path");

function src2dist(src, filename) {
  const srcDir = path.relative('./src', path.dirname(src));
  return path.join('./dist', srcDir, filename);
}

module.exports = { src2dist };
