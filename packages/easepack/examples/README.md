本示例展示如何编写一个最简单 easepack preset。

## 开发说明

- 安装依赖：`npm install`
- 启动开发服务器：`npm start`，浏览器访问 `localhost:3000/main.js`
- 打包生产文件：`npm run build`，打开 `build` 目录下的 `main.js`

## 总结

该示例包含一个 easepack 的配置文件 `config.js`，preset 指向预设配置文件 `preset.js`，该预设默认将 `src/index.js` 文件作为入口，`build` 作为输出路径。
