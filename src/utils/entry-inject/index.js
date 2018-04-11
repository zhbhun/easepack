const inject = (entry, modules) => {
  let result;
  if (Array.isArray(entry)) {
    result = modules.concat(entry);
  } else {
    result = modules.concat([entry]);
  }
  return result;
};

module.exports = (config, modules) => {
  const entry = config.entry;
  const arrayModules = Array.isArray(modules) ? modules : [modules];
  if (!Array.isArray(entry) && typeof entry === 'object') {
    config.entry = Object.keys(entry).reduce((result, key) => {
      result[key] = inject(entry[key], modules);
      return result;
    }, {});
  } else {
    config.entry = inject(entry, modules);
  }
  return config;
};
