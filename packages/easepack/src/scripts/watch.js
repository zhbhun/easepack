// Do this as the first thing so that any code reading it knows the right env.
const process = require('process');

process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const fs = require('fs');
const path = require('path');
const yargs = require('yargs');
const chalk = require('chalk');
const merge = require('webpack-merge');

const preset = require('../utils/preset');
const setupCompiler = require('../utils/setupCompiler');

const { argv } = yargs;
const context = fs.realpathSync(process.cwd());

const makeConfig = rawConfig => preset('build', merge({
  mode: 'development',
  watch: true,
}, rawConfig));

const build = (rawConfig) => {
  const config = Array.isArray(rawConfig)
    ? rawConfig.map(makeConfig)
    : makeConfig(rawConfig);

  const compiler = setupCompiler(config);
  compiler.watch(config.watchOptions || {}, (err, stats) => {
    if (err) {
      console.error(chalk.red('Failed to compile.', [err]));
      process.exit(1);
    }
  });
};

build(require(path.resolve(context, argv.config)));
