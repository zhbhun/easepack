> create-react-spa 主要参考了 [create-react-app](https://github.com/facebookincubator/create-react-app) 项目，在该项目的基础上对打包构建进行了优化，提供了更加灵活的配置，以及更优秀的开发体验。

React 单页应用程序脚手架，用于简化 React 项目的开发和生成配置，

- 实现开发环境模块热加载；
- 优化开发环境构建性能（第三方库预构建）；
- 提供生成环境代码划分配置；

# 用法
- `mkdir welcome && cd welcome`
- `npm init -y`
- `npm install react-spa-packer --save-dev`
- `npm install react react-dom --save`
- `mkdir src && cd src && touch index.js && touch Root.js`

    ```javascript
    // index.js
    import React from 'react';
    import ReactDOM from 'react-dom';

    import Root from './Root';

    const rootElement = document.getElementById('root');
    let render = () => {
      const Root = require('./Root').default;
      ReactDOM.render(
        <Root />,
        rootElement
      );
    }

    // 要开启热加载必须使用包含这块代码
    if (module.hot) {
      const renderApp = render;
      render = () => {
        try {
          renderApp();
        } catch (error) {
          console.error(error);
        }
      };
      const rerender = () => {
        setTimeout(render);
      };
      module.hot.accept('./Root', rerender);
    }
  
    render();
    ```

    ```
    // Root.js
    import React, { Component } from 'react';

    class Root extends Component {
      render() {
        return (
          <div>
            Hello World!
          </div>
        );
      }
    }

    export default Root;
    ```

- `cd ../ && mkdir public && cd public && touch index.html`

    ```html
    <!doctype html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Hello World</title>
    </head>
    <body>
      <div id="root"></div>
    </body>
    </html>
    ```

- `cd ../ && touch packer.config.js`

    ```javascript
    var path = require('path');
    var context = path.resolve(process.cwd());
    module.exports = {
      context: context,
      source: {
        src: 'src',
        main: 'src/index.js',
        public: 'public',
        html: 'public/index.html',
      },
      output: {
        path: {
          dll: '.dll',
          build: 'build',
        },
      },
    };
    ```

- `./node_modules/.bin/react-spa start --config ./packer.config.js`：启动开发服务器
- `./node_modules/.bin/react-spa build --config ./packer.config.js`：打包生成环境文件

# 配置
```javascript
{
  context: string, // 项目根目录的绝对路径
  source: { // 源代码配置
    src: string, // 源代码路径（相对项目根目录的相对路径，下同）
    main: string, // 入口代码路径
    html: string, // HTML 模板
    public: string, // 额外的静态资源路径
    package: string,
    nodeModules: string,
  },
  output: { // 输出配置
    path: {
      dll: string, // 预构建文件放置路径
      build: string, // 构建文件放置路径
      publicPath: string, // 打包资源路径
    },
    filename: {
      js: string, // js 的命名方式
      css: string, // css 的命名方式
      media: string, // 媒体文件的命名方式
    },
  },
  dll: string | object, // 预构建配置：{ name: string, dependencies: string[] }
  chunks: object[], // 代码划分配置：{ name: string, dependencies: string[] | string}，
  webpack: object, // 自定义 webpack 配置
}
```

## 默认配置
```javascript
{
  context: process.cwd(), // 项目根路径
  source: {
    src: 'src',
    main: 'src/index.js', 
    html: 'public/index.html',
    public: 'public', 
    package: 'package.json',
    nodeModules: 'node_modules',
  },
  output: {
    path: {
      dll: '.dll', 
      build: 'build', 
      publicPath: '/',
    },
    filename: {
      js: 'static/js/[name].[chunkhash:8].js',
      css: 'static/css/[name].[contenthash:8].css',
      media: 'static/media/[name].[hash:8].[ext]',
    },
  },
  dll: 'vendor', 
  chunks: undefined，
  webpack: undefined, 
}
```

参考示例 [welcome](./examples/welcome)

## 根目录配置
`context` 属性用于配置项目的根目录，必须设置一个绝对路径。

## 源代码配置
一般来说，我们的前端源代码一般有 HTML，JavaScript，CSS，Image 等这些资源。

- `source.src`：JavaScript，CSS，Image 等源代码通常都放置在该目录下；
- `source.main`：入口代码；
- `source.html`：开发服务器和生成环境构建会以该 HTML 作为模板，将打包后的脚本文件和样式文件引入到 HTML 中；
- `source.public`：一些额外的静态资源，可以通过开发服务器访问该目录下的静态资源，生成环境构建时也会将该目录下的静态资源拷贝至构建目录里；

备注：以上属性配置的都是相对路径，参考 `context` 配置的绝对路径。如果需要使用绝对路径，请给每个属性名称加上 `Path`，例如 `srcPath`。

## 输出配置
- `output.path.dll`：开发服务器可以预构建第三方库，该属性用于配置预构建打包生成文件的放置目录；
- `output.path.build`：生成环境构建打包生成文件放置目录
- `output.path.publicPath`：打包资源的引用路径
- `output.filename.js`：JavaScript 文件的命名方式
- `output.filename.css`：CSS 文件的命名方式
- `output.filename.media`：媒体文件（字体，图片等）的命名方式

备注：以上路径属性配置的都是相对路径，参考 `context` 配置的绝对路径。如果需要使用绝对路径，请给每个属性名称加上 `Path`，例如 `buildPath`。

## 预构建配置
Webpack 开发服务器默认是将第三方库和自身项目代码打包在一起的，即使第三方库没有增加或修改，每次启动开发服务器或热加载时也都需要重新构建没有变化的第三方库。为了提升开发服务器的构建性能，我们可以预先构建好第三方库的代码。

`dll` 属性可以接受一个字符串或对象。如果是字符串，表示将预构建项目的所有 `dependencies` 模块，生成的打包文件以 `dll` 指定的字符串命名。如果是对象，则对象结构类似 `{ name: string, dependencies: string[] }`，`name` 属性表示打包文件的名称，`dependencies` 是要预构建的第三方模块。

备注：

- Wepack 是一个模块构建打包工具；
- 生成环境不支持预构建配置，但可以进行代码划分，参考下文；

## 代码划分
如上所述，Webpack 默认将第三方库和自身项目打包在一起，如果引用的第三方模块较多，最终生成的一个打包文件可能非常的庞大。

create-react-spa 默认将第三方库和项目源代码拆分打包，生成 `base.js`（第三方库） 和 `main.js`（项目代码）。如果需要更细致的划分，可以自定义配置文件中的 `chunks` 属性。例如，将第三方库细分成基础库和 React 库：

```
{
  // ...
  chunks: [
    // 基础库不用配置，默认自动生成
    {
      name: 'react',
      dependencies: [
        'react',
        'react-dom',
        'react-router',
        // ...
      ],
    },
  ],
  // ...
}
```

上面的配置在生产环境打包成 `base.js`，`react.js`，`main.js`。

备注：开发环境不支持代码划分，也不需要代码划分。

# 进阶
- 自定义配置
- 动态加载配置
- [Webpack Analyse](https://webpack.github.io/analyse/)

# 示例
- [welcome](./examples/welcome)：最简单的配置示例
- [real-world](./examples/real-world)：一个真实项目的配置示例

# 计划
- [ ] 增强配置的自定义性，支持 Babel，ESLint 等转译自定义配置，支持一些插件的开启和关闭
- [ ] 解决浏览器兼容性问题
- [ ] 实现项目初始化工具
- [ ] 完善开发文档
