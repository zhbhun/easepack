// Do this as the first thing so that any code reading it knows the right env.
const process = require('process');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const ip = require('ip');
const fs = require('fs');
const path = require('path');
const yargs = require('yargs');
const chalk = require('chalk');
const detect = require('detect-port');
const merge = require('webpack-merge');
const WebpackDevServer = require('webpack-dev-server');

const preset = require('../utils/preset');
const setupCompiler = require('../utils/setupCompiler');

const { argv } = yargs;
const context = fs.realpathSync(process.cwd());

const makeConfig = (rawConfig) => {
  const host =
    (rawConfig.devServer && rawConfig.devServer.host) ||
    process.env.HOST ||
    argv.host ||
    ip.address() ||
    '0.0.0.0';
  const rawPort =
    (rawConfig.devServer && rawConfig.devServer.port) ||
    process.env.PORT ||
    argv.port ||
    '3000';
  return detect(rawPort)
    .then((port) => {
      if (String(rawPort) !== String(port)) {
        console.warn(chalk.yellow(`Port: ${rawPort} was occupied, try port: ${port}\n`));
      }
      const config = preset(
        'start',
        merge(
          {
            mode: 'development',
            devServer: {
              clientLogLevel: 'none',
              compress: false,
              disableHostCheck: true,
              historyApiFallback: false,
              hot: true,
              hotOnly: false,
              index: '',
              inline: true,
              noInfo: false, // 开启时会覆盖 quiet 的配置
              open: false,
              overlay: true,
              quiet: true,
              useLocalIp: false,
            },
          },
          rawConfig,
          {
            devServer: {
              host,
              port,
              public: `${host}:${port}`,
            },
          },
        ),
      );
      return merge(config, {
        devServer: {
          contentBase: config.devServer.contentBase || config.context,
          publicPath: config.output.publicPath,
        },
      });
    })
    .catch((err) => {
      console.error(chalk.red(err));
    });
};

const start = (rawConfig) => {
  makeConfig(rawConfig).then((config) => {
    const compiler = setupCompiler(config);
    const devServer = new WebpackDevServer(compiler, config.devServer);
    devServer.listen(config.devServer.port, (err) => {
      if (err) {
        console.error(chalk.red('Failed to compile.', [err]));
        process.exit(1);
      }
    });
  });
};

start(require(path.resolve(context, argv.config)));
