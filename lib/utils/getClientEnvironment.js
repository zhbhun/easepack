function getClientEnvironment(publicUrl) {
  var raw = {
    // Useful for determining whether we’re running in production mode.
    'NODE_ENV': process.env.NODE_ENV || 'development',
    // Useful for resolving the correct path to static assets in `public`.
    // For example, <img src={process.env.PUBLIC_URL + '/img/logo.png'} />.
    // This should only be used as an escape hatch. Normally you would put
    // images into the `src` and `import` them in code to get their paths.
    'PUBLIC_URL': publicUrl
  };
  // Stringify all values so we can feed into Webpack DefinePlugin
  var stringified = {
    'process.env': Object
      .keys(raw)
      .reduce((env, key) => {
        env[key] = JSON.stringify(raw[key]);
        return env;
      }, {}),
  };

  return { raw, stringified };
}

module.exports = getClientEnvironment;
