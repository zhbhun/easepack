var WebpackProdConfig = require('../config/webpack.config.prod');

var setupCompiler = require('./setupCompiler');
var printErrors = require('./printErrors');

module.exports = function (config, callback) {
  var webpackConfig = WebpackProdConfig(config);
  var webpackCompiler = setupCompiler(webpackConfig);
  console.log();
  console.log('> ' + Object.keys(webpackConfig.entry).join(', ') + ' building...');
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

    callback && callback(webpackConfig);
  });
};
