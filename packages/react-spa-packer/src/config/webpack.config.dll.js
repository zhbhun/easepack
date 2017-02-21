var path = require('path');
var webpack = require('webpack');
var merge = require('webpack-merge');

var WebpackCommonConfig = require('./webpack.config.common');


/**
 * Webpack dll config generator
 *
 * @param {object}  paths @see ../path
 * @param {string}  name
 * @param {array}   dependencies
 */
function WebpackDllConfig(paths, name, dependencies) {
  var output = paths.output;
  var commonConfig = WebpackCommonConfig(paths, true);

  // This is the dll configuration.
  // It is focused on developer experience and fast rebuilds.
  // The production configuration is different and lives in a separate file.
  return merge(commonConfig, {
    // These are the "entry points" to our application.
    // This means they will be the "root" imports that are included in JS bundle.
    entry: {
      [name]: dependencies,
    },

    plugins: [
      new webpack.DllPlugin({
        path: path.resolve(output.path.dllPath, '[name].json'),
        name: '[name]_library',
      }),
    ],
  });
}

module.exports = WebpackDllConfig;
