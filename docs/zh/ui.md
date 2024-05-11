---
title: 用户界面
---

# 概述
UI-PROTOTYPE 内置了一套常用的模块化用户界面，只需引入所需的界面即可使用。

# API
所有通用的用户界面相关文件都储存在`src/shared`，下文均以`src/shared`为工作目录。

## 窗口
该模块主要用于处理窗口事件。
| 类型     | 路径           |
| -------- | -------------- |
| 脚本文件 | `ui/window.ts` |

### initWindowEvents
```typescript
initWindowEvents(): void;
```
初始化窗口事件。

## 标题栏
| 类型      | 路径                    |
| --------- | ----------------------- |
| HTML 模板 | `views/_titlebar.pug`   |
| 样式文件  | `styles/_titlebar.styl` |
| 脚本文件  | `ui/titlebar.ts`        |

### init
```typescript
titlebar.init(): void;
```
初始化标题栏。

## 窗口背景
| 类型     | 路径                      |
| -------- | ------------------------- |
| 样式文件 | `styles/_background.styl` |
| 脚本文件 | `ui/background.ts`        |

### initMica
```typescript
initMica(): void;
```
初始化模拟的 Mica 背景。

## UI 组件
| 类型     | 路径                   |
| -------- | ---------------------- |
| 样式文件 | `styles/_components/*` |
| 脚本文件 | `ui/components.ts`     |

### initComponents
```typescript
initMica(): void;
```
按需初始化 UI 组件。

### initAllComponents
```typescript
initAllComponents(): void;
```
初始化所有 UI 组件。
