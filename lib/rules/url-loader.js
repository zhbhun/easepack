module.exports = function(config) {
  return {
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
          publicPath: config.output.publicPath,
          name: config.output.filenames.media
        }
      }
    ]
  };
};
