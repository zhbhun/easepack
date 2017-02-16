var fs = require('fs');
var path = require('path');
var mergeWith = require('lodash/mergeWith');

var DEFAULT_PATHS = {
  context: fs.realpathSync(process.cwd()),
  source: {
    src: 'src',
    main: 'src/index.js',
    public: 'public',
    html: 'public/index.html',
    package: 'package.json',
    nodeModules: 'node_modules',
  },
  output: {
    path: {
      dll: '.dll',
      build: 'build',
    },
    filename: {
      js: 'static/js/[name].[chunkhash:8].js',
      css: 'static/css/[name].[contenthash:8].css',
      media: 'static/media/[name].[hash:8].[ext]',
    },
  },
};

/**
 * TODO
 *
 * @param {object} paths @see DEFAULT_PATHS
 */
module.exports = function (paths) {
  if (typeof paths !== 'object') {
    paths = {};
  }
  var root = (paths && paths.context) || DEFAULT_PATHS.context;
  return mergeWith(paths, DEFAULT_PATHS, function (objValue, srcValue, key, object, source, stack) {
    if (key === 'context') {
      return objValue || srcValue;
    } else if (key === 'filename') {
      return Object.assign({}, srcValue, objValue);
    } else if (typeof srcValue === 'string') {
      object[key + 'Path'] = path.resolve(root, objValue || srcValue);
      return objValue || srcValue;
    }
  });
}


