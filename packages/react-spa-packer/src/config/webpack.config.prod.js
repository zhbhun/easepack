var merge = require('webpack-merge');

var WebpackCommonConfig = require('./webpack.config.common');

/**
 * Webpack product config generator
 *
 * @param {Object} paths
 * @param {Object} config
 */
function WebpackProdConfig(paths, config) {
  var source = paths.source;

  var commonConfig = WebpackCommonConfig(paths);

  // This is the production configuration.
  // It compiles slowly and is focused on producing a fast and minimal bundle.
  // The development configuration is different and lives in a separate file.
  var finalConfig = merge(commonConfig, {
    // Don't attempt to continue if there are any errors.
    bail: true,

    // In production, we only want to load the app code.
    entry: {
      main:[
        source.mainPath,
      ],
    },
  });
  return merge(finalConfig, config);
}

module.exports = WebpackProdConfig;
