---
title: 事件
---

# 概述
UI-PROTOTYPE 在 `src/main/ui/event.ts` 中统一管理全局的异步事件。

# 使用说明
## 默认提供的事件
### locale:get
为渲染线程提供当前语言词典。

### win:controls
提供渲染线程中标题栏初始化窗口控件参数。

### win:root
获取窗口根路径

### os:getScreenSize
提供渲染线程中获取屏幕尺寸参数。

### os:getWallpaperPath
提供渲染线程中获取桌面壁纸路径参数。

### dev
提供渲染线程获取开发模式参数。
