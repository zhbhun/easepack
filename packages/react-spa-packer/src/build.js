var path = require('path');
var chalk = require('chalk');
var rimraf = require('rimraf');
var webpack = require('webpack');

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
  let regExp = null;
  let exceptionRegExps = null;
  if (dependencies === Infinity) {
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

    // TODO test not js module
    if (userRequest.indexOf(paths.source.srcPath) >= 0) {
      return false;
    } else if (exceptionRegExps && exceptionRegExps.test(userRequest)) {
      return false;
    } else {
      // if (userRequest.indexOf('/src/libraries/react-editor') >= 0) {
      //   console.log(userRequest, regExp, regExp.test(userRequest));
      // }
      // if (userRequest.indexOf('!') >= 0) {
      //   console.log(userRequest);
      // }
      return regExp.test(userRequest);
    }
  }
}

function addVendors(paths, splits) {
  var alias = {};
  var rules = [];
  var plugins = [];
  if (splits) {
    var { dependencies } = splits;
    var splitsConfig = {};
    dependencies.forEach(function (dependency) {
      var modules = splits[dependency];
      if (typeof modules === 'string') {
        var pkg = require(path.resolve(modules, 'package.json'));
        var { async, vendors = []} = pkg;
        splitsConfig[dependency] = {
          async: async,
          entry: modules,
          modules: vendors,
        };
      } else {
        splitsConfig[dependency] = {
          async: false,
          modules,
        };
      }
    });
    dependencies.forEach(function (dependency, index) {
      var { async, entry, modules } = splitsConfig[dependency];
      if (async) {
        alias[dependency] = entry;
        rules.push({
          enforce: 'post',
          test: /\.(js|jsx)$/,
          include: entry,
          use: `bundle-loader?name=${dependency}`,
        });
      } else {
        var chunks = dependencies.slice(index + 1);
        let exceptions = [];
        chunks.forEach(function (chunk, j) {
          exceptions = exceptions.concat(splitsConfig[chunk].modules);
        });
        plugins.unshift(
          new webpack.optimize.CommonsChunkPlugin({
            name: dependency,
            chunks: ['main'].concat(chunks),
            minChunks: createVendorPicker(modules, exceptions, paths),
          })
        );
      }
    });
  }
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
  // TODO generate default config if not config
  return config;
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
