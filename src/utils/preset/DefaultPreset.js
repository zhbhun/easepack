const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const webpack = require('webpack');
const readPkg = require('read-pkg');
const merge = require('webpack-merge');
const autoprefixer = require('autoprefixer');
const AutoDllPlugin = require('autodll-webpack4-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

const filenames = {
  production: {
    js: '[name].[contenthash:8].js',
    css: '[name].[contenthash:8].css',
    media: '[name].[hash:8].[ext]',
    manifest: '[name].manifest.json',
    library: '[name]_library',
    html: '[name].html'
  },
  development: {
    js: '[name].js',
    css: '[name].css',
    media: '[name].[hash:8].[ext]',
    manifest: '[name].manifest.json',
    library: '[name]_library',
    html: '[name].html'
  }
};

/**
 *
 * @param {object} options
 * @param {string} options.mode 构建模式: development|production
 * @param {string} options.context 项目根目录
 * @param {string|object} options.input 输入配置(支持 html)
 * @param {boolean|string|array|object} options.vendors 构建缓存(推荐在开发环境使用，生产环境请使用 splitChunks 来拆包): false|不启用;true|读取 package.json 的 dependencies;string|array|object|参考 webpack 的 entry
 * @param {string} options.outputPath 输入路径
 * @param {string} options.publicPath 服务路径
 * @param {object} options.filename 文件命名
 * @param {string} options.filename.js
 * @param {string} options.filename.css
 * @param {string} options.filename.media
 * @param {string} options.filename.manifest
 * @param {string} options.filename.library
 * @param {string} options.filename.html
 * @param {object} options.targets 兼容性
 * @param {array} options.targets.browsers
 * @param {string} options.targets.node
 * @param {object} options.env 环境配置
 * @param {object} options.env.production
 * @param {object} options.env.development
 */
function DefaultPreset(options = {}, raw = {}){
  // config
  const allOptions = merge.strategy({
    input: 'replace',
    targets: 'replace'
  })(options, options.env && options.env[options.mode]);
  const {
    mode = 'production',
    context = fs.realpathSync(process.cwd()),
    input = './src/index.js',
    vendors = false
  } = allOptions;
  const {
    outputPath = './dist',
    publicPath = '/',
    filename = filenames[mode],
    targets = { browsers: ['last 2 versions', 'safari >= 7'] }
  } = allOptions;
  const production = mode === 'production';
  const fullPublicPath = production || /^(https?:)?\/\//.test(publicPath) ?
    publicPath :
    ((raw.devServer && `http://${raw.devServer.host}:${raw.devServer.port}${publicPath}`) || '/');

  // input
  const { entry, plugins: htmlPlugins } = (() => {
    const namedInput = typeof input === 'object' ? input : { index: input };
    return Object
      .keys(namedInput)
      .reduce((result, key) => {
        const filePath = path.resolve(context, namedInput[key]);
        if (/\.html$/.test(filePath)) {
          const html = fs.readFileSync(filePath, { encoding: 'utf-8' });
          result.entry[key] = path.resolve(path.dirname(filePath), html.match(/<script.*src="(.*)"><\/script>/)[1]);
          result.plugins.push(new HtmlWebpackPlugin({
            inject: true,
            chunksSortMode: 'dependency',
            template: filePath,
            filename: filename.html.replace('[name]', key),
            chunks: [key],
            hash: !production
          }))
        } else {
          result.entry[key] = filePath;
        }
        return result;
      }, { entry: {}, plugins: [] });
  })();

  // config
  this.config = {
    mode,
    cache: !production,
    context,
    entry,
    output: {
      path: path.resolve(context, outputPath),
      pathinfo: true,
      publicPath: fullPublicPath,
      filename: filename.js,
      chunkFilename: filename.js
    },
    resolve: {
      extensions: production ? ['.js', '.json', '.prod.js'] : ['.js', '.json', '.dev.js']
    },
    module: {
      html$pre: {
        enforce: 'pre',
        test: /\.html$/,
        use: require.resolve('../html-loader/index.js')
      },
      html: {
        test: /\.html$/,
        use: {
          loader: 'html-loader',
          options: {
            ignoreCustomFragments: [/\{\{.*?}}/],
            attrs: ['img:src', 'link:href']
          }
        }
      },
      eslint: {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'eslint-loader'
      },
      js: {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            // This is a feature of `babel-loader` for Webpack (not Babel itself).
            // It enables caching results in ./node_modules/.cache/babel-loader/
            // directory for faster rebuilds.
            cacheDirectory: true,
            presets: [
              [
                'env',
                {
                  modules: false,
                  targets,
                }
              ],
              'stage-2'
            ],
            plugins: ['transform-runtime'].concat(
              production ? ['lodash'] : []
            )
          }
        }
      },
      less: {
        enforce: 'pre',
        test: /\.less$/,
        use: {
          loader: 'less-loader',
          options: { sourceMap: true }
        }
      },
      scss: {
        enforce: 'pre',
        test: /\.scss$/,
        use: [
          { loader: 'resolve-url-loader' },
          {
            loader: 'sass-loader',
            options: { sourceMap: true }
          }
        ]
      },
      css: {
        test: /\.css$|\.less$|\.scss$/,
        use: [
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              minimize: production,
              sourceMap: !production
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              // https://webpack.js.org/guides/migrating/#complex-options
              ident: 'postcss',
              plugins: function() {
                return [
                  // stylelint(), // TODO
                  autoprefixer({ browsers: targets.browsers })
                ];
              },
              sourceMap: !production
            }
          }
        ]
      },
      css$post: {
        test: /\.css$|\.less$|\.scss$/,
        enforce: 'post',
        use: production ? MiniCssExtractPlugin.loader : 'style-loader'
      },
      ejs: {
        test: /\.ejs$/,
        use: [
          {
            loader: 'ejs-compiled-loader'
          },
          {
            loader: 'extract-loader'
          },
          {
            loader: 'html-loader',
            options: {
              ignoreCustomFragments: [/\{\{.*?}}/],
              attrs: ['img:src', 'link:href']
            }
          }
        ]
      },
      media: {
        exclude: [
          /\.html$/,
          /\.ejs$/,
          /\.js$/,
          /\.css$/,
          /\.scss$/,
          /\.json$/,
          /\.svg$/
        ],
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 5120,
              publicPath: publicPath,
              name: filename.media
            }
          }
        ]
      }
    },
    plugins: [
      new ProgressBarPlugin(),
      new CaseSensitivePathsPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      ...htmlPlugins,
      ...(production
        ? [
            new webpack.HashedModuleIdsPlugin(),
            new LodashModuleReplacementPlugin(), // DeprecationWarning: Tapable.plugin is deprecated. Use new API on `.hooks` instead. @see https://github.com/webpack/webpack/issues/6568
            new MiniCssExtractPlugin({
              // Options similar to the same options in webpackOptions.output
              // both options are optional
              filename: filename.css,
              chunkFilename: filename.css
            })
          ]
        : []),
    ],
    optimization: {
      minimizer: production ? [
        new UglifyJsPlugin({
          uglifyOptions: {
            parse: {
              // we want uglify-js to parse ecma 8 code. However, we don't want it
              // to apply any minfication steps that turns valid ecma 5 code
              // into invalid ecma 5 code. This is why the 'compress' and 'output'
              // sections only apply transformations that are ecma 5 safe
              // https://github.com/facebook/create-react-app/pull/4234
              ecma: 8,
            },
            compress: {
              ecma: 5,
              warnings: false,
              // Disabled because of an issue with Uglify breaking seemingly valid code:
              // https://github.com/facebook/create-react-app/issues/2376
              // Pending further investigation:
              // https://github.com/mishoo/UglifyJS2/issues/2011
              comparisons: false,
            },
            mangle: {
              safari10: true,
            },
            output: {
              ecma: 5,
              comments: false,
              // Turned on because emoji and regex is not minified properly using default
              // https://github.com/facebook/create-react-app/issues/2488
              ascii_only: true,
            }
          },
          // Use multi-process parallel running to improve the build speed
          // Default number of concurrent runs: os.cpus().length - 1
          parallel: true,
          // Enable file caching
          cache: true,
          sourceMap: production,
        }),
        new OptimizeCSSAssetsPlugin({})
      ] : undefined
    }
  };

  // vendors
  if (vendors) {
    let vendorsEntry = {};
    if (vendors === true) {
      const pkg = readPkg.sync(context);
      vendorsEntry = { vendors: Object.keys(pkg.dependencies) };
    } else if (Array.isArray(vendors) || typeof vendros === 'string') {
      vendorsEntry = { vendors };
    } else {
      vendorsEntry = vendors;
    }
    this.config = merge.strategy({ plugins: 'prepend' })(this.config, {
      plugins: [
        new AutoDllPlugin({
          debug: true,
          inject: true,
          inherit: true,
          context,
          entry: vendorsEntry,
          filename: filename.js,
          library: filename.library,
          config: {
            plugins: [
              new ProgressBarPlugin(),
              new CaseSensitivePathsPlugin(),
              new webpack.NoEmitOnErrorsPlugin(),
              ...(production
                ? [
                    new webpack.HashedModuleIdsPlugin(),
                    new LodashModuleReplacementPlugin(), // DeprecationWarning: Tapable.plugin is deprecated. Use new API on `.hooks` instead. @see https://github.com/webpack/webpack/issues/6568
                    new MiniCssExtractPlugin({
                      // Options similar to the same options in webpackOptions.output
                      // both options are optional
                      filename: filename.css,
                      chunkFilename: filename.css
                    })
                  ]
                : []),
            ],
            optimization: {
              minimizer: production ? [
                new UglifyJsPlugin({
                  uglifyOptions: {
                    parse: {
                      // we want uglify-js to parse ecma 8 code. However, we don't want it
                      // to apply any minfication steps that turns valid ecma 5 code
                      // into invalid ecma 5 code. This is why the 'compress' and 'output'
                      // sections only apply transformations that are ecma 5 safe
                      // https://github.com/facebook/create-react-app/pull/4234
                      ecma: 8,
                    },
                    compress: {
                      ecma: 5,
                      warnings: false,
                      // Disabled because of an issue with Uglify breaking seemingly valid code:
                      // https://github.com/facebook/create-react-app/issues/2376
                      // Pending further investigation:
                      // https://github.com/mishoo/UglifyJS2/issues/2011
                      comparisons: false,
                    },
                    mangle: {
                      safari10: true,
                    },
                    output: {
                      ecma: 5,
                      comments: false,
                      // Turned on because emoji and regex is not minified properly using default
                      // https://github.com/facebook/create-react-app/issues/2488
                      ascii_only: true,
                    }
                  },
                  // Use multi-process parallel running to improve the build speed
                  // Default number of concurrent runs: os.cpus().length - 1
                  parallel: true,
                  // Enable file caching
                  cache: true,
                  sourceMap: production,
                }),
                new OptimizeCSSAssetsPlugin({})
              ] : undefined
            }
          }
        })
      ]
    });
  }
}

DefaultPreset.prototype.update = function (path, updater) {
  _.update(this.config, path, updater);
};

DefaultPreset.prototype.export = function () {
  return Object.assign({}, this.config, {
    module: {
      rules: Object.keys(this.config.module).reduce((rules, key) => {
        const item = this.config.module[key];
        return rules.concat(Array.isArray(item) ? item : [item]);
      }, [])
    }
  });
};

module.exports = DefaultPreset;
