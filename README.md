Easepack 是基于 webpack 的通用打包工具，内置常用插件和加载器的默认配置。
========

## 安装

> npm install --save-dev easepack

## 用法

启动开发服务器：

> easepack start --config ./config/easepack.dev.js

构建生产环境:

> easepack build --config ./config/easepack.prod.js

## 快速上手

- 创建项目:

    - `mkdir easepack-demo && cd easepack-demo`
    - `npm init -y`
    - `npm install easepack easepack-preset-es --save-dev`

    ```
      easepack-demo
    + |- package.json
    ```

- 创建文件:

    - .eslintrc

        ```json
        {
          "extends": "eslint:recommended",
          "parserOptions": {
            "ecmaVersion": 2018,
            "sourceType": "module"
          },
          "env": {
            "browser": true
          }
        }
        ```

    - easepack.js

        ```javascript
        module.exports = {
          presets: [
            [
              require.resolve('easepack-preset-es'), /* 继承 easepack/lib/config/es 的配置 */
              {
                input: 'index.html' /* 设置项目入口文件 */
              }
            ]
          ]
        };
        ```

    - index.html

        ```html
        <!doctype html>
        <html>
        <head>
          <title>Getting Started</title>
        </head>
        <body>
          <script src="./src/index.js"></script>
        </body>
        </html>
        ```

    - src/index.js

        ```javascript
        function component() {
          var element = document.createElement('div');
          element.innerHTML = 'Hello easepack!';
          return element;
        }
        document.body.appendChild(component());
        ```

    ```
      easepack-demo
      |- package.json
    + |- .eslintrc
    + |- easepack.js
    + |- index.html
    + |- /src
    +   |- index.js
    ```

- 启动开发服务器:

    `npx easepack start --config ./easepack.js`

- 构建生产环境:

    `npx easepack build --config ./easepack.js`

## 配置

Easepack 在 webpack 的基础上增加了一项配置 `preset`，用于继承一些公用的配置。除此之外，Easepack 支持 webpack 的所有配置，并且会覆盖 `preset` 中的配置。
```
{
  // 类似 babel 的 presets
  presets: [
    [
      string, // 预设模块的路径（绝对路径）
      object // 预设模块的参数
    ]
    // 可以配置多个预设模块
  ]
}
```

### easepack-preset-es

easepack-preset-es 是 easepack 内置提供的一个通用预设配置，支持以下预设参数：

- mode: 构建模式，等同于 webpack4 新增的属性 [mode](https://webpack.js.org/concepts/mode).

    Easepack 默认根据构建命令来设置 mode。如果是 `build`， 那么 `mode` 默认设置为 `production`。如果是 `start`，那么 `mode` 默认设置为 `development`。

- context：基础目录，绝对路径，用于从配置中解析入口起点和加载器，等同于 [contenxt](https://webpack.js.org/configuration/entry-context/#context)，默认值为项目的根路径。
- input：起点或是应用程序的起点入口，等同于 [entry](https://webpack.js.org/configuration/entry-context/#entry)，默认值为 `src/index.js`。
- vendors：构建缓存（DLL 插件实现），推荐在开发环境使用，生成环境的拆包请使用 webpack4 的 splitChunks。

    - false: 禁用该项功能，默认值。
    - true: 自动查找项目的第三方依赖来构建缓存（package.json 的 dependencies）
    - string|array|object: 等同于 [entry](https://webpack.js.org/configuration/entry-context/#entry)，可以自定义构建缓存模块。

- outputPath：构建输出路径，等用于 [output.path](https://webpack.js.org/configuration/output/#output-path)，默认值是 `dist`。
- publicPath： 打包资源的服务路径，等同于 [output.publicPath](https://webpack.js.org/configuration/output/#output-publicpath)，默认值是 `/`。
- filename：输出文件命名方式

    - filename.js: JS 文件命名规则
    - filename.css: CSS 文件命名规则
    - filename.media: 图片，音频等其他媒体文件的命名规则
    - filename.library: DLL 库的命名规则
    - filename.html: HTML 的命名规则

    默认情况下，easepack 针对不同的 mode 提供了不同的默认配置

    - 生产环境

        ```javascript
        {
          filename: {
            js: '[name].[contenthash:8].js',
            css: '[name].[contenthash:8].css',
            media: '[name].[hash:8].[ext]',
            manifest: '[name].manifest.json',
            library: '[name]_library',
            html: '[name].html'
          }
        }
        ```

    - 开发环境

        ```javascript
        {
          filename: {
            js: '[name].[hash:8].js',
            css: '[name].[hash:8].css',
            media: '[name].[hash:8].[ext]',
            manifest: '[name].manifest.json',
            library: '[name]_library',
            html: '[name].html'
          },
        }
        ```

- targets：编译兼容目标，等同于 [babel-preset-env targets](https://babeljs.io/docs/plugins/preset-env/)，默认值为 `{ browsers: ['last 2 versions', 'safari >= 7'] }`。
- hot: 是否启用热加载，默认值为 `true`
- sourceMap: 是否启用 sourceMap，等同于 [devtool](https://webpack.js.org/configuration/devtool/)，开发环境默认为 `eval`，生产环境默认为 `false`。
- analyzer: 是否启用构建分析，为 `true` 会使用 `webpack-bundle-analyzer` 来分析打包文件的内部组成和模块占用大小。生成环境默认为 `true`，开发环境默认为 `false`。
- dataURLLimit：设置 `url-loader` 的属性 [`limit`](https://github.com/webpack-contrib/url-loader#limit)，开发环境默认为 `1`，生产环境默认为 `5120`。
- env：针对不同 `mode` 的特殊配置。

    - env.production：在 `mode` 等于 `production` 时，该项配置会覆盖外部的预设参数。
    - env.development：在 `mode` 等于 `development` 时，该项配置会覆盖外部的预设参数。

### 自定义 Presets

参考 [es](./src/config/es.js) 和 [react](./src/config/react.js)。

## 示例

- [HTML Entry](./examples/entry)
- [DLL](./examples/vendors)
- [React](./examples/react)
- [ENV Config](./examples/env)
