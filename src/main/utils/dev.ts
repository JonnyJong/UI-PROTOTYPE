import { WebContents, app, ipcMain } from 'electron';
import { watchFile } from 'fs';
import { readdir } from 'fs/promises';
import path from 'path';

const distRoot = path.join(__dirname, '../../');

async function queryFiles(
  type: string,
  dir: string = distRoot
): Promise<string[]> {
  let result: string[] = [];
  const dirents = await readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    if (dirent.isDirectory()) {
      result.push(...(await queryFiles(type, path.join(dir, dirent.name))));
      continue;
    }
    if (dirent.isFile() && dirent.name.endsWith(`.${type}`))
      result.push(path.join(dir, dirent.name));
  }
  return result;
}

async function initAutoReloadCSS(ctx: WebContents, label: string) {
  let files = await queryFiles('css', path.join(distRoot, 'renderer', label));
  for (const file of files) {
    watchFile(file, { interval: 1000 }, () => {
      ctx.send('dev:css', file);
    });
  }
}

function initScale(ctx: WebContents) {
  ipcMain.on('dev:scale', (_, scale) => {
    ctx.setZoomFactor(Math.max(0.1, ctx.getZoomFactor() + scale));
  });
  ipcMain.on('dev:resetScale', () => {
    ctx.setZoomFactor(1);
  });
}

export function initDevFunctions(ctx: WebContents, label: string) {
  if (app.isPackaged) return;
  ctx.openDevTools();
  initAutoReloadCSS(ctx, label);
  initScale(ctx);
}
