var webpack = require('webpack');
var merge = require('webpack-merge');

var WebpackCommonConfig = require('./webpack.config.common');

/**
 * Webpack development config generator
 *
 * @param {object} paths @see ../path
 * @param {object} config webpack config
 */
function WebpackDevConfig(paths, config) {
  var source = paths.source;
  var commonConfig = WebpackCommonConfig(paths, 'server');

  // This is the development configuration.
  // It is focused on developer experience and fast rebuilds.
  // The production configuration is different and lives in a separate file.
  var finalConfig = merge(commonConfig, {
    // These are the "entry points" to our application.
    // This means they will be the "root" imports that are included in JS bundle.
    // The first two entry points enable "hot" CSS and auto-refreshes for JS.
    entry: [
      // TODO description
      'react-hot-loader/patch',
      // Include an alternative client for WebpackDevServer. A client's job is to
      // connect to WebpackDevServer by a socket and get notified about changes.
      // When you save a file, the client will either apply hot updates (in case
      // of CSS changes), or refresh the page (in case of JS changes). When you
      // make a syntax error, this client will display a syntax error overlay.
      // Note: instead of the default WebpackDevServer client, we use a custom one
      // to bring better experience for Create React App users. You can replace
      // the line below with these two lines if you prefer the stock client:
      // require.resolve('webpack-dev-server/client') + '?/',
      // require.resolve('webpack/hot/dev-server'),
      require.resolve('react-dev-utils/webpackHotDevClient'),
      // Finally, this is your app's code:
      source.mainPath,
      // We include the app code last so that if there is a runtime error during
      // initialization, it doesn't blow up the WebpackDevServer client, and
      // changing JS code would still trigger a refresh.
    ],
    plugins: [
      // This is necessary to emit hot updates (currently CSS only):
      new webpack.HotModuleReplacementPlugin(),
    ]
  });
  return merge(finalConfig, config);
}

module.exports = WebpackDevConfig;
