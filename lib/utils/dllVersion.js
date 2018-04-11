var fs = require('fs');
var path = require('path');

function getModuleVersion(dependency) {
  var NODE_MODULES = 'node_modules';
  var dp = require.resolve(dependency);
  var pkgPath = path.resolve(dp.substring(0, dp.lastIndexOf(NODE_MODULES)), NODE_MODULES, dependency, 'package.json');
  var pkg = require(pkgPath);
  return pkg.version;
}

function getCurrentVersion(dependencies) {
  var disable = false;
  var result = {};
  dependencies.forEach(function (dependency) {
    if (path.isAbsolute(dependency)) {
      disable = true;
    } else {
      result[dependency] = getModuleVersion(dependency);
    }
  });
  return !disable && result;
}

function getVersionFilePath(dllPath) {
  return path.resolve(dllPath, 'version.json');
}

function getOldVersion(dllPath) {
  var versionPath = getVersionFilePath(dllPath);
  if (fs.existsSync(versionPath)) {
    return require(versionPath);
  }
  return null;
}

exports.record = function (dllPath, chunk) {
  var dependencies = chunk.dependencies;
  var currentVersions = getCurrentVersion(dependencies);
  var versionPath = getVersionFilePath(dllPath);
  fs.writeFileSync(versionPath, JSON.stringify(currentVersions));
};

exports.isExpired = function (dllPath, chunk) {
  var name = chunk.name;
  var dependencies = chunk.dependencies;
  var currentVersions = getCurrentVersion(dependencies);
  var oldVersions = getOldVersion(dllPath, name);
  return !currentVersions ||
    !oldVersions ||
    Object.keys(currentVersions).some(function (key) {
      return currentVersions[key] !== oldVersions[key];
    }) ||
    (Object.keys(currentVersions).length !== Object.keys(oldVersions).length);
};
