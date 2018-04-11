module.exports = function () {
  return {
    enforce: 'pre',
    test: /\.scss$/,
    use: [
      { loader: 'resolve-url-loader' },
      {
        loader: 'sass-loader',
        options: { sourceMap: true },
      },
    ],
  }
};
