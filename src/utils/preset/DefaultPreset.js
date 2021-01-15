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
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
// const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const QRCodePlugin = require('../qrcode-webpack-plugin');

const mergeOption = merge.strategy({
  input: 'replace',
  targets: 'replace',
});

class DefaultPreset {
  /**
   *
   * @param {string} command start|watch|build
   * @param {object} options
   * @param {string} options.mode development|production
   * @param {string} options.context project root
   * @param {string|object} options.input webpack entry(support html)
   * @param {boolean|string|array|object} options.vendors build cache by dll:
   *  - false: disable
   *  - true: enable(auto use dependencies)
   *  - string|array|object: webpack.entry
   * @param {string} options.outputPath output path
   * @param {string} options.publicPath server path
   * @param {object} options.filename bundle filename
   * @param {string} options.filename.js
   * @param {string} options.filename.css
   * @param {string} options.filename.media
   * @param {string} options.filename.manifest
   * @param {string} options.filename.library
   * @param {string} options.filename.html
   * @param {object} options.targets compatibility
   * @param {array} options.targets.browsers
   * @param {string} options.targets.node
   * @param {object} options.env environment options
   * @param {object} options.env.production
   * @param {object} options.env.development
   * @param {boolean} options.hot enable hot relaod
   * @param {string} options.sourceMap enable source map
   * @param {boolean} options.analyzer bundle analyzer
   * @param {number} options.dataURLLimit Byte limit to inline files as Data URL
   * @param {number} options.cssModules
   * @param {boolean} options.babelRuntime enable babel runtime
   * @param {boolean} options.noEmitOnErrors disable emit while errors
   * @param {object} raw @see https://webpack.js.org/configuration
   */
  constructor(command, options = {}, raw = {}) {
    this.raw = raw;
    this.mode = raw.mode || options.mode || this.getDefaultMode(command);
    this.command = command;
    this.options = mergeOption(
      mergeOption(this.getDefaultOptions(this.mode, this.command), options),
      options.env && options.env[this.mode],
    );
    this.config = this.makeConfig();
  }

  getDefaultMode = command =>
    (command === 'build' ? 'production' : 'development');

  getDefaultFilenames = () => ({
    production: {
      js: '[name].[contenthash:8].js',
      css: '[name].[contenthash:8].css',
      media: '[name].[hash:8].[ext]',
      manifest: '[name].manifest.json',
      library: '[name]_library',
      html: '[name].html',
    },
    development: {
      js: '[name].[hash:8].js',
      css: '[name].[hash:8].css',
      media: '[name].[hash:8].[ext]',
      manifest: '[name].manifest.json',
      library: '[name]_library',
      html: '[name].html',
    },
  });

  getDefaultOptions = (mode, command) => {
    const production = mode === 'production';
    return {
      mode,
      context: fs.realpathSync(process.cwd()),
      input: './src/index.js',
      vendors: false,
      outputPath: './dist',
      publicPath: '/',
      filename: this.getDefaultFilenames()[mode],
      targets: { browsers: ['last 2 versions', 'safari >= 7'] },
      hot: command === 'start',
      sourceMap: production ? false : 'eval',
      analyzer: !!production,
      dataURLLimit: production ? 5120 : 1,
      cssModules: false,
      babelRuntime: true,
      noEmitOnErrors: true,
    };
  };

  isProduction = () => this.mode === 'production';

