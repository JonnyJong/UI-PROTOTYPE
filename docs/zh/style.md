# 样式
UI-PROTOTYPE 使用 Stylus 来编写 css。  
关于 Stylus 的使用方法，请查阅[Stylus 中文网](https://www.stylus-lang.cn)。

## 为窗口编写样式文件
虽然不是必须，但依旧建议将相关的 Stylus 模板存放在在窗口所在文件夹下`stylus`中。  
如果一个 Stylus 模板或一个文件夹下的 Stylus 模板只作为其他 Stylus 模板的引用，建议在其文件名开头添加`_`。

## 编写通用的样式文件
UI-PROTOTYPE 默认将通用的样式文件存放在`src/shared/styles`，其规则与窗口的样式文件相同。

以下是 UI-PROTOTYPE 内置的样式文件：

| 文件名           | 说明   |
| ---------------- | ------ |
| `_titlebar.styl` | 标题栏 |

## API
这些接口只能在模板中使用。

### 函数：`config`
```typescript
function config(file: string, keys: string): any;
```
用于读取`src/shared/config`下的配置文件对应的键值，不存在时返回`undefined`。
