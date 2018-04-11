module.exports = function () {
  return {
    enforce: 'pre',
    test: /\.js$/,
    exclude: /node_modules/,
    use: 'eslint-loader',
  };
}
