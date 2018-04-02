var chalk = require('chalk');
var parse = require('url-parse');
var express = require('express');
var proxy = require('http-proxy-middleware');
var WebpackDevServer = require('webpack-dev-server');

var WebpackDevConfig = require('../config/webpack.config.dev');

// var openBrowser = require('./openBrowser');
var dllPath = require('./dllPath');
var clearConsole = require('./clearConsole');
var setupCompiler = require('./setupCompiler');
var applyProxyModdileware = require('./applyProxyModdileware');

var isInteractive = process.stdout.isTTY;

function runDevServer(config) {
  var server = config.output.server;
  var protocol = server.protocol;
  var host = server.host;
  var port = server.port;
  var publicPath = parse(config.output.publicPath);
  var webpackConfig = WebpackDevConfig(config);
  var compiler = setupCompiler(webpackConfig, {
    host: host,
    port: port,
    protocol: protocol || 'http',
  });
  var devServer = new WebpackDevServer(compiler, Object.assign({
    disableHostCheck: true,
    contentBase: [
      config.context,
    ],
    compress: true,
    inline: true,
    hot: true,
    quiet: true,
    noInfo: true,
    clientLogLevel: 'none',
    watchContentBase: false,
    watchOptions: {
      ignored: /node_modules/
    },
    publicPath: config.output.publicPath,
    https: protocol === 'https',
    headers: {
      // fix CORS policy
      'Access-Control-Allow-Origin': '*',
    },
    host: host,
    port: port,
    overlay: true,
    historyApiFallback: false,
    after: function (app) {
      if (config.output.publicUrl) { // TODO
        // fix client proxy to webpack dev server not work problem
        // webpack dev server could not recognize wrong host
        app.use(proxy(function (pathname, req) {
          var parsedUrl = parse(req.url);
          var origin = parsedUrl.origin;
          return !(origin === 'null' || origin === config.output.publicUrl);
        }, { target: config.output.publicUrl }));
      }
      // server dll assets
      config.vendors.forEach(function (vendor) {
        var dll = dllPath(config.output.temp, vendor.name);
        app.use(publicPath.pathname, express.static(dll, {
          setHeaders: function (res) {
            // fix CORS policy
            res.header('Access-Control-Allow-Origin', '*');
          },
        }));
      });
    },
  }, webpackConfig.devServer));

  applyProxyModdileware(devServer, config);

  devServer.listen(port, function (err) {
    if (err) {
      console.log(err);
      return;
    }

    if (isInteractive) {
      clearConsole();
    }
    console.log(chalk.cyan('Starting the development server...'));
    console.log();

    // TODO
    // openBrowser(protocol + '://' + host + ':' + port + '/');
  });
}

module.exports = runDevServer;
