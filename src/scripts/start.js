// Do this as the first thing so that any code reading it knows the right env.
const process = require('process');
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const ip = require('ip');
const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const yargs = require('yargs');
const chalk = require('chalk');
const webpack = require('webpack');
const detect = require('detect-port');
const merge = require('webpack-merge');
const WebpackDevServer = require('webpack-dev-server');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

const preset = require('../utils/preset');
const entryInject = require('../utils/entry-inject');
const QRCodePlugin = require('../utils/qrcode-webpack-plugin');

const argv = yargs.argv;
const context = fs.realpathSync(process.cwd());

const makeConfig = (rawConfig) => {
  const rawPort = rawConfig.devServer && rawConfig.devServer.port;
  return detect(rawPort || 3000)
    .then((port) => {
      if (rawPort && rawPort !== port) {
        console.warn(chalk.yellow(`Port: ${rawPort} was occupied, try port: ${port}\n`));
      }
      const config = preset(merge(
        {
          mode: 'development',
          devServer: {
            clientLogLevel: 'none',
            compress: false,
            disableHostCheck: true,
            historyApiFallback: false,
            host: ip.address() || '0.0.0.0',
            hot: true,
            hotOnly: false,
            index: '',
            inline: true,
            noInfo: false, // 开启时会覆盖 quiet 的配置
            open: false,
            overlay: true,
            port,
            quiet: true,
            useLocalIp: false,
          }
        },
        rawConfig
      ));
      const server = `http://${config.devServer.host}:${port}`;
      const indexURL = `${server}/${config.devServer.index}`;
      entryInject(config, [
        'webpack-dev-server/client?' + server,
        'webpack/hot/dev-server',
      ]);
      return merge(config, {
        plugins: [
          new FriendlyErrorsPlugin({
            compilationSuccessInfo: {
              messages: [`You application is running here ${indexURL}`],
            },
            clearConsole: true
          }),
          new QRCodePlugin(indexURL),
          new webpack.HotModuleReplacementPlugin()
        ],
        devServer: {
          port,
          public: server,
          contentBase: config.context,
          publicPath: config.output.publicPath,
        }
      });
    })
    .catch(err => {
      console.error(chalk.red(err));
    });
}

const start = (rawConfig) => {
  makeConfig(rawConfig)
    .then((config) => {
      let compiler = null;
      try {
        compiler = webpack(config);
      } catch (err) {
        console.error(chalk.red('Failed to compile.'), '\n');
        console.error(err.message || err, '\n');
        process.exit(1);
      }

      const devServer = new WebpackDevServer(compiler, config.devServer);
      devServer.listen(config.devServer.port, function (err) {
        if (err) {
          console.error(chalk.red('Failed to compile.', [err]));
          process.exit(1);
        }
      });
    })
}

start(require(path.resolve(context, argv.config)));
