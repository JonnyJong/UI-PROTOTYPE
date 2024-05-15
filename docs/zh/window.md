# 窗口
UI-PROTOTYPE 提供了更加便利的创建窗口的函数，并提供了一些预定义的功能，包括：
- 自动设置 `preload`
- 窗口图标
- 基本的窗口事件
- 窗口尺寸、位置记忆
- 自动加载 HTML
- 窗口就绪时显示

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
  let newWindow = new Window('<win_id>');
  ```

关于样式文件，请查阅[样式](./style.md)章节。  
关于 HTML 模板，请查阅[HTML 模板](./layout.md)章节。

## API
### main/ui/window

#### 函数：`initMainWindow`
```typescript
function initMainWindow(): Window;
```
初始化主窗口。  
建议尽早地初始化主窗口，提升用户体验。

#### 类：`Window`
继承自 `Electron.BrowserWindow`，经包装的窗口类，为接口 [`IWindow`](#iwindow) 的实现。

#### 类型：`WindowStateTemplate`
```typescript
type WindowStateTemplate = [
  maximized: boolean,
  width: number,
  height: number,
  x: number,
  y: number,
];
```
窗口状态模板。

#### 类型：`WindowIpcEventHandler`
```typescript
type WindowIpcEventHandler = (
  window: IWindow,
  event: string,
  ...args: any[]
) => any;
```
窗口 IPC 事件处理器。

#### 接口：`IWindowState`
窗口状态管理接口。

##### 方法：`save`
```typescript
function save(): Promise<void>;
```
保存当前窗口状态。  
通常情况下，在窗口状态改变后都能自动保存。

##### 方法：`show`
```typescript
function show(): Promise<void>;
```
根据保存的窗口状态显示窗口。  
建议只在窗口第一次显示时调用。若设置窗口自动显示，则会自动调用。

#### 接口：`IWindowControls`
窗口控件管理接口。

##### 属性：`close`
```typescript
type close = 'close' | 'hide' | 'none';
```
窗口关闭按钮。

| 值      | 说明                       |
| ------- | -------------------------- |
| `close` | 显示该按钮，点击后关闭窗口 |
| `hide`  | 显示该按钮，点击后隐藏窗口 |
| `none`  | 隐藏该按钮                 |

##### 属性：`resize`
```typescript
type resize = boolean;
```
窗口最大化/还原按钮。

##### 属性：`minimize`
```typescript
type minimize = boolean;
```
窗口最小化按钮。

#### 接口：`WindowControlsConstructorOptions`
窗口控件构建参数，与 [`IWindowControls`](#iwindowcontrols) 类似，但所有的参数都是可选的，默认参数如下：
```typescript
{
  close: 'close',
  resize: true,
  minimize: true,
}
```

#### 接口：`WindowConstructorOptions`
窗口构建参数，继承自 `Electron.BrowserWindowConstructorOptions`。

##### 属性：`autoShow`
```typescript
type autoShow = boolean;
```
可选参数，自动显示窗口，默认 `false`。  
启用后，创建窗口时默认隐藏，当窗口准备好显示后，自动显示窗口。

##### 属性：`controls`
```typescript
type controls = WindowControlsConstructorOptions;
```
可选参数，窗口控件构建参数，参考：[`WindowControlsConstructorOptions`](#windowcontrolsconstructoroptions)。

#### 接口：`IWindow`
类 [`Window`](#window) 的接口。

##### 构造函数
```typescript
function constructor(root: string, options?: WindowConstructorOptions): Window;
```

##### 静态函数：`getWindowByEvent`
```typescript
function getWindowByEvent(event: IpcMainInvokeEvent): IWindow | null;
```
通过 `IpcMainInvokeEvent` 查找对应的 `Window` 类并返回。

##### 属性：`root`
```typescript
type root = string;
```
只读属性，窗口对应的渲染进程根位置。

##### 属性：`state`
```typescript
type state = IWindowState;
```
只读属性，窗口状态管理接口。  
参考：[`IWindowState`](#iwindowstate)。

##### 属性：`controls`
```typescript
type controls = IWindowControls;
```
只读属性，窗口控件管理接口。  
参考：[`IWindowControls`](#iwindowcontrols)。
