var chalk = require('chalk');
var webpack = require('webpack');
var clearConsole = require('react-dev-utils/clearConsole');
var formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
var ProgressBarPlugin = require('progress-bar-webpack-plugin');

var isInteractive = process.stdout.isTTY;

/**
 * setup compiler with logger.
 *
 * @param {Object} config webpack configuration object
 * @param {boolean|object} server webpack server config
 * @returns
 */
function setupCompiler(config, server = false) {
  // log with progress
  config.plugins.push(new ProgressBarPlugin());

  var compiler = webpack(config);

  // "invalid" event fires when you have changed a file, and Webpack is
  // recompiling a bundle. WebpackDevServer takes care to pause serving the
  // bundle, so if you refresh, it'll wait instead of serving the old one.
  // "invalid" is short for "bundle invalidated", it doesn't imply any errors.
  compiler.plugin('invalid', function() {
    if (isInteractive) {
      clearConsole();
    }
    console.log('Compiling...');
  });

  var isFirstCompile = true;
  // "done" event fires when Webpack has finished recompiling the bundle.
  // Whether or not you have warnings or errors, you will get this event.
  compiler.plugin('done', function(stats) {
    if (isInteractive && server) {
      clearConsole();
    }

    // We have switched off the default Webpack output in WebpackDevServer
    // options so we are going to "massage" the warnings and errors and present
    // them in a readable focused way.
    var messages = formatWebpackMessages(stats.toJson({}, true));
    var isSuccessful = !messages.errors.length && !messages.warnings.length;
    var showInstructions = isSuccessful && isFirstCompile && server;

    if (isSuccessful) {
      console.log(chalk.green('Compiled successfully!'));

      if (showInstructions && typeof server === 'object') {
        console.log();
        console.log('The app is running at:');
        console.log();
        console.log('  ' + chalk.cyan(server.protocol + '://' + server.host + ':' + server.port + '/'));
        console.log();
        isFirstCompile = false;
      } else {
        console.log();
      }
    } else if (messages.errors.length) {
      // If errors exist, only show errors.
      console.log(chalk.red('Failed to compile.'));
      console.log();
      messages.errors.forEach(message => {
        console.log(message);
        console.log();
      });
      return;
    } else if (messages.warnings.length) {
      // Show warnings if no errors were found.
      console.log(chalk.yellow('Compiled with warnings.'));
      console.log();
      messages.warnings.forEach(message => {
        console.log(message);
        console.log();
      });
      // Teach some ESLint tricks.
      console.log('You may use special comments to disable some warnings.');
      console.log('Use ' + chalk.yellow('// eslint-disable-next-line') + ' to ignore the next line.');
      console.log('Use ' + chalk.yellow('/* eslint-disable */') + ' to ignore all warnings in a file.');
      console.log();
    }

    console.log(`Hash: ${stats.hash}`);
    console.log(`Time: ${stats.endTime - stats.startTime}ms`);
    // TODO print static assets
    // console.log(stats.compilation.assets);
  });

  return compiler;
}

module.exports = setupCompiler;
