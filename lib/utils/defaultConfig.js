var fs = require('fs');
var ip = require('ip');
var path = require('path');
var osTmpdir = require('os-tmpdir');
var revHash = require('rev-hash');

var defaultContext = fs.realpathSync(process.cwd());
var defaultPath = 'build';
var defaultDevServer = {
  protocol: '',
  host: ip.address() || '0.0.0.0',
  port: '3000',
  path: '/',
};
var defaultProdServer = {
  protocol: undefined,
  host: undefined,
  port: undefined,
  path: '/',
}
var developmentFilenames = {
  js: '[name].js',
  css: '[name].css',
  media: '[name].[hash:8].[ext]',
  manifest: '[name].manifest.json',
  library: '[name]_library',
  html: '[name].html',
};
var productionFilenames = {
  js: '[name].[chunkhash:8].js',
  css: '[name].[contenthash:8].css',
  media: '[name].[hash:8].[ext]',
  manifest: '[name].manifest.json',
  library: '[name]_library',
  html: '[name].html',
};
var defaultTargets = {
  browsers: [
    'ie >= 9',
    'since 2014',
  ],
};

function ensureSlash(path) {
  var result = path.trim();
  if (result.substring(0, 1) !== '/') {
    result = '/' + result;
  }
  if (result.substring(result.length - 1, result.length) !== '/') {
    result = result + '/';
  }
  return result;
}

/**
 * 处理配置文件
 *
 */
function defaultConfig(config) {
  var isDev = process.env.NODE_ENV === 'development';
  var defaultServer = isDev ? defaultDevServer : defaultProdServer;
  var defaultFilenames = isDev ? developmentFilenames : productionFilenames;
  // mix default config
  var context = config.context || defaultContext;
  var input = Array.isArray(config.input) ? config.input : [config.input];
  var vendors = config.vendors;
  var output = config.output || {};
  var server = Object.assign({}, defaultServer, (isDev ? output.devServer : output.prodServer));
  var hostname = '';
  if (server.host && server.host !== '0.0.0.0') {
    hostname = server.host + (server.port ? (':' + server.port) : '');
  }
  var publicUrl = hostname ? ((server.protocol ? (server.protocol + '://') : 'http://') + hostname) : ''; // 用于服务器地址
  var publicPath = hostname ? ((server.protocol ? (server.protocol + '://') : '//') + hostname + ensureSlash(server.path)) : '/'; // 用于静态资源地址
  var packageJSON = null;
  var packagePath = path.resolve(context, 'package.json');
  if (fs.existsSync(packagePath)) {
    packageJSON = require(packagePath);
  }
  // resolve default chunks
  if (typeof vendors === 'string') {
      vendors = [{
        name: vendors,
        dependencies: Object.keys(packageJSON.dependencies),
      }];
  }
  return Object.assign({}, config, {
    context: context,
    input: input.map(function (item) {
      return {
        name: item.name,
        html: item.html ? path.resolve(context, item.html) : undefined,
        script: path.resolve(context, item.script),
      };
    }),
    vendors: vendors || [],
    output: {
      temp: path.resolve(osTmpdir(), (packageJSON.name || '') + '.' + revHash(context)),
      path: path.resolve(context, output.path || defaultPath),
      publicUrl: publicUrl,
      publicPath: publicPath,
      server: server,
      filenames: Object.assign({}, defaultFilenames, output.filenames),
    },
    targets: config.targets || defaultTargets,
  });
}

module.exports = defaultConfig;
