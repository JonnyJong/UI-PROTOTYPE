# HTML 模板
UI-PROTOTYPE 使用 Pug 来编写 HTML 模板。  
关于 Pug 使用方法，请查阅[Pug中文网](https://www.pugjs.cn)。

## 为窗口编写 main.html
`main.html` 是窗口默认加载的 HTML 文件，根据窗口所在文件夹下`views/_main.pug`生成。
以下是一个基本示例：
```pug
doctype html
html
  head
    meta(charset="UTF-8")
    meta(name="viewport", content="width=device-width, initial-scale=1.0")
  body
```
这将会生成一个基本的 HTML 文件，可以在`views`目录下编写其他部分并使用`include`引入到`_main.pug`中。  
如果某个模板文件或某个文件夹下的模板文件只用于生成`main.html`，可以在文件名开头添加`_`。

## 共享模板
UI-PROTOTYPE 提供了一些共享的 HTML 模板，均储存在`src/shared/views`目录中。

| 文件名          | 说明   |
| --------------- | ------ |
| `_titlebar.pug` | 标题栏 |

## 使用模板
可以通过 [`Dom.layout`](./utils.md#layout) API 使用模板。

## API
这些接口只能在模板中使用。

### 函数：`config`
```typescript
function config(file: string, keys: string): any;
```
用于读取`src/shared/config`下的配置文件对应的键值，不存在时返回`undefined`。
