var rimraf = require('rimraf');

var defaultConfig = require('./utils/defaultConfig');
var buildDll = require('./utils/buildDll');
var buildProduction = require('./utils/buildProduction');

function runBuild(configs, index) {
  if (!configs || index >= configs.length || !configs[index]) {
    return;
  }
  var config = defaultConfig(configs[index]);
  rimraf(config.output.path, function () {
    buildDll(config, function () {
      buildProduction(config, function (webpackConfig) {
        var listener = config.listener || {};
        if (typeof listener.afterBuild == 'function') {
          listener.afterBuild(webpackConfig);
        }
        runBuild(configs, index + 1);
      });
    });
  });
}


module.exports = function (configs) {
  runBuild(Array.isArray(configs) ? configs : [configs], 0);
}