  makeConfig = () => {
    const {
      raw, command, mode, options,
    } = this;
    const {
      context,
      input,
      outputPath,
      publicPath,
      filename,
      targets,
      hot,
      sourceMap,
      dataURLLimit,
      cssModules,
    } = options;
    const production = this.isProduction();
    const fullPublicPath =
      command === 'start' && raw.devServer.public
        ? `http://${raw.devServer.public}${publicPath}`
        : publicPath;

    // input
    const { entry, plugins: htmlPlugins } = (() => {
      const namedInput = typeof input === 'object' ? input : { index: input };
      const namedInputKeys = Object.keys(namedInput);
      return namedInputKeys.reduce(
        (result, key) => {
          const value = namedInput[key];
          if (/\.html$/.test(value)) {
            const filePath = path.resolve(context, value);
            const html = fs.readFileSync(filePath, { encoding: 'utf-8' });
            result.entry[key] = path.resolve(
              path.dirname(filePath),
              html.match(/<script.*src="(.*)"><\/script>/)[1],
            );
            result.plugins.push(new HtmlWebpackPlugin({
              inject: true,
              chunksSortMode: 'dependency',
              template: filePath,
              filename: filename.html.replace('[name]', key),
              // chunks: [key],
              excludeChunks: namedInputKeys.filter(item => item !== key),
              hash: false,
            }));
          } else {
            result.entry[key] = value;
          }
          result.entry[key] = Array.isArray(result.entry[key])
            ? result.entry[key]
            : [result.entry[key]];
          if (command === 'start') {
            result.entry[key].unshift(`webpack-dev-server/client?http://${raw.devServer.public}`);
            if (hot) {
              result.entry[key].unshift('webpack/hot/dev-server');
            }
          }
          return result;
        },
        { entry: {}, plugins: [] },
      );
    })();

    return {
      mode,
      cache: !production,
      context,
      entry,
      output: {
        path: path.resolve(context, outputPath),
        pathinfo: true,
        publicPath: fullPublicPath,
        filename: filename.js,
        chunkFilename: filename.js,
      },
      resolve: {
        extensions: production
          ? ['.es', '.js', '.json', '.prod.js']
          : ['.es', '.js', '.json', '.dev.js'],
      },
      module: {
        html$pre: {
          enforce: 'pre',
          test: /\.html$/,
          use: require.resolve('../html-loader/index.js'),
        },
        html: {
          test: /\.html$/,
          use: {
            loader: 'html-loader',
            options: {
              ignoreCustomFragments: [/\{\{.*?}}/],
              attrs: ['img:src', 'link:href'],
            },
          },
        },
        eslint: {
          enforce: 'pre',
          test: /\.js$|\.es$/,
          exclude: /node_modules/,
          use: {
            loader: 'eslint-loader',
            options: {
              fix: false,
              cache: true,
            },
          },
        },
        js: {
          test: /\.js$|\.es$/,
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
                  },
                ],
                'stage-2',
              ],
              plugins: (options.babelRuntime
                ? ['transform-runtime']
                : []
              ).concat(production ? ['lodash'] : []),
            },
          },
        },
        less: {
          enforce: 'pre',
          test: /\.less$/,
          use: {
            loader: 'less-loader',
            options: { sourceMap: !!sourceMap },
          },
        },
        scss: {
          enforce: 'pre',
          test: /\.scss$/,
          use: [
            { loader: 'resolve-url-loader' },
            {
              loader: 'sass-loader',
              options: { sourceMap: !!sourceMap },
            },
          ],
        },
        css: {
          test: /\.css$|\.less$|\.scss$/,
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                minimize: production,
                modules: cssModules,
                localIdentName: production ? '[hash:base64:5]' : '[name]-[local]-[hash:base64:5]',
                sourceMap: !production,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                // https://webpack.js.org/guides/migrating/#complex-options
                ident: 'postcss',
                plugins() {
                  return [
                    // stylelint(), // TODO
                    autoprefixer({ browsers: targets.browsers }),
                  ];
                },
                sourceMap: !!sourceMap,
              },
            },
          ],
        },
        css$post: {
          test: /\.css$|\.less$|\.scss$/,
          enforce: 'post',
          use: production ? MiniCssExtractPlugin.loader : 'style-loader',
        },
        ejs: {
          test: /\.ejs$/,
          use: [
            {
              loader: 'ejs-compiled-loader-webpack4',
            },
            {
              loader: 'extract-loader',
            },
            {
              loader: 'html-loader',
              options: {
                ignoreCustomFragments: [/\{\{.*?}}/],
                attrs: ['img:src', 'link:href'],
              },
            },
          ],
        },
        media: {
          exclude: [
            /\.html$/,
            /\.ejs$/,
            /\.es$/,
            /\.js$/,
            /\.css$/,
            /\.scss$/,
            /\.json$/,
            /\.svg$/,
          ],
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: dataURLLimit,
                publicPath: fullPublicPath,
                name: filename.media,
              },
            },
          ],
        },
      },
      plugins: [
        ...this.makeCommonPlugins(),
        ...this.makeModePlugins(),
        ...this.makeCommandPlugins(),
        ...this.makeAnalyzerPlugins(),
        ...this.makeVendorPlugins(),
        ...htmlPlugins,
      ],
      optimization: {
        minimizer: this.makeMinimizerPlugins(),
      },
    };
  };

  makeCommonPlugins = () =>
    [
      new ProgressBarPlugin(),
      new CaseSensitivePathsPlugin(),
    ].concat(this.options.noEmitOnErrors ? [new webpack.NoEmitOnErrorsPlugin()] : []);

  makeModePlugins = () => {
    const production = this.isProduction();
    const { filename } = this.options;
    return production
      ? [
        new webpack.HashedModuleIdsPlugin(),
        new LodashModuleReplacementPlugin(),
        new MiniCssExtractPlugin({
          filename: filename.css,
          chunkFilename: filename.css,
        }),
      ]
      : [];
  };

  makeCommandPlugins = () => {
    const { raw, command, options } = this;
    const { context, outputPath } = options;
    switch (command) {
      case 'build':
        return [
          new FriendlyErrorsPlugin({ clearConsole: false }),
          new CleanWebpackPlugin(outputPath, {
            root: context,
            verbose: false,
          }),
        ];
      case 'start': {
        const index = `http://${raw.devServer.public}/${raw.devServer.index}`;
        return [
          new FriendlyErrorsPlugin({
            compilationSuccessInfo: {
              messages: [`You application is running here ${index}`],
            },
            clearConsole: true,
          }),
          new QRCodePlugin(index),
          ...(options.hot ? [new webpack.HotModuleReplacementPlugin()] : []),
        ];
      }
      default:
        return [];
    }
  };

  makeAnalyzerPlugins = () => {
    const { analyzer } = this.options;
    return analyzer
      ? [
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
          logLevel: 'silent',
        }),
      ]
      : [];
  };

  makeMinimizerPlugins = () => {
    const production = this.isProduction();
    const { sourceMap } = this.options;
    return production
      ? [
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
            },
          },
          // Use multi-process parallel running to improve the build speed
          // Default number of concurrent runs: os.cpus().length - 1
          parallel: true,
          // Enable file caching
          cache: true,
          sourceMap: !!sourceMap,
        }),
        // new OptimizeCSSAssetsPlugin({}),
      ]
      : undefined;
  };

  makeVendorPlugins = () => {
    const { context, vendors, filename } = this.options;
    if (!vendors) return [];
    let vendorsEntry = {};
    if (vendors === true) {
      const pkg = readPkg.sync(context);
      vendorsEntry = { vendors: Object.keys(pkg.dependencies) };
    } else if (Array.isArray(vendors) || typeof vendros === 'string') {
      vendorsEntry = { vendors };
    } else {
      vendorsEntry = vendors;
    }
    return [
      new AutoDllPlugin({
        debug: true,
        inject: true,
        inherit: true,
        context,
        entry: vendorsEntry,
        filename: filename.js,
        library: filename.library,
        config: {
          plugins: [...this.makeCommonPlugins(), ...this.makeModePlugins()],
          optimization: {
            minimizer: this.makeMinimizerPlugins(),
          },
        },
      }),
    ];
  };

  update = (valuePath, updater) => {
    _.update(this.config, valuePath, updater);
  };

  export = () =>
    Object.assign({}, this.config, {
      module: {
        rules: Object.keys(this.config.module).reduce((rules, key) => {
          const item = this.config.module[key];
          return rules.concat(Array.isArray(item) ? item : [item]);
        }, []),
      },
    });
}

module.exports = DefaultPreset;
