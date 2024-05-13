---
title: 工具
---

# 概述
UI-PROTOTYPE 提供了一些常用的工具，所有工具均位于 `src/shared/utils` 中。

# API

## dom
提供更简便的 DOM 操作方法。

## id
提供生成唯一 ID 的方法。

## math
提供额外的数学计算工具。

## path
提供路径计算工具。

## position
提供设置元素位置工具。

## timer
提供定时器工具。

## function
函数执行相关工具

### 函数
#### `run`
该函数会异步地执行目标函数，且不会抛出错误。  
```typescript
function run<T = any, Args extends Array<any> = any[]>(
  fn: any,
  ...args: Args
): Promise<T | Error>;
```
##### 参数
- `fn: Function | any` 需要执行的函数。  
- `...args: Args` 函数的参数。
##### 返回值
返回一个 `Promise` 对象。若函数成功执行，履行值为函数返回值；若函数执行失败，履行值为 `Error` 对象。

#### `runSequence`
该函数会依次执行任务队列，若发生错误，则停止执行。  
```typescript
function runSequence(
  sequence: OperationSequence,
  ignoreError: boolean
): void;
```
##### 参数
- `sequence: OperationSequence` 需要执行的任务队列。  
- `ignoreError: boolean` 是否忽略错误，默认值 `false`。

##### 返回值
无。

### 类型
#### `OperationNode`
```typescript
type OperationNode = Function | number;
```
当为 `Function` 时，表示一个函数。  
当为 `number` 时，表示一个延时时间。

#### `OperationSequence`
```typescript
type OperationSequence = OperationNode[];
```
任务队列。
