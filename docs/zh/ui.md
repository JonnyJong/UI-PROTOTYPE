# 用户界面
UI-PROTOTYPE 内置了一套常用的模块化用户界面，只需引入所需的界面即可使用。

## API
所有通用的用户界面相关文件都储存在`src/shared`，下文均以`src/shared`为工作目录。

### 窗口
| 类型     | 路径           |
| -------- | -------------- |
| 脚本文件 | `ui/window.ts` |

该模块为渲染进程中窗口管理，主线程中管理窗口请参考：[窗口](./window.md)。

#### 函数：`initWindowEvents`
```typescript
function initWindowEvents(): void;
```
初始化窗口事件。

### 标题栏
| 类型      | 路径                    |
| --------- | ----------------------- |
| HTML 模板 | `views/_titlebar.pug`   |
| 样式文件  | `styles/_titlebar.styl` |
| 脚本文件  | `ui/titlebar.ts`        |
| 定义文件  | `types/ui.d.ts`         |

若要使用标题栏组件，需要在 HTML 模板中引入 `views/_titlebar.pug` 和 `styles/_titlebar.styl`。

#### 实例：`titlebar`
该对象为接口 [`Titlebar`](#titlebar_1) 实例。

#### 接口：`Titlebar`

##### 方法：`init`
```typescript
function titlebar.init(): void;
```
初始化标题栏。

##### 方法：`toggleButtonHidden`
```typescript
function toggleButtonHidden(id: string, hidden?: boolean): void;
```
切换标题栏上指定 ID 的按钮显示或隐藏。

##### 方法：`toggleButtonDisabled`
```typescript
function toggleButtonDisabled(id: string, disabled?: boolean): void;
```
切换标题栏上指定 ID 的按钮禁用或启用。

##### 方法：`toggleWindowControlHidden`
```typescript
function toggleWindowControlHidden(id: string, hidden?: boolean): void;
```
切换窗口右上角指定 ID 的按钮显示或隐藏。

##### 方法：`toggleWindowControlDisabled`
```typescript
function toggleWindowControlDisabled(id: string, disabled?: boolean): void;
```
切换窗口右上角上指定 ID 的按钮禁用或启用。

##### 属性：`state`
```typescript
type state = string | HTMLElement | Dom;
```
应用程序状态信息。

##### 属性：`buttons`
```typescript
type buttons = TitlebarButton[];
```
标题栏左侧按钮数组。  
参考：[`TitlebarButton`](#titlebarbutton)。

##### 属性：`searchbar`
```typescript
type searchbar = UIText | HTMLInputElement | null;
```
标题栏搜索框，允许设置为 `UIText` 或 `HTMLInputElement` 元素。设置为 `null` 时移除搜索栏。
参考：[`UIText`](#uitext)。

##### 属性：`avatar`
```typescript
type avatar = TitlebarAvatar;
```
可选参数，标题栏右侧头像按钮。  
参考：[`TitlebarAvatar`](#titlebaravatar)。

##### 属性：`windowControls`
```typescript
type windowControls = TitlebarButton[];
```
窗口右上角按钮。 
参考：[`TitlebarButton`](#titlebarbutton)。

##### 属性：`windowControlMinimize`
```typescript
type windowControlMinimize = boolean;
```
检查或设置窗口最小化按钮显示或隐藏。

##### 属性：`windowControlResize`
```typescript
type windowControlResize = boolean;
```
检查或设置窗口最大化/还原按钮显示或隐藏。

##### 属性：`windowControlClose`
```typescript
type windowControlClose = 'close' | 'hide' | 'none';
```
检查或设置窗口关闭按钮。

| 值      | 说明                       |
| ------- | -------------------------- |
| `close` | 显示该按钮，点击后关闭窗口 |
| `hide`  | 显示该按钮，点击后隐藏窗口 |
| `none`  | 隐藏该按钮                 |

#### 接口：`TitlebarButton`

##### 属性：`id`
```typescript
type id = string;
```
必要属性，按钮的 ID，应当保持唯一性。

##### 属性：`icon`
```typescript
type icon = string;
```
必要属性，按钮的图标名，按钮上不会显示任何文字，所以应当设置一个图标。  
参考：[图标](./icon.md)。

##### 属性：`action`
```typescript
type action = Function;
```
必要属性，按钮点击回调。

##### 属性：`tooltip`
```typescript
type tooltip = string;
```
可选参数，图标的工具提示，设置为 `undefined` 时移除工具提示。
参考：[`Tooltip`](#componentstooltipts)。

##### 属性：`hidden`
```typescript
type hidden = boolean;
```
可选参数，设置为 `true` 时，使按钮隐藏。

##### 属性：`disabled`
```typescript
type disabled = boolean;
```
可选参数，设置为 `true` 时，按钮禁用。

#### 接口：`TitlebarAvatar`

##### 属性：`img`
```typescript
type img = string;
```
必要属性，头像文件路径。

##### 属性：`action`
```typescript
type action = Function;
```
可选参数，头像点击回调。

##### 属性：`action`

### 窗口背景
| 类型     | 路径                      |
| -------- | ------------------------- |
| 样式文件 | `styles/_background.styl` |
| 脚本文件 | `ui/background.ts`        |

#### 函数：`initMica`
```typescript
function initMica(): void;
```
初始化模拟的 Mica 背景。  
默认不使用 `mica alt`，若修改默认行为，请修改 `config/ui.json` 中 `micaAlt` 参数。  
*注意：不稳定。*  
**已知问题：多屏幕时显示异常。**

### 多页面
| 类型     | 路径                 |
| -------- | -------------------- |
| 样式文件 | `styles/_pages.styl` |
| 脚本文件 | `ui/pages.ts`        |
| 定义文件 | `types/pages.d.ts`   |

UI-PROTOTYPE 提供一套可选的页面管理接口，可以轻松的实现多页面、历史记录、页面切换动画。

#### 事件
| 名称       | 说明                     |
| ---------- | ------------------------ |
| `open`     | 将要打开新页面时触发     |
| `back`     | 将要切换到前一页面时触发 |
| `jump`     | 将要跳转页面时触发       |
| `home`     | 将要切换到主页时触发     |
| `shortcut` | 使用快捷键切换页面时触发 |

参考：[`IPagesEvent`](#ipagesevent)。

#### 实例：`pages`
该对象为接口 [`IPages`](#ipages) 实例。

#### 接口：`IPages`

##### 方法：`init`
```typescript
function init(options?: PagesInitOptions): void;
```
初始化页面管理，推荐在定义主页后初始化。  
参考：[`PagesInitOptions`](#pagesinitoptions)，[`define`](#define)。

##### 方法：`home`
```typescript
function home(): Promise<boolean>;
```
清理历史记录并回到主页。  
当主页未定义或事件被阻止时返回 `false`。

##### 方法：`back`
```typescript
function back(): Promise<void>;
```
回到上一页面。

##### 方法：`open`
```typescript
function open(
  name: string,
  options?: any,
  animation?: PageSwitchAimationOptions
): Promise<boolean>;
```
打开新的页面。  
`name` 为要打开的页面名称。
`options` 为页面构建参数。
`animation` 为页面打开动画，参考：[`PageSwitchAimationOptions`](#pageswitchaimationoptions)。
当要打开的页面未定义或事件被阻止时返回 `false`。

##### 方法：`jump`
```typescript
function jump(index: number): Promise<boolean>;
```
跳转到指定页面。  
当 `index` 对应页面不存在或事件被阻止时返回 `false`。

##### 方法：`define`
```typescript
function define(name: string, constructor: PageConstructor): void;
```
定义一个页面。
`name` 为页面唯一名称，只能使用字母、数字、连字符和下划线。
`constructor` 为页面类，参考：[`PageConstructor`](#ipage) 和 [`IPage`](#pageconstructor)。

##### 方法：`on`
```typescript
function on<K extends keyof PagesEventMap>(
  name: K,
  listener: (event: PagesEventMap[K]) => any
): void;
```
添加一个事件监听器。  
参考：[`PagesEventMap`](#pageseventmap) 和 [`IPagesEvent`](#ipagesevent)。

##### 方法：`off`
```typescript
function off<K extends keyof PagesEventMap>(
  name: K,
  listener: (event: PagesEventMap[K]) => any
): void;
```
移除一个事件监听器。  
参考：[`PagesEventMap`](#pageseventmap) 和 [`IPagesEvent`](#ipagesevent)。

##### 属性：`history`
```typescript
type history = string[];
```
只读属性，已打开的页面名称数组。

##### 属性：`shortcutDisabled`
```typescript
type shortcutDisabled = boolean;
```
启用或禁用页面切换快捷键。

#### 接口：`IPage`
页面接口。有关页面类构造函数及静态接口：[`PageConstructor`](#pageconstructor)。

##### 方法：`onShow`
```typescript
function onShow(heroOptions?: HeroOptions): any;
```
可选方法，页面将显示时调用。  
`heroOptions` 为英雄动画参数，参考：[`HeroOptions`](#herooptions)。

##### 方法：`onHide`
```typescript
function onHide(heroOptions?: HeroOptions): any;
```
可选方法，页面将隐藏时调用。  
`heroOptions` 为英雄动画参数，参考：[`HeroOptions`](#herooptions)。

##### 方法：`onClose`
```typescript
function onClose(): any;
```
页面将关闭时调用，若页面为单例页面，此方法永远不会被调用。  
返回 `true` 将阻止页面关闭。

#### 接口：`PageConstructor`
页面构造函数及静态接口，有关页面类实例接口请参考：[`IPage`](#ipage)。

##### 构造函数
```typescript
function constructor(node: HTMLDivElement, utils: IPageUtils, options?: any): IPage;
```
页面被创建时调用，若页面为单例页面，则只调用一次。  
`node` 为页面元素实例。
`utils` 为页面工具，参考：[`IPageUtils`](#ipageutils)。
`options` 为页面构建参数。

##### 静态函数：`getLayoutOptions`
```typescript
function getLayoutOptions?(options?: any): any;
```
可选函数，页面元素创建前调用，返回值若为 `Object`，将会作为页面 HTML 模板编译参数。

##### 静态属性：`SINGLETON_INSTANCE`
```typescript
type SINGLETON_INSTANCE = boolean;
```
为 `true` 时，页面为单例页面。

##### 静态属性：`LAYOUT_TEMPLATE`
```typescript
type LAYOUT_TEMPLATE = boolean;
```
当为 `true` 时，将使用渲染线程目录下 `views/pages/<page_name>.pug` 模板构建页面元素。

#### 接口：`IPageUtils`
页面工具。

##### 方法：`close`
```typescript
function close(): void;
```
调用该方法以主动关闭页面。仅在页面为当前页面时有效。

#### 接口：`IPagesEvent`
页面事件接口。

##### 方法：`prevent`
```typescript
function prevent(): void;
```
阻止事件默认行为。

##### 属性：`target`
```typescript
type target = IPage;
```
只读属性，与该事件有关的页面实例。

##### 属性：`node`
```typescript
type node = HTMLDivElement;
```
只读属性，与该事件有关的页面元素。

##### 属性：`type`
```typescript
type type = string;
```
只读属性，事件类型。

#### 接口：`PagesEventMap`
页面事件枚举接口。

#### 接口：`PagesInitOptions`
页面管理初始化参数接口。

##### 属性：`home`
```typescript
type home = string;
```
可选参数，主页名称，默认 `home`。

##### 属性：`shortcutDisabled`
```typescript
type shortcutDisabled = boolean;
```
可选参数，启用或禁用页面切换快捷键，默认 `false`。

#### 接口：`HeroOptions`
英雄动画参数接口。  
*注意：不稳定。*

##### 属性：`node`
```typescript
type node = HTMLElement;
```
英雄动画相关元素。

##### 属性：`rect`
```typescript
type rect = DOMRect;
```
英雄动画相关元素初始位置尺寸信息。

#### 接口：`BasicPageSwitchAnimationOptions`
基本页面切换动画参数。

##### 属性：`hero`
```typescript
type hero = HeroOptions;
```
可选参数，英雄动画参数。

#### 接口：`EntrancePageSwitchAnimationOptions`
参数 `type` 固定为 `entrance`。

##### 属性：`from`
```typescript
type from = 'bottom' | 'right' | 'left' | 'top';
```
可选参数，动画进入方向，默认 `bottom`。

#### 接口：`SlidePageSwitchAnimationOptions`
参数 `type` 固定为 `slide`。

##### 属性：`from`
```typescript
type from = 'right' | 'left' | 'bottom' | 'top';
```
可选参数，动画进入方向，默认 `right`。

#### 接口：`DrillPageSwitchAnimationOptions`
参数 `type` 固定为 `drill`。

##### 属性：`from`
```typescript
type from = 'in' | 'out';
```
可选参数，动画进入方向，默认 `in`。

#### 接口：`FadePageSwitchAnimationOptions`
参数 `type` 固定为 `fade`。

##### 属性：`outroDuration`
```typescript
type outroDuration = number;
```
可选参数，淡出时长，单位毫秒，默认 `100`。

##### 属性：`introDuration`
```typescript
type introDuration = number;
```
可选参数，淡入时长，单位毫秒，默认 `100`。

##### 属性：`introWhen`
```typescript
type introWhen = number;
```
可选参数，淡入开始时间，单位毫秒，默认 `0`。

#### 接口：`PageSwitchAimationOptions`
页面切换动画参数。  
由基本参数 [`BasicPageSwitchAnimationOptions`](#basicpageswitchanimationoptions) 和其他切换动画参数组成。  
默认切换动画类型 `entrance`。  
若要修改默认动画类型，请修改 `config/ui.json` 中参数 `defaultPageSwitchAnimation`。

### UI 组件
| 类型         | 路径                   |
| ------------ | ---------------------- |
| 样式文件     | `styles/_components/*` |
| 脚本文件     | `ui/components.ts`     |
| 组件脚本文件 | `components/*`         |

#### 函数：`initComponents`
```typescript
function initComponents(...componentNames: ComponentNameMap[]): void;
```
按需初始化 UI 组件。

#### 函数：`initAllComponents`
```typescript
function initAllComponents(): void;
```
初始化所有 UI 组件。

#### 类：`UILang`
多语言元素。根据键名自动设置翻译文本。  
模板：
```pug
ui-lang app.name
```
运行时：
```html
<ui-lang>UI-PROTOTYPE</ui-lang>
```

##### 方法：`update`
```typescript
function update(): void;
```
强制更新翻译文本。

##### 属性：`key`
```typescript
type key = string;
```
翻译键名。

#### 类：`UIScroll`
滚动条元素。
```pug
#scroll-view
ui-scroll(target="#scroll-view")
ui-scroll(target="#scroll-view" horizontal)
```

#### 属性：`target`
```typescript
type target = HTMLElement;
```
绑定的滚动视图元素。

#### 属性：`horizontal`
```typescript
type horizontal = boolean;
```
检索或设置滚动条为横向滚动条，`false` 时为纵向滚动条。

#### 类：`UIText`
输入框元素。
```pug
ui-text(multiLine disabled readonly header="<b>Header</b>" placeholder="<ui-lang>app.name</ui-lang>" value="Value")
```

##### 静态方法：`generateClearButton`
```typescript
function generateClearButton(
  text: UIText,
  btnId = 'clear'
): {
  button: UITextButton;
  handler: Function;
};
```
为输入框元素创建一个自动隐藏的清空按钮，并自动绑定对应事件。  

##### 方法：`toggleButtonHidden`
```typescript
function toggleButtonHidden(id: string, force?: boolean): void;
```
切换指定 ID 的按钮显示或隐藏。

##### 方法：`toggleButtonDisabled`
```typescript
function toggleButtonDisabled(id: string, force?: boolean): void;
```
切换指定 ID 的按钮启用或禁用。

##### 属性：`multiLine`
```typescript
type multiLine = boolean;
```
查询或设置输入框为单行或多行。

##### 属性：`disabled`
```typescript
type disabled = boolean;
```
查询或设置输入框禁用或启用。

##### 属性：`readonly`
```typescript
type readonly = boolean;
```
查询或设置输入框只读模式。

##### 属性：`header`
```typescript
type header = string;
```
查询或设置输入框头部。

##### 属性：`placeholder`
```typescript
type placeholder = string;
```
查询或设置输入框占位符。

##### 属性：`value`
```typescript
type value = string;
```
查询或设置输入框内容。

##### 属性：`autoSuggest`
```typescript
type autoSuggest = (string | UITextSuggest)[] | AutoSuggest;
```
查询或设置输入框自动补全回调或自动补全内容。  
参考：[`UITextSuggest`](#uitextsuggest)、[`AutoSuggest`](#autosuggest_1)。

##### 属性：`isSelectingSuggest`
```typescript
type isSelectingSuggest = boolean;
```
只读属性，查询用户是否正在选择自动补全。

##### 属性：`leftButtons`
```typescript
type leftButtons = UITextButton[]
```
查询或设置输入框左侧按钮。  
参考：[`UITextButton`](#uitextbutton)。

##### 属性：`rightButtons`
```typescript
type rightButtons = UITextButton[]
```
查询或设置输入框右侧按钮。  
参考：[`UITextButton`](#uitextbutton)。

##### 类型：`AutoSuggest`
```typescript
type AutoSuggest = (value: string) => (string | UITextSuggest)[];
```
接受用户输入的文本，动态生成自动补全或建议。

##### 接口：`UITextSuggest`

###### 属性：`label`
```typescript
type label = string | HTMLElement | Dom;
```
建议内容。

###### 属性：`text`
```typescript
type text = string;
```
可选参数，自动补全内容。

###### 属性：`action`
```typescript
type action = Function;
```
可选参数，选择建议时的回调函数。

##### 接口：`UITextButton`

###### 属性：`icon`
```typescript
type icon = string;
```
按钮图标。  
参考：[图标](./icon.md)。

###### 属性：`action`
```typescript
type action = (text: UIText, id?: string) => any;
```
按钮被点击时的回调函数。  
`id` 为按钮 ID。

###### 属性：`tooltip`
```typescript
type tooltip = string;
```
可选参数，按钮的工具提示。

###### 属性：`id`
```typescript
type id = string;
```
可选参数，按钮 ID。

###### 属性：`disabled`
```typescript
type disabled = boolean;
```
可选参数，禁用按钮。

###### 属性：`hidden`
```typescript
type hidden = boolean;
```
可选参数，隐藏按钮。

#### 模块：`components\tooltip.ts`
工具提示模块。  
该模块没有导出，只需引入该模块，就可以使用工具提示。
```pug
div(tooltip="HTML <i>Text</i> here.")
```
