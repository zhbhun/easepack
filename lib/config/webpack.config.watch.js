var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var merge = require('webpack-merge');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');

var WebpackConfig = require('./webpack.config');

function WebpackDevConfig(config, dllConfig) {
  var publicPath = config.output.publicPath;
  return merge(WebpackConfig(config), {
    devtool: 'source-map',
    entry: config.input.reduce(function (entry, input) {
      entry[input.name] = [
        input.script,
      ];
      return entry;
    }, {}),
    output: {
      path: config.output.build,
    },
    plugins: [
      new ExtractTextPlugin({
        disable: true,
      }),
    ]
    // chunks
    .concat((function () {
      var plugins = [];
      config.chunks.forEach(function (chunk) {
        var dll = path.resolve(dllConfig.output.dll, chunk.name);
        var manifest = dllConfig.filenames.manifest.replace('[name]', chunk.name);
        var manifestPath = path.resolve(dll, manifest);
        var js = dllConfig.filenames.js.replace('[name]', chunk.name);
        var jsPath = path.resolve(dll, js);
        var css = dllConfig.filenames.css.replace('[name]', chunk.name);
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
        }));
      });
      return plugins;
    }()))
    // html
    .concat(config.input.map(function (input) {
      if (!input.html) return null;
      var name = input.name;
      var filename = config.filenames.html.replace('[name]', name);
      return new HtmlWebpackPlugin({
        inject: true,
        chunksSortMode: 'dependency',
        template: input.html,
        filename: filename,
        chunks: [name],
      });
    }).filter(function (item) { return item !== null })),
  }, config.native || config.webpack || {});
}

module.exports = WebpackDevConfig;
