const DefaultPreset = require('../utils/preset/DefaultPreset');

module.exports = (options, raw) => {
  const config = new DefaultPreset(options, raw);
  config.update('module.js.use.options.presets', function (value) {
    value.push('react');
    return value;
  });
  try {
    require.resolve('react-hot-loader');
    config.update('module.js.use.options.plugins', function (value) {
      value.push('react-hot-loader/babel');
      return value;
    });
  } catch (error) {
    // empty
  }
  return config.export();
};
