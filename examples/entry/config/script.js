module.exports = {
  presets: [
    [
      require.resolve('easepack/lib/config/es'),
      {
        input: './src/index.js',
        outputPath: './dist/script'
      }
    ]
  ]
};
