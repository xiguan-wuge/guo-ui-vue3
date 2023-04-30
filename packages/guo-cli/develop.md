# 开发记录
- path.resolve(__dirname) 中 __dirname 不被识别
```
console.log('tem', resolve(__dirname));
                           ^
ReferenceError: __dirname is not defined in ES module scope
```
- 如何在node中启动 ts+esm