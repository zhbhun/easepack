module.exports = {
  presets: [
    [
      require.resolve('easepack/lib/config/es'),
      {
        input: './src/index.html',
        vendors: ['lodash', 'react', 'react-dom'],
        outputPath: './dist/array'
      }
    ]
  ]
};
