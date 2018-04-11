var path = require('path');
var merge = require('webpack-merge');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

var dllPath = require('../utils/dllPath');

var WebpackConfig = require('./webpack.config');

function WebpackDevConfig(config) {
  var publicPath = config.output.publicPath;
  var filenames = config.output.filenames;
  return merge(WebpackConfig(config), {
    entry: config.input.reduce(function (entry, input) {
      entry[input.name] = [input.script];
      return entry;
    }, {}),
    output: {
      path: config.output.path,
    },
    plugins: [
      new ExtractTextPlugin({ filename: filenames.css }),
    ]
    // chunks
    .concat((function () {
      var plugins = [];
      config.vendors.forEach(function (vendor) {
        var dll = dllPath(config.output.temp, vendor.name);
        var assets = require(path.resolve(dll, 'assets.json'));
        var manifest = filenames.manifest.replace('[name]', vendor.name);
        var manifestPath = path.resolve(dll, manifest);
        plugins.push(new webpack.DllReferencePlugin({
          context: config.context,
          manifest: require(manifestPath),
        }));
        plugins.push(new AddAssetHtmlPlugin({
          filepath: path.resolve(dll, assets[vendor.name].js),
          includeSourcemap: false,
          publicPath: publicPath,
          typeOfAsset: 'js',
        }));
        if (assets[vendor.name].css) {
          plugins.push(new AddAssetHtmlPlugin({
            filepath: path.resolve(dll, assets[vendor.name].css),
            includeSourcemap: false,
            publicPath: publicPath,
            typeOfAsset: 'css',
          }));
        }
        plugins.push(new CopyWebpackPlugin([{
          from: dll,
          to: config.output.path,
          ignore: [
            '*.json',
            '*.map',
          ],
        }]));
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
        minify: {
          removeComments: true,
          // collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          // minifyJS: true,
          // minifyCSS: true,
          // minifyURLs: true,
        },
        chunks: [name],
      });
    }).filter(function (item) { return item !== null })),
  }, config.native || config.webpack || {});
}

module.exports = WebpackDevConfig;
