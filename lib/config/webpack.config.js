var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var ProgressBarPlugin = require('progress-bar-webpack-plugin');
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
var CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

var rules = require('../rules');
var getClientEnvironment = require('../utils/getClientEnvironment');
var InterpolateHtmlPlugin = require('../plugins/InterpolateHtmlPlugin');

function WebpackConfig(config){
  var env = getClientEnvironment(config.output.publicPath.slice(0, -1));
  var production = env.raw.NODE_ENV === 'production';
  return {
    cache: true,
    output: {
      pathinfo: true,
      publicPath: config.output.publicPath,
      filename: config.output.filenames.js,
      chunkFilename: config.output.filenames.js,
    },
    resolve: {
      extensions: ['.js'],
      modules: [
        path.resolve(config.context, 'node_modules'),
      ],
    },
    module: {
      rules: rules(config),
    },
    plugins: [
      new webpack.DefinePlugin(env.stringified),
      // Makes some environment variables available in index.html.
      // The public URL is available as %PUBLIC_URL% in index.html, e.g.:
      // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
      // In production, it will be an empty string unless you specify "homepage"
      // in `package.json`, in which case it will be the pathname of that URL.
      new InterpolateHtmlPlugin(env.raw),
      new ProgressBarPlugin(),
      new CaseSensitivePathsPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.BannerPlugin('build: ' + new Date().toString()),
    ].concat(production ? [
      new LodashModuleReplacementPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        beautify: false,
        comments: false,
        compress: {
          screw_ie8: true, // doesn't support IE8
          warnings: false,
          drop_console: true,
          collapse_vars: true,
          reduce_vars: true,
        },
        mangle: {
          screw_ie8: true,
        },
        output: {
          comments: false,
          screw_ie8: true,
        },
      }),
    ]: []),
    node: {
      fs: 'empty',
      net: 'empty',
      tls: 'empty'
    },
  };
}

module.exports = WebpackConfig;
