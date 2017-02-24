采用 React Bootstrap 实现的 [cnodejs](https://cnodejs.org/)。

第三方依赖：

- `bootstrap`
- `classnames`
- `draft-js`
- `draftjs-to-html`
- `draftjs-to-markdown`
- `lodash`
- `react`
- `react-bootstrap`
- `react-dom`
- `react-draft-wysiwyg`
- `react-router`
- `react-router-bootstrap`

打包结果

```
.
├── index.html
├── static
│   ├── css
│   │   ├── base.be56e84e.css
│   │   └── main.e7c4bd1b.css
│   ├── js
│   │   ├── base.ee94368a.js
│   │   ├── main.514df74f.js
│   │   ├── react.44d4edee.js
│   │   └── react-editor.02e4a8c2.js
│   └── media
│       ├── glyphicons-halflings-regular.448c34a5.woff2
│       ├── glyphicons-halflings-regular.89889688.svg
│       ├── glyphicons-halflings-regular.e18bbf61.ttf
│       ├── glyphicons-halflings-regular.f4769f9b.eot
│       └── glyphicons-halflings-regular.fa277232.woff
└── stats.json
```

- CSS

    - `base.[hash].css`：114 KB，压缩后 19.3 KB
    - `main.[hash].css`：25.1 KB，压缩后 4.2 KB

- JavaScript

    - `base.[hash].js`：173 KB，压缩后 45.3 KB
    - `react.[hash].js`：281 KB，压缩后 76 KB
    - `main.[hash].js`：78.6 KB，压缩后 14.8 KB
    - `react-editor.[hash].js`：659 KB，178 KB

备注：`react-editor` 是富文本编辑器相关模块合并出来的代码块，而且是动态加载的，即只有在页面真正使用到富文本编辑器时才会下载该代码库的脚本文件。
