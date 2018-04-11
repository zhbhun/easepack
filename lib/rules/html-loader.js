module.exports = function () {
  return {
    test: /\.html$/,
    use: [{
      loader: 'html-loader',
      options: {
        ignoreCustomFragments: [/\{\{.*?}}/],
        attrs: ['img:src', 'link:href'],
      },
    }],
  };
};
