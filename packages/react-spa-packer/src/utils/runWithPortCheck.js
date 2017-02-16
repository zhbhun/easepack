const chalk = require('chalk');
var detect = require('detect-port');
var prompt = require('react-dev-utils/prompt');
var clearConsole = require('react-dev-utils/clearConsole');
var getProcessForPort = require('react-dev-utils/getProcessForPort');

var isInteractive = process.stdout.isTTY;

function runWithPortCheck(port, run) {
  // We attempt to use the default port but if it is busy, we offer the user to
  // run on a different port. `detect()` Promise resolves to the next free port.
  detect(port).then(_port => {
    if (port === _port) {
      run(port);
      return;
    }

    if (isInteractive) {
      clearConsole();
      var existingProcess = getProcessForPort(port);
      var question =
        chalk.yellow('Something is already running on port ' + port + '.' +
          ((existingProcess) ? ' Probably:\n  ' + existingProcess : '')) +
        '\n\nWould you like to run the app on another port instead?';

      prompt(question, true).then(shouldChangePort => {
        if (shouldChangePort) {
          run(port);
        }
      });
    } else {
      console.log(chalk.red('Something is already running on port ' + port + '.'));
    }
  })
  .catch(err => {
    console.log(err);
  });
}

module.exports = runWithPortCheck;
