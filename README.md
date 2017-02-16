- 实现开发环境模块热加载
- 优化开发环境构建性能
- 实现生成环境代码划分构建
- 升级到 webpack2

```
module.exports = {
  app: appDirectory,
  appPrebuild: resolveApp('.cache/Prebuild'),
  appBuild: resolveApp('build'),
  appPublic: resolveApp('public'),
  appHtml: resolveApp('public/index.html'),
  appIndexJs: resolveApp('src/index.js'),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  yarnLockFile: resolveApp('yarn.lock'),
  testsSetup: resolveApp('src/setupTests.js'),
  appNodeModules: resolveApp('node_modules'),
  ownNodeModules: resolveApp('node_modules'),
  nodePaths: nodePaths
};
```

```
react-spa options

command

start
build

option

--host
--port 
```
