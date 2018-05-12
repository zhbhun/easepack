Change Log
========

## 4.1.4

* 去掉插件 optimize-css-assets-webpack-plugin（该插件优化 CSS 时可能导致动画名称混淆和丢失的问题）。

## 4.1.3

* 解决打包生成的 HTML 文件没有包含拆分 bundle 的问题。

## 4.1.1

* 调整开发环境的打包文件命名规则，通过增加 hash 值来解决移动端缓存问题。
* 升级第三方依赖至最新版本

## 4.1.0

* 增加 eslint 来检查代码，prettier 来格式化代码。
* 将 eslint 依赖设置为 peerDependencies，以适用于不同版本的需求。
* DefaultPreset 增加配置参数 hot，sourceMap，analyzer，dataURLLimit

## 4.0.0

重构 easepack，升级 webpack 至 v4。
