import { WebContents, app, ipcMain } from 'electron';
import { watchFile } from 'fs';
import { readdir } from 'fs/promises';
import path from 'path';
import { sleep } from 'shared/utils/timer';

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

function initAutoReReload(ctx: WebContents) {
  let lastLoad = Date.now();
  let tryTimes = 0;
  ctx.on('did-start-loading', () => {
    if (Date.now() - lastLoad > 5000) {
      tryTimes = 0;
    }
    lastLoad = Date.now();
  });
  ctx.on('preload-error', async (_, __, error) => {
    if (!error.message.startsWith('Cannot find module')) return;
    if (Date.now() - lastLoad > 1000) return;
    if (tryTimes > 10) return;
    await sleep(1000);
    ctx.reload();
    tryTimes++;
  });
}

export function initDevFunctions(ctx: WebContents, label: string) {
  if (app.isPackaged) return;
  ctx.openDevTools();
  initAutoReloadCSS(ctx, label);
  initScale(ctx);
  initAutoReReload(ctx);
}
