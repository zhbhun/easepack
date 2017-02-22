var path = require('path');
var webpack = require('webpack');
var StatsPlugin = require('stats-webpack-plugin');
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
var CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
var WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');

var getClientEnvironment = require('./env');

// TODO description
var postcssLoader = {
  loader: 'postcss-loader',
  options: {
    plugins: function () {
      return [
        // We use PostCSS for autoprefixing only.
        autoprefixer({
          browsers: [
            '>1%',
            'last 4 versions',
            'Firefox ESR',
            'not ie < 9', // React doesn't support IE8 anyway
          ],
        }),
      ];
    },
  },
};

// TODO get different environment filename
function getFilename(debug, filename) {
  if (debug) {
    return Object.assign({}, filename, {
      js: '[name].js',
      css: '[name].css',
      // TODO conflict?
      media: '[name].[ext]',
    });
  }
  return filename;
}

/**
 * Webpack common config generator
 *
 * @param {object} paths @see ../path
 * @param {boolean} dll
 */
function WebpackCommonConfig(paths, dll) {
  var source = paths.source,
    output = paths.output,
    // Webpack uses `publicPath` to determine where the app is being served from.
    // It requires a trailing slash, or the file assets will get an incorrect path.
    publicPath = output.path.publicPath,
    // `publicUrl` is just like `publicPath`, but we will provide it to our app
    // as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
    // Omit trailing slash as %PUBLIC_URL%/xyz looks better than %PUBLIC_URL%xyz.
    publicUrl = publicPath.slice(0, -1),
    env = getClientEnvironment(publicUrl),
    debug = env['process.env']['NODE_ENV'] == '"development"',
    product = env['process.env']['NODE_ENV'] === '"production"',
    server = debug && !dll,
    filename = getFilename(debug, output.filename);
  return {
    // TODO description
    cache: true,

    // You may want 'eval' instead if you prefer to see the compiled output in DevTools.
    // See the discussion in https://github.com/facebookincubator/create-react-app/issues/343.
    devtool: debug ? 'cheap-module-source-map' : undefined,

    // different environment has diff entry
    entry: undefined,

    output: {
      // TODO description
      path: (dll ? output.path.dllPath : output.path.buildPath) || __dirname,
      // Add /* filename */ comments to generated require()s in the output.
      pathinfo: true,
      // JavaScript file name rule
      filename: filename.js,
      // TODO comment
      chunkFilename: filename.js,
      // TODO description
      library: '[name]_library',
      // TODO description
      publicPath: publicPath,
    },

    resolve: {
      // TODO description
      alias: {
        '~': source.srcPath,
      },
      // These are the reasonable defaults supported by the Node ecosystem.
      // We also include JSX as a common component filename extension to support
      // some tools, although we do not recommend using it, see:
      // https://github.com/facebookincubator/create-react-app/issues/290
      extensions: ['.js', '.json', '.jsx'],
      // TODO description
      modules: [
        source.nodeModulesPath,
      ],
    },

    // TODO
    // Resolve loaders (webpack plugins for CSS, images, transpilation) from the
    // directory of `react-scripts` itself rather than the project directory.
    resolveLoader: {
      // root: paths.ownNodeModules,
      // moduleTemplates: ['*-loader']
      // moduleExtensions: ["-loader"]
    },

    module: {
      rules: [
        // ** ADDING/UPDATING LOADERS **
        // The "url" loader handles all assets unless explicitly excluded.
        // The `exclude` list *must* be updated with every change to loader   extensions.
        // When adding a new loader, you must add its `test`
        // as a new entry in the `exclude` list for "url" loader.
        // "url" loader embeds assets smaller than specified size as data URLs to   avoid requests.
        // Otherwise, it acts like the "file" loader.
        {
          exclude: [
            /\.html$/,
            /\.(js|jsx)$/,
            /\.css$/,
            /\.less$/,
            /\.json$/,
            /\.svg$/,
          ],
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 10000,
                name: filename.media,
              },
            },
          ],
        },
        // First, run the linter.
        // It's important to do this before Babel processes the JS.
        {
          enforce: 'pre',
          test: /\.(js|jsx)$/,
          include: source.srcPath,
          use: [{
            loader: 'eslint-loader',
            options: {
              // TODO
              configFile: path.join(__dirname, '../../.eslintrc'),
              useEslintrc: false,
            },
          }],
        },
        // Process JS with Babel.
        {
          test: /\.(js|jsx)$/,
          include: source.srcPath,
          use: [
            {
              loader: 'babel-loader',
              options: {
                // TODO
                babelrc: false,
                presets: [require.resolve('babel-preset-react-app')],
                // TODO
                // This is a feature of `babel-loader` for webpack (not Babel itself).
                // It enables caching results in ./node_modules/.cache/babel-loader/
                // directory for faster rebuilds.
                cacheDirectory: true
              },
            },
          ],
        },
        // "postcss" loader applies autoprefixer to our CSS.
        // "css" loader resolves paths in CSS and adds assets as dependencies.
        // "style" loader turns CSS into JS modules that inject <style> tags.
        // In production, we use a plugin to extract that CSS to a file, but
        // in development "style" loader enables hot editing of CSS.
        {
          test: /\.css$/,
          use: server ?
            [
              'style-loader',
              'css-loader?importLoaders=1',
              postcssLoader,
            ] :
            ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: [
                'css-loader?importLoaders=1',
                postcssLoader,
              ],
            })
          ,
        },
        {
          test: /\.less$/,
          use: server ?
            [
              'style-loader',
              'css-loader?importLoaders=1',
              postcssLoader,
              'less-loader',
            ] :
            ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: [
                'css-loader?importLoaders=1',
                postcssLoader,
                'less-loader',
              ],
            })
          ,
        },
        // "file" loader for svg
        {
          test: /\.svg$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: filename.media,
              },
            }
          ]
        },
      ],
    },

    plugins: [
      // Makes some environment variables available to the JS code, for example:
      // if (process.env.NODE_ENV === 'development') { ... }. See `./env.js`.
      new webpack.DefinePlugin(env),
      // TODO description
      new webpack.LoaderOptionsPlugin({
        debug,
        minimize: !debug,
      }),
      // TODO description
      new webpack.NoEmitOnErrorsPlugin(),
      // Note: this won't work without ExtractTextPlugin.extract(..) in `loaders`.
      new ExtractTextPlugin(filename.css),
    ]
    .concat(server ? [
      // Watcher doesn't work well if you mistype casing in a path so we use
      // a plugin that prints an error when you attempt to do this.
      // See https://github.com/facebookincubator/create-react-app/issues/240
      new CaseSensitivePathsPlugin(),
      // If you require a missing module and then `npm install` it, you still have
      // to restart the development server for Webpack to discover it. This plugin
      // makes the discovery automatic so you don't have to restart.
      // See https://github.com/facebookincubator/create-react-app/issues/186
      new WatchMissingNodeModulesPlugin(source.nodeModulesPath),
    ] : [])
    .concat(product ? [
      // TODO comment
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          screw_ie8: true, // React doesn't support IE8
          warnings: false,
        },
        mangle: {
          screw_ie8: true,
        },
        output: {
          comments: false,
          screw_ie8: true,
        },
      }),
      // TODO comment
      new StatsPlugin('stats.json', { // TODO Custom stats file name
        chunkModules: true,
      }),
    ]: [])
    .concat(!dll ? [
      // TODO
      // Makes some environment variables available in index.html.
      // The public URL is available as %PUBLIC_URL% in index.html, e.g.:
      // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
      // In development, this will be an empty string.
      // in `package.json`, in which case it will be the pathname of that URL.
      new InterpolateHtmlPlugin({
        PUBLIC_URL: publicUrl
      }),
      // Generates an `index.html` file with the <script> injected.
      new HtmlWebpackPlugin({
        inject: true,
        chunksSortMode: 'dependency',
        template: source.htmlPath,
        minify: debug ? undefined : {
          removeComments: true,
          // collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          // minifyJS: true,
          // minifyCSS: true,
          // minifyURLs: true,
        },
      }),
    ] : []),

    // TODO description
    profile: product && !dll, // TODO Does DLL chunk need stat?

    // Some libraries import Node modules but don't use them in the browser.
    // Tell Webpack to provide empty mocks for them so importing them works.
    node: {
      fs: 'empty',
      net: 'empty',
      tls: 'empty'
    },
  };
}

module.exports = WebpackCommonConfig;
