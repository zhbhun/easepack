module.exports = {
  presets: [
    [
      require.resolve('easepack/lib/config/es'),
      {
        input: './src/index.html',
        env: {
          development: {
            publicPath: '/debug/'
          },
          production: {
            publicPath: '//prod.com/'
          }
        }
      }
    ]
  ]
};
