var argv = require('yargs').argv;
var chalk = require('chalk');
var WebpackDevServer = require('webpack-dev-server');
var clearConsole = require('react-dev-utils/clearConsole');

var WebpackDevConfig = require('./config/webpack.config.dev');
var setupCompiler = require('./utils/setupCompiler');
var runWithPortCheck = require('./utils/runWithPortCheck');
var dll = require('./dll');

var isInteractive = process.stdout.isTTY;
var DEFAULT_PROTOCOL = process.env.HTTPS === 'true' ? "https" : "http";
var DEFAULT_HOST = argv.host || process.env.HOST || 'localhost';
var DEFAULT_PORT = argv.port || process.env.PORT || 3000;

function runDevServer(compiler, config, address) {
  var protocol = address.protocol;
  var host = address.host;
  var port = address.port;
  var devServer = new WebpackDevServer(compiler, {
    // Enable gzip compression of generated files.
    compress: true,

    // Silence WebpackDevServer's own logs since they're generally not useful.
    // It will still show compile warnings and errors with this setting.
    clientLogLevel: 'none',

    // Set this as true if you want to access dev server from arbitrary url.
    // This is handy if you are using a html5 router.
    historyApiFallback: true,

    // By default WebpackDevServer serves physical files from current directory
    // in addition to all the virtual build products that it serves from memory.
    // This is confusing because those files won’t automatically be available in
    // production build folder unless we copy them. However, copying the whole
    // project directory is dangerous because we may expose sensitive files.
    // Instead, we establish a convention that only files in `public` directory
    // get served. Our build script will copy `public` into the `build` folder.
    // In `index.html`, you can get URL of `public` folder with %PUBLIC_PATH%:
    // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
    // In JavaScript code, you can access it with `process.env.PUBLIC_URL`.
    // Note that we only recommend to use `public` folder as an escape hatch
    // for files like `favicon.ico`, `manifest.json`, and libraries that are
    // for some reason broken when imported through Webpack. If you just want to
    // use an image, put it in `src` and `import` it from JavaScript instead.
    // contentBase: paths.appPublic,`

    // Enable hot reloading server. It will provide /sockjs-node/ endpoint
    // for the WebpackDevServer client so it can learn when the files were
    // updated. The WebpackDevServer client is included as an entry point
    // in the Webpack development configuration. Note that only changes
    // to CSS are currently hot reloaded. JS changes will refresh the browser.
    hot: true,

    // It is important to tell WebpackDevServer to use the same "root" path
    // as we specified in the config. In development, we always serve from /.
    publicPath: config.output.publicPath,

    // WebpackDevServer is noisy by default so we emit custom message instead
    // by listening to the compiler events with `compiler.plugin` calls above.
    quiet: true,

    // Reportedly, this avoids CPU overload on some systems.
    // https://github.com/facebookincubator/create-react-app/issues/293
    watchOptions: {
      ignored: /node_modules/
    },

    // Enable HTTPS if the HTTPS environment variable is set to 'true'
    https: protocol === "https",

    stats: { colors: true },
  });

  // Launch WebpackDevServer.
  devServer.listen(port, host, (err, result) => {
    if (err) {
      return console.log(err);
    }

    if (isInteractive) {
      clearConsole();
    }
    console.log(chalk.cyan('Starting the development server...'));
    console.log();
  });
}

function getDefaultConfig(config) {
  // TODO generate default config if not config
  return config;
}

/**
 * start webpack dev server
 *
 * @param {object} cfg
 * @param {object} cfg.paths
 * @param {object} cfg.dll
 * @param {object} cfg.webpack
 */
function start(cfg) {
  var config = getDefaultConfig(cfg);
  dll.build(config.paths, config.dll, function () {
    var serverConfig = dll.setup(
      WebpackDevConfig(config.paths, config.webpack),
      config.paths,
      config.dll.name
    );
    runWithPortCheck(DEFAULT_PORT, function (port) {
      var serverAddress = {
        protocol: DEFAULT_PROTOCOL,
        host: DEFAULT_HOST,
        port,
      };
      var compiler = setupCompiler(serverConfig, serverAddress);
      runDevServer(compiler, serverConfig, serverAddress);
    });
  });
}

module.exports = start;
