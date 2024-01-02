[简体中文](./doc/README_CN.md)

# UI-PROTOTYPE
A clean, fully keyboard-enabled, feature-rich UI prototype designed specifically for Electron.

# 项目结构
- assets 资源文件 KEEP
- build  构建工具 CLEAN
- dist       生成 GENERATE
- layout 布局模板 KEEP
- locale 翻译文件 -> locale
- style  样式文件 -> style.css
- ts     脚本文件 -> script
- doc    文档文件 CLEAN
- README.md  说明 CLEAN

# 初始化项目
```sh
npm install
npm install -g typescript
npm run build
```

# 开发
推荐使用 VScode 并安装推荐的插件，自动构建翻译文件、布局模板、样式文件。
```sh
npm run build
tsc --watch
```

## 运行
```sh
npm start
```

# 构建
```sh
tsc
npm run pack
```