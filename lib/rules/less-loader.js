module.exports = function () {
  return {
    enforce: 'pre',
    test: /\.less$/,
    use: {
      loader: 'less-loader',
      options: { sourceMap: true },
    },
  }
};
