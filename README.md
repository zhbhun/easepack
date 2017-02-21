# 特性
- 实现开发环境模块热加载；
- 优化开发环境构建性能（确保热加载重构时间保持在 1 秒内）；
- 简化生成环境代码划分配置；

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

# 计划
- [ ] 增强配置的自定义性，支持 Babel，ESLint 等转译自定义配置，支持一些插件的开启和关闭
- [ ] 完善开发文档
