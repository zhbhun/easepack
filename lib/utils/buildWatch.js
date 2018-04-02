var WebpackWatchConfig = require('../config/webpack.config.watch');

var setupCompiler = require('./setupCompiler');
var printErrors = require('./printErrors');

module.exports = function (config, dllConfig, callback) {
  var webpackConfig = WebpackWatchConfig(config, dllConfig);
  var webpackCompiler = setupCompiler(webpackConfig);
  console.log();
  console.log('> ' + Object.keys(webpackConfig.entry).join(', ') + ' building...');
  console.log();

  webpackCompiler.watch({
    aggregateTimeout: 300
  }, (err, stats) => {
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

    callback && callback(webpackConfig);
  });
};
