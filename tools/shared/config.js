function getConfig(file, keys) {
  if (typeof file !== 'string') return;
  if (typeof keys !== 'string') return;

  let config;
  try {
    config = require(__dirname, '../../src/shared/config', file + '.json');
  } catch {
    return;
  }

  for (const key of keys.split('.')) {
    if (typeof config !== 'object') return;
    config = config[key];
  }

  return config;
}

module.exports = { getConfig };
