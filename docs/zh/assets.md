---
title: 资源文件
---

# 概述
UI-PROTOTYPE 默认将`src`下所有文件名开头不是`_`以及后缀名不是`.ts`、`.styl`的文件视为资源文件，编译时将其原样复制到`dist`目录下。

# 使用说明
## 添加资源文件
若要添加资源文件，可参考以下方法：
- 窗口的资源文件
  存放于`src/renderer/<窗口 ID>/assets`中。
- 通用的资源文件
  存放于`src/shared/assets`中。

## 修改应用图标
UI-PROTOTYPE 将应用图标存放于以下几个目录
- `resources`
- `src/shared/assets`

`resources`目录下的图标用于最终打包。  
`src/shared/assets`中`icon.svg`作为应用内图标；`icon.ico`为 Windows 系统下的窗口图标；`icon.png`为非 Windows 系统下的窗口图标。

## 引用资源文件
由于 Electron 打包前后`.`代表的路径不同，因此建议使用 UI-PROTOTYPE 提供的函数`distPath`。
使用方法如下：
```typescript
import { distPath } from "shared/utils/path";
let svgPath = distPath('shared/assets/icon.svg');
```
