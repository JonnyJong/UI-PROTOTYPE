function parsePath(...paths: string[]): string {
  let segments: string[] = [];

  for (const path of paths) {
    for (const segment of path.replace(/\\/g, '/').split('/')) {
      if (segment === '.') continue;
      if (segment === '..') {
        segments.pop();
        continue;
      }
      segments.push(segment);
    }
  }

  let path: string = segments.join('/');

  switch (paths[0]?.replace(/\\/g, '/').split('/')[0]) {
    case '.':
      path = './' + path;
      break;
    case '':
      path = '/' + path;
      break;
  }

  if (path === '') {
    path = '.';
  }

  return path;
}

/**
 * Resolves and returns the absolute path relative to the application's distribution directory.
 * @param {...string} path - Relative path segments to be resolved.
 * @returns {string} - Absolute path based on the distribution directory.
 *
 * [Document](https://ui-prototype.jonnys.top/zh/utils/#distpath)
 */
export function distPath(...path: string[]): string {
  return parsePath(__dirname, '../..', ...path);
}

/** [Document](https://ui-prototype.jonnys.top/zh/utils/#pathnormalize) */
export function pathNormalize(...path: string[]): string {
  return path
    .join('/')
    .replace(/[\\\/\:\*\?\"\r\n\,\| ]/g, '-')
    .replace(/\-{2,}/g, '-');
}
