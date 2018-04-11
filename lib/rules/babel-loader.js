module.exports = function (config) {
  const production = process.env.NODE_ENV === 'production';
  return {
    test: /\.js$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        cacheDirectory: true,
        presets: [
          [
            'env',
            {
              modules: false,
              targets: config.targets,
            },
          ],
          'stage-2',
        ],
        plugins: [
          'transform-runtime'
        ]
          .concat(production ? ['lodash'] : []),
      },
    },
  };
};
