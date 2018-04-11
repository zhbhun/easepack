const loaders = [
  'eslint-loader',
  'url-loader',
  'html-loader',
  'ejs-loader',
  'babel-loader',
  'css-loader',
  'scss-loader',
  'svg-loader',
];

const factories = loaders.reduce(function (fcs, item) {
  return Object.assign(fcs, { [item]: require(`./${item}`) });
}, {});

function create(config, name) {
  const loaderConfig = config && config.loaders && config.loaders[name];
  if (loaderConfig === false) {
    return null;
  } else if (typeof loaderConfig === 'object') {
    return loaderConfig;
  }
  const loaderFactory = factories[name];
  if (typeof loaderFactory !== 'function') {
    return null;
  }
  return loaderFactory(config);
}

module.exports = function (config) {
  return loaders
    .map(function (loader) {
      return create(config, loader);
    }).filter(function (item) {
      return !!item;
    });
}
