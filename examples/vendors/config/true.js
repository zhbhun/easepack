module.exports = {
  presets: [
    [
      require.resolve('easepack/lib/config/es'),
      {
        input: './src/index.html',
        vendors: true,
        outputPath: './dist/true'
      }
    ]
  ]
};
