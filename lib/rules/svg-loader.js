module.exports = function (config) {
  return {
    test: /\.svg$/,
    use: [{
      loader: 'file-loader',
      options: {
        publicPath: config.output.publicPath,
        name: config.output.filenames.media,
      },
    }],
  };
};
