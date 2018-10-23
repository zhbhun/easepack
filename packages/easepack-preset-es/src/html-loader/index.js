module.exports = function htmlEntryLoader(source) {
  return source.replace(/<script.*src="(.*)"><\/script>/gi, '');
};
