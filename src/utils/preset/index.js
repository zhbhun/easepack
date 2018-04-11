const _ = require('lodash');
const merge = require('webpack-merge');

const presetConfig = (config) => {
  const presets = config.presets || [];
  _.unset(config, 'presets');
  return merge(presets.map((preset) => {
    const presetFunc = require(Array.isArray(preset) ? preset[0] : preset);
    const presetOptions = Array.isArray(preset) ? preset[1] : {};
    return presetFunc(Object.assign({}, presetOptions, { mode: config.mode }), config);
  }).concat(config));
};

module.exports = presetConfig;
