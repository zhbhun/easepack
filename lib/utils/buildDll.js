var rimraf = require('rimraf');

var printErrors = require('./printErrors');
var setupCompiler = require('./setupCompiler');
var dllVersion = require('./dllVersion');
var WebpackDllConfig = require('../config/webpack.config.dll');

function runDllBuild(config, index, callback) {
  if (!config.vendors[index]) {
    callback && callback();
  } else {
    var webpackConfig = WebpackDllConfig(config, index);
    var dllPath = webpackConfig.output.path;
    if (!dllVersion.isExpired(dllPath, config.vendors[index])) {
      runDllBuild(config, index + 1, callback);
    } else {
      rimraf(webpackConfig.output.path, function () {
        var webpackCompiler = setupCompiler(webpackConfig);
        console.log();
        console.log('> ' + config.vendors[index].name + ' building...');
        console.log();
        webpackCompiler.run((err, stats) => {
          if (err) {
            printErrors('Failed to compile.', [err]);
            process.exit(1);
          }

          if (stats.compilation.errors.length) {
            printErrors('Failed to compile.', stats.compilation.errors);
            process.exit(1);
          }

          if (process.env.CI && stats.compilation.warnings.length) {
            printErrors('Failed to compile.', stats.compilation.warnings);
            process.exit(1);
          }

          dllVersion.record(dllPath, config.vendors[index]);
          runDllBuild(config, index + 1, callback);
        });
      });
    }
  }
}

module.exports = function (config, callback) {
  runDllBuild(config, 0, callback);
};
