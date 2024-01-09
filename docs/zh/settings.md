---
title: 设置
---

# 概述
UI-PROTOTYPE 提供了基本的设置功能，包括自动加载、自动保存、类型检查、默认值、序列化与反序列化。

# 使用说明
## 添加/删除设置现
1. 修改`src/shared/types/settings.d.ts`中的`SettingsKeyMap`接口
2. 修改`src/main/modules/settings.ts`
   - 修改`getDefaultSettings`以设置默认值
   - 修改`Validators`以添加验证器
   - 若包含不可直接转化为 JSON 的设置现，则需在`Serializers`和`Deserializers`中添加序列化与反序列化器

## 处理保存失败
保存时可能会出现保存失败的情况，可以修改`src/main/modules/settings.ts`中`save`函数来处理错误。
例如：
```typescript
async save() {
  // ...
  let error = await writeConfig('settings', data);
  if (!error) return;
  // 在此处添加错误处理相关代码
};
```

# API
## `main/modules/settings`
### settings
#### init
```typescript
init(): Promise<void>;
```
初始化设置。

#### save
```typescript
save(): Promise<void>;
```
保存设置。

#### get
```typescript
get<T extends keyof SettingsKeyMap>(key: T): SettingsKeyMap[T];
```
获取设置项，当没有对应的设置项时返回`undefined`。

#### set
```typescript
set<T extends keyof SettingsKeyMap>(key: T, value: SettingsKeyMap[T]): boolean;
```
修改设置项，成功设置返回`undefined`，不存在该设置项时返回`'INVALID_KEY'`，值验证不通过返回`'INVALID_VALUE'`。
不建议将该函数直接暴露给插件进程。

#### reset
```typescript
reset(): void;
```
重置设置。
不建议将该函数直接暴露给插件进程。

## 初始化设置
默认情况下，设置会在`Electron.App`的`ready`事件后立即初始化。如果需要修改设置初始化的时机，请确保在使用设置项之前初始化。
