module.exports = function () {
  return {
    test: /\.ejs$/,
    use: [{
      loader: 'ejs-compiled-loader',
    }, {
      loader: 'extract-loader',
    }, {
      loader: 'html-loader',
      options: {
        ignoreCustomFragments: [/\{\{.*?}}/],
        attrs: ['img:src', 'link:href'],
      },
    }],
  };
};
