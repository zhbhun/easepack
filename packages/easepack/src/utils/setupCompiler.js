const chalk = require('chalk');
const webpack = require('webpack');

module.exports = (config) => {
  let compiler = null;
  try {
    compiler = webpack(config);
  } catch (err) {
    console.error(chalk.red('Failed to compile.'), '\n');
    console.error(err.message || err, '\n');
    process.exit(1);
  }
  return compiler;
};
