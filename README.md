前端通用打包工具

---

# 用法
- `easepack start --config ./config.js`
- `easepack build --config ./config.js`

# 配置
## context
- 简介：`context`（上下文）是项目所处目录的绝对路径的字符串。默认使用当前目录，但是推荐在配置中传递一个值。这使得你的配置独立于 CWD(当前执行路径)。
- 用法：`string`
- 默认：`process.cwd()`

## input
- 简介：应用程序的打包输入配置。
- 用法：`object | array`

    ```javascript
    {
      input: {
        name: string, // 入口标识（影响最终打包文件的名称），必填
        script: string, // JavaScript 入口，必填
        html: string, // HTML 入口，非必填，没有设置就不输出 HTML
      },
    }
    ```

    `input` 也可以是数组，打包多个单页应用，每个数组元素是一个上面示例的对象。

- 默认：`undefiend`

## vendors
- 简介：提取应用程序公共模块的配置，这些模块最终会合并打包成一个或多个文件，并注入到 `input` 配置的每一个单页应用中。
- 用法：`false | undefined | string | array`

    - `false` / `undefined`：关闭公共模块的提取功能。
    - `string`：提取 package.json 的 `dependencies` 属性指定的所有依赖模块，`vendor` 值用于命名提取文件名称。
    - `[{ async: boolean, name: string, dependencies: string[] }]`：自定义公共模块的提取方式

        ```javascript
        {
          vendors: [
            {
              name: 'base', // 基础第三方库
              dependencies: ['jquery', 'bootstrap'],
            }, {
              async: true, // 动态加载（只有程序执行到引入对应库的代码时才会加载该文件，且只需加载一次，待实现）
              name: 'rich', // 复杂交互的第三方库
              dependencies: ['ckeditor-dev', 'datatables'],
            },
          ],
        }
        ```

    `dependencies` 的值不一定是要 npm 模块名称，也可以是一个路径，只要能正常访问到对应模块。

- 默认：`undefined`

## output
应用程序的打包输出配置。

### path
- 简介：应用程序的打包文件输出路径
- 用法：`string`
- 默认：`'build'`

### devServer / prodServer
- 简介：应用程序的输出服务配置。在开发环境下，用于配置开发服务器的地址。在生产环境下，用于配置 CDN 地址。
- 用法：`object`

    ```javascript
    {
      protocol: string, // 服务协议
      host: string, // 服务域名或 IP
      port: string, // 服务端口号
      path: string, // 服务子路径
    }
    ```

- 默认：

    - `devServer`

        ```javascript
        {
          protocol: '',
          host: '', // 自动识别 IP 地址
          port: '3000',
          path: '/',
        }
        ```

    - `prodServer`

        ```javascript
        {
          protocol: undefined,
          host: undefined,
          port: undefined,
          path: '/',
        }
        ```


### filenames
- 简介：应用程序的打包文件命名规则
- 用法：`object`

    ```javascript
    {
      js: string, // JavaScript 文件命名
      css: string, // CSS 文件命名
      media: string, // 媒体文件命名
      html: string, // HTML 文件命名
    }
    ```

- 默认：

    - 开发环境


        ```javascript
        {
          js: '[name].js',
          css: '[name].css',
          media: '[name].[hash:8].[ext]',
          html: '[name].html',
        }
        ```

    - 生成环境

        ```javascript
        {
          js: '[name].[chunkhash:8].js',
          css: '[name].[contenthash:8].css',
          media: '[name].[hash:8].[ext]',
          html: '[name].html',
        }
        ```

## targets
参考 [babel-preset-env](https://babeljs.cn/docs/plugins/preset-env/)

### browsers
- 简介：指定需要支持的浏览器版本
- 用法：参考 [browserslist](https://github.com/ai/browserslist)
- 默认：

    ```
    [
      'since 2014',
      'ie >= 9'
    ]
    ```

### node
- 简介：指定需要支持的 Node.js 版本
- 用法：`string`
- 默认： `undefined`

## proxy
- 简介：接口代理配置，在开发环境下使用。
- 用法: `string`

    ```
    {
      target: string, // 代理目标服务器地址
      headers: object, // 代理请求头配置
    }
    ```

- 默认：`undefined`
- 参考：[http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware)

## loaders
- 简介：自定义 loader 配置
- 用法：`object`，key 为加载器名称， value 为加载器配置，false 表示不启用该加载器

    - `eslint-loader`
    - ...

- 默认：`undefined`

## native / webpack
Webpack 原生配置

# 示例
- [jquery](./examples/jquery)
- [lodash](./examples/lodash)
- [scss](./examples/scss)

```js
module.exports = {
  context: context,
  input: {
    name: 'main',
    script: 'src/index.js',
    html: 'src/index.html',
  },
  vendors: [{
    name: 'base',
    dependencies: [
      path.resolve(context, 'src/vendor.js'),
    ],
  }],
};
```

# Plan
- [ ] 支持多个输入各自配置 vendors
- [ ] 重构代理的配置
- [ ] 更加灵活的配置
