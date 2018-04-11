// Do this as the first thing so that any code reading it knows the right env.
const process = require('process');
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const yargs = require('yargs');
const chalk = require('chalk');
const webpack = require('webpack');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const preset = require('../utils/preset');

const argv = yargs.argv;
const context = fs.realpathSync(process.cwd());


const makeConfig = (rawConfig) => {
  const config = preset(merge(
    {
      mode: 'production',
      plugins: [
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
          logLevel: 'silent'
        }),
        new FriendlyErrorsPlugin({ clearConsole: false })
      ]
    },
    rawConfig
  ));
  return merge(config, {
    plugins: [
      new CleanWebpackPlugin(config.output.path, {
        root: config.context,
        verbose: false
      })
    ]
  });
}

const build = (rawConfig) => {
  const config = Array.isArray(rawConfig) ?
    rawConfig.map(makeConfig) :
    makeConfig(rawConfig);

  let compiler = null;
  try {
    compiler = webpack(config);
  } catch (err) {
    console.error(chalk.red('Failed to compile.'), '\n');
    console.error(err.message || err, '\n');
    process.exit(1);
  }

  compiler.run((err, stats) => {
    if (err) {
      console.error(chalk.red('Failed to compile.', [err]));
      process.exit(1);
    }
  });
}

build(require(path.resolve(context, argv.config)));
