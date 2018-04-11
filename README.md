Ease bundle frontend project base on webpack v4.
========

# Install
Install with npm:

> npm install --save-dev easepack

Install with yarn:

> yarn add easepack --dev

# Usage

Start development server:

> easepack start --config <configuration file path>

Build production files:

> easepack build --config <configuration file path>

# Getting Started
- Create project:

    - `mkdir easepack-demo && cd easepack-demo`
    - `npm init -y`
    - `npm install easepack --save-dev`

    ```
    easepack-demo
    |- package.json
    ```

- Create the following directory structure, files and their contents:

    - project

        ```
          easepack-demo
          |- package.json
        + |- easepack.js
        + |- index.html
        + |- /src
        +   |- index.js
        ```

    - easepack.js

        ```javascript
        module.exports = {
          presets: [
            [
              require.resolve('easepack/lib/config/es'),
              {
                input: 'index.html'
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

- Start development server:

    `npx easepack start --config ./config.js`

- Build production files:

    `npx easepack build --config ./config.js`

# Configuration

Easepack configuration is same with webpack except `presets`, which is used to preset common config. By defaults, easepack provide es and react preset, you could provide yourself presets.

```
{
  // like babel presets
  presets: [
    [
      string, // preset module path
      object // preset option
    ]
    // could config more preset
  ]
}
```

## Default Presets

Easepack provide two preset, es and react. They all support follow options:

- mode: used to config webpack [mode](https://webpack.js.org/concepts/mode).

    By default, easepack config mode by command, build with `production`, start with `development`.

- context: used to config webpack [contenxt](https://webpack.js.org/configuration/entry-context/#context), default is project root path.
- input: used to config webpack [entry](https://webpack.js.org/configuration/entry-context/#entry), and it support html file, default is `src/index.js`.
- vendors: used to dll build, recommend use in development. 

    - false: disable dll build, default value
    - true: build dependencies of package.json
    - string|array|object: same with webpack [entry](https://webpack.js.org/configuration/entry-context/#entry)

- outputPath: used to config [output.path](https://webpack.js.org/configuration/output/#output-path), default is `dist`
- publicPath: : used to config [output.publicPath](https://webpack.js.org/configuration/output/#output-publicpath)
- filename: used to config bundle file name

    - filename.js: JavaScript filename
    - filename.css: CSS filename
    - filename.media: Image, Audio and other media filename
    - filename.library: used to define dll library filename
    - filename.html: HTML filename

    By default, easepack config with following rules:

    ```javascript
    production = {
      js: '[name].[contenthash:8].js',
      css: '[name].[contenthash:8].css',
      media: '[name].[hash:8].[ext]',
      manifest: '[name].manifest.json',
      library: '[name]_library',
      html: '[name].html'
    };
    development = {
      js: '[name].js',
      css: '[name].css',
      media: '[name].[hash:8].[ext]',
      manifest: '[name].manifest.json',
      library: '[name]_library',
      html: '[name].html'
    };
    ```

- targets: used to define [babel-preset-env targets](https://babeljs.io/docs/plugins/preset-env/)
- env: define some special environment config

    - env.production
    - env.development

## Custom Presets

Refer to source code [es](./src/config/es.js) and [react](./src/config/react.js)

# Examples

- [HTML Entry](./examples/entry)
- [DLL](./examples/vendors)
- [React](./examples/react)
- [ENV Config](./examples/env)
