var path = require('path');
var chalk = require('chalk');
var rimraf = require('rimraf');
var webpack = require('webpack');

var paths = require('./config/paths');
var setupCompiler = require('./utils/setupCompiler');
var WebpackProdConfig = require('./config/webpack.config.prod');

// Print out errors
function printErrors(summary, errors) {
  console.log(chalk.red(summary));
  console.log();
  errors.forEach(err => {
    console.log(err.message || err);
    console.log();
  });
}

function createVendorPicker(dependencies, exceptions, paths) {
  var regExp = null;
  var exceptionRegExps = null;
  var isBaseChunk = dependencies === Infinity;
  if (isBaseChunk) {
    // base chunk
    regExp = /node_modules/;
    if (exceptions && exceptions.length > 0) {
      exceptionRegExps = new RegExp(`node_modules/(${exceptions.join('|')})($|/)`);
    }
  } else {
    regExp = new RegExp(`node_modules/(${dependencies.join('|')})($|\/)`);
  }
  return function isExternal(module) {
    var userRequest = module.userRequest;

    if (typeof userRequest !== 'string') {
      return false;
    }

    if (isBaseChunk && userRequest.indexOf(paths.source.srcPath) >= 0) {
      return false;
    } else if (exceptionRegExps && exceptionRegExps.test(userRequest)) {
      return false;
    } else {
      return regExp.test(userRequest);
    }
  }
}

/**
 *
 * @param {Object} paths @see ./config/paths
 * @param {Array} chunks [{ name: string, dependencies: string[] }, ...]
 * @returns
 */
function addVendors(paths, chunks) {
  var alias = {};
  var rules = [];
  var plugins = [];
  var allChunks = [{
    async: false,
    name: 'base',
    dependencies: Infinity,

  }].concat(chunks || []);
  var chunksName = [];
  var chunksConfig = {};
  allChunks.forEach(function (item) {
    var name = item.name;
    chunksName.push(name);
    var dependencies = item.dependencies;
    if (typeof dependencies === 'string') {
      // project source module
      var pkg = require(path.resolve(dependencies, 'package.json'));
      chunksConfig[name] = {
        async: pkg.async,
        entry: dependencies,
        modules: pkg.vendors || [],
      };
    } else {
      // vendor module
      chunksConfig[name] = {
        async: false,
        modules: dependencies,
      };
    }
  });
  chunksName.forEach(function (name, index) {
    var chunkConfig = chunksConfig[name];
    if (chunkConfig.async) {
      // async chunk
      alias[name] = chunkConfig.entry;
      rules.push({
        enforce: 'post',
        test: /\.(js|jsx)$/,
        include: chunkConfig.entry,
        use: `bundle-loader?name=${name}`,
      });
    } else {
      // common chunk
      var extractChunks = chunksName.slice(index + 1);
      var exceptionModules = [];
      extractChunks.forEach(function (name, j) {
        exceptionModules = exceptionModules.concat(chunksConfig[name].modules);
      });
      plugins.unshift(
        new webpack.optimize.CommonsChunkPlugin({
          name: name,
          chunks: ['main'].concat(extractChunks),
          minChunks: createVendorPicker(chunkConfig.modules, exceptionModules, paths),
        })
      );
    }
  });
  return {
    resolve: {
      alias,
    },
    module: {
      rules,
    },
    plugins,
  };
}

function getDefaultConfig(config) {
  var context = config.context;
  var source = config.source;
  var output = config.output;
  var pathsConfig = paths({ context, source, output });
  return Object.assign({}, config, {
    paths: pathsConfig,
  });
}

/**
 * start webpack dev server
 *
 * @param {object} cfg
 * @param {object} cfg.paths
 * @param {object} cfg.chunks
 * @param {object} cfg.webpack
 */
function build(cfg) {
  var config = getDefaultConfig(cfg);

  rimraf(config.paths.output.path.build, function (er) {
    if (er) {
      console.log(er);
      process.exit(1);
    }
  });

  var webpackConfig = WebpackProdConfig(
    config.paths,
    addVendors(config.paths, config.chunks)
  );
  setupCompiler(webpackConfig)
    .run((err, stats) => {
      if (err) {
        printErrors('Failed to compile.', [err]);
        process.exit(1);
      }

      if (stats.compilation.errors.length) {
        printErrors('Failed to compile.', stats.compilation.errors);
        process.exit(1);
      }

      if (process.env.CI && stats.compilation.warnings.length) {
        printErrors('Failed to compile.', stats.compilation.warnings);
        process.exit(1);
      }
    });
}

module.exports = build;
