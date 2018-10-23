module.exports = [
  {
    presets: [
      [
        require.resolve('easepack/lib/config/es'),
        {
          input: './src/home/index.html',
          outputPath: './dist/home',
        }
      ]
    ]
  },
  {
    presets: [
      [
        require.resolve('easepack/lib/config/es'),
        {
          input: './src/share/index.html',
          outputPath: './dist/share',
        }
      ]
    ]
  }
];
