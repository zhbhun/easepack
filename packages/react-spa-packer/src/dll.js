var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var merge = require('webpack-merge');
var AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

var setupCompiler = require('./utils/setupCompiler');
var WebpackDllConfig = require('./config/webpack.config.dll');

var MANIFEST = 'manifest.json';

function getManifestFilename(name) {
  return `${name}.${MANIFEST}`;
}

// get app specified dependencies
function getDependenciesManifest(paths, dependencies) {
  var result = {};
  dependencies.forEach(function (dependency) {
    var packageFile = path.resolve(
      paths.source.nodeModulesPath,
      `${dependency}/package.json`
    );
    var dependencyPackage = require(packageFile);
    result[dependency] = dependencyPackage.version;
  });
  return result;
}

// is prebuild cache expired
function isCacheExpired(paths, name, dependencies) {
  var newManifest = getDependenciesManifest(paths, dependencies);
  var oldManifestPath = path.resolve(paths.output.path.dllPath, getManifestFilename(name));
  if (fs.existsSync(oldManifestPath)) {
    var oldManifest = require(oldManifestPath);
    return Object.keys(newManifest).some(function (key) {
      return newManifest[key] !== oldManifest[key];
    }) || (Object.keys(newManifest).length !== Object.keys(oldManifest).length);
  }
  return true;
}

// record prebuild cache
function recordCache(paths, name, dependencies) {
  var result = getDependenciesManifest(paths, dependencies);
  fs.writeFileSync(
    path.resolve(
      paths.output.path.dllPath,
      getManifestFilename(name)
    ),
    JSON.stringify(result)
  );
}

/**
 * prebuild
 *
 * @param {object} paths
 * @param {object} config
 * @param {string} config.name prebuild file name key
 * @param {array} config.dependencies prebuild modules
 * @param {function} callback
 * @returns
 */
function build(paths, config, callback) {
  var name = config.name;
  var dependencies = config.dependencies;
  if (!isCacheExpired(paths, name, dependencies)) {
    callback && callback();
    return;
  }
  console.log('--------------------------------');
  console.log();
  console.log('Prebuilding...');
  var webpackConfig = WebpackDllConfig(
    paths,
    name,
    dependencies
  );
  var webpackCompiler = setupCompiler(webpackConfig);
  webpackCompiler.run(function (err, stats) {
    if (err) {
      console.error(err);
      return;
    }
    recordCache(paths, name, dependencies);
    console.log('Prebuil done.')
    console.log()
    console.log('--------------------------------');
    callback && callback();
  });
}

// setup webpack config with prebuild cache
function setup(config, paths, name) {
  return merge(config, {
    plugins: [
      new AddAssetHtmlPlugin({
        filepath: path.resolve(paths.output.path.dllPath, `./${name}.js`), // TODO get from config
        includeSourcemap: true,
        outputPath: 'static/js',
        publicPath: '/static/js',
        typeOfAsset: 'js',
      }),
      new webpack.DllReferencePlugin({
        context: paths.context,
        manifest: require(paths.output.path.dllPath + `/${name}.json`), // TODO get from config
      }),
    ],
  });
}

module.exports = {
  build,
  setup,
};
