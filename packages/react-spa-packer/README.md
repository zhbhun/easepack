```javascript
{
  context: string,
  source: {
    src: string,
    main: string,
    pbulic: string,
    html: string,
  },
  output: {
    path: {
      dll: string,
      build: string,
    },
    filename: {
      js: string,
      css: string,
      media: string,
    },
  },
  dll: string | object, // { name: string, dependencies: string[] }
  chunks: object[], // { name: string, dependencies: string[] | string}
  webpack: object,
}
```

- [ ] 优化默认配置
- ...
