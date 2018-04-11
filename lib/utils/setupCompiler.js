var chalk = require('chalk');
var qrcode = require('qrcode');
var webpack = require('webpack');

var clearConsole = require('./clearConsole');
var formatWebpackMessages = require('./formatWebpackMessages');

var isInteractive = process.stdout.isTTY;

function setupCompiler(config, server) {
  var compiler;
  // "Compiler" is a low-level interface to Webpack.
  // It lets us listen to some events and provide our own custom messages.
  try {
    compiler = webpack(config);
  } catch (err) {
    console.log(chalk.red('Failed to compile.'), '\n');
    console.log(err.message || err, '\n');
    process.exit(1);
  }

  var isFirstCompile = true;
  var url = null;
  if (server) {
    url = server.protocol + '://' + server.host + ':' + server.port + '/';
  }

  // "invalid" event fires when you have changed a file, and Webpack is
  // recompiling a bundle. WebpackDevServer takes care to pause serving the
  // bundle, so if you refresh, it'll wait instead of serving the old one.
  // "invalid" is short for "bundle invalidated", it doesn't imply any errors.
  compiler.plugin('invalid', function () {
    if (server && isInteractive) {
      clearConsole();
    }
    console.log('Compiling...');
  });

  // "done" event fires when Webpack has finished recompiling the bundle.
  // Whether or not you have warnings or errors, you will get this event.
  compiler.plugin('done', function (stats) {
    if (server && isInteractive) {
      clearConsole();
    }

    // We have switched off the default Webpack output in WebpackDevServer
    // options so we are going to "massage" the warnings and errors and present
    // them in a readable focused way.
    var messages = formatWebpackMessages(stats.toJson({}, true));
    var isSuccessful = !messages.errors.length && !messages.warnings.length;
    var showInstructions = server && isSuccessful && (isInteractive || isFirstCompile);

    if (isSuccessful) {
      console.log(chalk.green('Compiled successfully!'));
    }

    if (showInstructions) {
      console.log('\nThe app is running at:\n');
      console.log('  ' + chalk.cyan(url), '\n');
      console.log('Note that the development build is not optimized.\n');
      isFirstCompile = false;
    }

    // If errors exist, only show errors.
    if (messages.errors.length) {
      console.log(chalk.red('Failed to compile.\n'));
      messages.errors.forEach(function (message) {
        console.log(message, '\n');
      });
      return;
    }

    // Show warnings if no errors were found.
    if (messages.warnings.length) {
      console.log(chalk.yellow('Compiled with warnings.'), '\n');
      messages.warnings.forEach(function (message) {
        console.log(message, '\n');
      });
      // Teach some ESLint tricks.
      console.log('You may use special comments to disable some warnings.');
      console.log('Use ' + chalk.yellow('// eslint-disable-next-line') + ' to ignore the next line.');
      console.log('Use ' + chalk.yellow('/* eslint-disable */') + ' to ignore all warnings in a file.');
    }

    if (url) {
      qrcode.toString(url, { type: 'terminal' }, function (error, data) {
        if(error) console.error(error);
        console.log(data)
      });
    }
  });
  return compiler;
}

module.exports = setupCompiler;
