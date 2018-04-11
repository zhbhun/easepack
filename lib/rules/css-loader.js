var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = function (config) {
  const production = process.env.NODE_ENV === 'production';
  return {
    test: /\.css$|\.less$|\.scss$/,
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: [
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1,
            minimize: production,
            sourceMap: !production,
          }
        }, {
          loader: 'postcss-loader',
          options: {
            // https://webpack.js.org/guides/migrating/#complex-options
            ident: 'postcss',
            plugins: function () {
              return [
                // stylelint(),
                autoprefixer(config.targets)
              ]
            },
            sourceMap: true,
          }
        }
      ],
    }),
  };
};
