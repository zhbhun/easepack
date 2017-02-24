入门示例，第三方依赖只有 react 和 react-dom，打包结果如下所示：

```
.
├── index.html
├── static
│   ├── css
│   │   └── main.[hash].css
│   ├── js
│   │   ├── base.[hash].js
│   │   └── main.[hash].js
│   └── media
│       └── logo.[hash].svg
└── stats.json
```

- `base.[hash].js`：143 KB，压缩后 44.2 KB
- `main.[hash].js`：2 KB，压缩后 1.3 KB

备注：该项目的代码量比较小，实际项目 `main.[hash].js` 大小不止于此。
