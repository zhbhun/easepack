var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var merge = require('webpack-merge');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');

var dllPath = require('../utils/dllPath');

var WebpackConfig = require('./webpack.config');

function WebpackDevConfig(config) {
  var output = config.output;
  var publicUrl = output.publicUrl;
  var publicPath = output.publicPath;
  var filenames = output.filenames;
  return merge(WebpackConfig(config), {
    devtool: 'cheap-module-eval-source-map',
    entry: config.input.reduce(function (entry, input) {
      entry[input.name] = [
        'webpack-dev-server/client?' + publicUrl,
        'webpack/hot/dev-server',
        input.script,
      ];
      return entry;
    }, {}),
    output: {
      path: output.path,
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new ExtractTextPlugin({
        disable: true,
      }),
    ]
    // vendors
    .concat((function () {
      var plugins = [];
      config.vendors.forEach(function (vendor) {
        var dll = dllPath(config.output.temp, vendor.name);
        var manifest = filenames.manifest.replace('[name]', vendor.name);
        var manifestPath = path.resolve(dll, manifest);
        var js = filenames.js.replace('[name]', vendor.name);
        var jsPath = path.resolve(dll, js);
        var css = filenames.css.replace('[name]', vendor.name);
        var cssPath = path.resolve(dll, css);
        plugins.push(new webpack.DllReferencePlugin({
          context: config.context,
          manifest: require(manifestPath),
        }));
        var assets = [];
        if (fs.existsSync(jsPath)) {
          assets.push(js);
        }
        if (fs.existsSync(cssPath)) {
          assets.push(css);
        }
        plugins.push(new HtmlWebpackIncludeAssetsPlugin({
          assets: assets,
          append: false,
          publicPath: publicPath,
          hash: true,
        }));
      });
      return plugins;
    }()))
    // html
    .concat(config.input.map(function (input) {
      if (!input.html) return null;
      var name = input.name;
      var filename = filenames.html.replace('[name]', name);
      return new HtmlWebpackPlugin({
        inject: true,
        chunksSortMode: 'dependency',
        template: input.html,
        filename: filename,
        chunks: [name],
        hash: true,
      });
    }).filter(function (item) { return item !== null })),
  }, config.native || config.webpack || {});
}

module.exports = WebpackDevConfig;
