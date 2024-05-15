# 多语言支持
UI-PROTOTYPE 提供了基本的多语言功能，支持设置多个后备语言。

## 添加语言
1. 在`locales`目录下新建以语言 ID 命名的文件夹
2. 在文件夹内任意目录下创建任意后缀名为`.yml`或`.yaml`的文件
3. 至少在一个 YAML 文件中包含键名为`language`的属性，该属性值将作为该语言的名称

**注意：若创建多个 YAML 文件，将会自动进行浅合并，请确保一级键名不重复**

## 设置默认后备语言
修改`src/shared/config/fallbackLocales.json`中`locale`的值。  
越靠后的语言优先级越低。  
建议将最完整的语言设置为优先级最低的语言。  

## 设置默认语言
修改`src/shared/config/locale.json`中`locale`的值。  
默认语言用于生成`src/shared/types/locales.d.ts`定义文件，对程序运行没有影响，只用于开发时智能提示。  
建议设置包含键值最完整的语言作为默认语言。

## API
### main/ui/locale
#### 函数：`locale`
```typescript
function locale(keys: LocaleKeys): string;
```
通过键值获取对应翻译，没有找到对应翻译时返回键值。

#### 函数：`getLocaleDict`
```typescript
function getLocaleDict(): LocaleDict;
```
获取所有翻译。

#### 函数：`loadLocales`
```typescript
function loadLocales(localesList: string[]): Promise<void>;
```
根据语言列表加载翻译文件。

### shared/types/locales

#### 类型：`LocaleDict`
```typescript
type LocaleDict = { [key: string]: string | LocaleDict };
```
翻译词典。

#### 类型：`LocaleKeys`
```typescript
export type LocaleKeys = string;
```
翻译词典键值集合，编译翻译文件时自动生成。

## 其他
### 关于加载语言
加载语言时，将从优先级最低的语言开始加载，优先级较高的语言将会覆盖优先级较低的语言。  
若出现数组，会将数组作为普通的对象进行处理。  
所有的非字符串及非对象类型将会强制转换为字符串。
