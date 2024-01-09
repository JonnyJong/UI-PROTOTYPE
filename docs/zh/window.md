---
title: 窗口
---

# 概述
UI-PROTOTYPE 提供了更加便利的创建窗口的函数，并提供了一些预定义的功能，包括：
- 自动设置 `preload`
- 窗口图标
- 基本的窗口事件
- 窗口尺寸、位置记忆
- 自动加载 HTML
- 窗口就绪时显示

# 使用说明
## 添加基本窗口事件
修改`src/main/ui/window.ts`中的`IpcEventHandlers`常量，参考：
```typescript
const IpcEventHandlers: { [scope: string]: WindowIpcEventHandler } = {
  _scope_: (window, event)=>{
    switch (event) {
      case 'event_name':
        // Do something...
        break;
    }
  },
};
```
对于渲染进程，使用如下方式触发事件：
```typescript
ipcRenderer.send('_scope_:event_name');
```

这些事件对所有窗口有效，因此建议只设置通用的事件。

## 修改窗口默认背景色
修改`src/shared/config/default.json`中`windowBackground`的值，目前可以设置亮色模式和暗色模式的背景色。

## 修改主窗口配置
修改`src/main/ui/window.ts`中的`initMainWindow`函数，对于主窗口的事件也可以在这里设置。

## 新增窗口
> 下文中，`<win_id>`为窗口 ID。

- 在`src/renderer`目录下创建名为`<win_id>`的目录
- 在该目录下创建如下的文件结构
  ```
  - <win_id>/
    - assets/     # 资源文件（可选）
    - styles/     # 样式文件（可选）
    - types/      # 定义文件（可选）
    - views/      # HTML 模板
      - _main.pug  # 用于生成窗口的 main.html
    - main.ts     # preload
  ```
- 在主线程中使用如下方式启动该窗口：
  ```typescript
  let newWindow = initWindow({
    root: '<win_id>'
    autoShow: true
  });
  ```

关于样式文件，请查阅[样式](../style)章节。
关于 HTML 模板，请查阅[HTML 模板](../layout)章节。

# API
## `main/ui/window`

### initWindow
```typescript
initWindow(options: WindowInitOptions): BrowserWindow;
```
初始化窗口。

`options.root`参数以`src/renderer`为起点。

### initMainWindow
```typescript
initMainWindow(): BrowserWindow;
```
初始化主窗口。

建议尽早地初始化主窗口，提升用户体验。
