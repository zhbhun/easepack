var path = require('path');
var webpack = require('webpack');
var merge = require('webpack-merge');
var AssetsPlugin = require('assets-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var dllPath = require('../utils/dllPath');

var WebpackConfig = require('./webpack.config');

function WebpackDevDllConfig(config, index) {
  var vendors = config.vendors;
  var currentVendor = vendors[index];
  var previousVendors = vendors.slice(0, index);
  var outputPath = dllPath(config.output.temp, currentVendor.name);
  var filenames = config.output.filenames;
  return merge(WebpackConfig(config), {
    devtool: 'source-map',
    entry: {
      [currentVendor.name]: currentVendor.dependencies,
    },
    output: {
      path: outputPath,
      library: filenames.library,
    },
    plugins: [
      new ExtractTextPlugin({ filename: filenames.css }),
      new webpack.DllPlugin({
        context: config.context,
        name: filenames.library,
        path: path.resolve(outputPath, filenames.manifest),
      }),
      new AssetsPlugin({
        filename: 'assets.json', // TODO
        fullPath: false,
        includeManifest: false,
        path: outputPath,
        prettyPrint: true,
        update: true,
      }),
    ].concat(previousVendors.map(function (vendor) {
      return new webpack.DllReferencePlugin({
        context: config.context,
        manifest: require(path.resolve(outputPath, filenames.manifest.replace('[name]', vendor.name))),
      });
    })),
  }, config.native || config.webpack || {});
}

module.exports = WebpackDevDllConfig;
