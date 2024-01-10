---
title: HTML 模板
---

# 概述
UI-PROTOTYPE 使用 Pug 来编写 HTML 模板。  
关于 Pug 使用方法，请查阅[Pug中文网](https://www.pugjs.cn)。

# 使用说明
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

## 使用模板
TODO...

# API
## config
*该函数仅限 HTML 模板中使用。*
```typescript
config(file: string, keys: string): any;
```
用于读取`src/shared/config`下的配置文件对应的键值，不存在时返回`undefined`。
