# practice-ts

练习 ts 的地方，包括一些类型体操以及测试 ts 编译

# 笔记

## ts 的类型

**基础类型**：`number`、`boolean`、`string`、`object`、`bigint`、`symbol`、`undefined`、`null`

**包装类型**：`Number`、`Boolean`、`String`、`Object`、`Symbol`

**复合类型**：`class`、`Array`、Tuple（元组）、`interface`（接口）、`enum`（枚举）、字面量类型

**特殊类型**：`void`、`never`、`any`、`unknown`

**属性修饰**：`?`（可选）、`readonly`

### 接口类型示例

```typescript
// 描述对象
interface IPerson {
  name: string;
  age: number;
}

class Person implements IPerson {
  name: string;
  age: number;
}

const obj: IPerson = {
  name: 'guang',
  age: 18,
};

// 描述对象的索引签名
interface IPerson {
  [prop: string]: string | number;
}

const obj: IPerson = {};
obj.name = 'guang';
obj.age = 18;

// 描述函数
interface SayHello {
  (name: string): string;
}

const func: SayHello = (name: string) => {
  return 'hello,' + name;
};

// 描述构造器
interface PersonConstructor {
  new (name: string, age: number): IPerson;
}

function createPerson(ctor: PersonConstructor): IPerson {
  return new ctor('guang', 18);
}
```

### 字面量类型示例

```typescript
// 普通字符串字面量
const a: 'aaa' = 'aaa';

// 模板字面量
function func(str: `#${string}`) {
  // 接受参数为以 # 开头，后面是任意 string 的字符串
}

func('aaa'); // 报错
func('#aaa'); // 正确
```

### 特殊类型的含义区别

- **never** 代表不可达，比如函数抛异常的时候，返回值就是 `never`。
- **void** 代表空，可以是 `undefined` 或 `never`。
- **any** 是任意类型，任何类型都可以赋值给它，它也可以赋值给任何类型（除了 `never`）。
- **unknown** 是未知类型，任何类型都可以赋值给它，但是它不可以赋值给别的类型。

### 属性修饰示例

```typescript
// 对象的属性修饰
interface IPerson {
  readonly name: string;
  age?: number;
}

// 元组的属性修饰
type tuple = [string, number?];

// 函数参数的属性修饰，可选属性可以用 = 设置默认值
function func(str?: string = '1') {}
```

### 类型的 “局部变量”

TypeScript 类型系统支持 3 种可以声明任意类型的变量：`type`、`infer` 和类型参数

`type` 叫做类型别名，其实就是声明一个变量存储某个类型：

```typescript
type ttt = Promise<number>;
```

`infer` 用于类型的提取，然后存到一个变量里，相当于局部变量：

```typescript
type GetValueType<P> = P extends Promise<infer Value> ? Value : never;
```

类型参数用于接受具体的类型，在类型运算中也相当于局部变量：

```typescript
type isTwo<T> = T extends 2 ? true : false;
```

## ts 的类型运算

ts 可以通过泛型 `<T>` 以及下面的运算符来进行类型的运算操作。

**高级类型**：通过 `<T>` 传入类型参数，经过一系列类型运算逻辑后，返回新的类型

### 条件（extends ? :）

**注意**：单独的 `extends` 可以用做约束（继承），只有和 `? :` 一起使用时才做条件

```typescript
// 静态运算
type res = 1 extends 2 ? true : false; // type res = false

// 动态运算
type isTwo<T> = T extends 2 ? true : false;
type res = isTwo<1>; // type res = false
type res2 = isTwo<2>; // type res2 = true
```

### 推导（infer）

提取类型的一部分

```typescript
/**
 * 提取元组类型的第一个元素
 * - `Tuple extends unknown[]` 约束泛型只能为任意元素类型的数组类型
 * - `[infer T, ...infer R]` 表示将元组第一个元素提取为 T，剩下的元素提取为 R
 * - 条件判断如果能提取出内容，则返回 T 类型，否则返回 never 类型
 */
type First<Tuple extends unknown[]> = Tuple extends [infer T, ...infer R]
  ? T
  : never;

type res = First<[1, 2, 3]>; // type res = 1
```

### 联合（ | ）

联合类型（Union）类似 js 里的或运算符 |，但是作用于类型，代表类型可以是几个类型之一

```typescript
type Union = 1 | 2 | 3;
```

### 交叉（ & ）

交叉类型（Intersection）类似 js 中的与运算符 &，但是作用于类型，代表对类型做合并

```typescript
type ObjType = { a: number } & { c: boolean };

type res = { a: number; c: boolean } extends ObjType ? true : false; // type res = true

// 注意：同一类型可以合并，不同的类型没法合并，会被舍弃（never）
type res2 = 'aaa' & 222; // type res2 = never
```

### 映射类型、索引查询、索引访问

**映射类型** 可以对对象、class 这种索引类型的 key、value 做出修改

```typescript
type MapType<T> = {
  [Key in keyof T]?: T[Key];
};
```

- `keyof T` 是查询索引类型中所有的索引，叫做 **索引查询**
- `T[Key]` 是取索引类型某个索引的值，叫做 **索引访问**

### 遍历（in）

in 是用于遍历联合类型的运算符

```typescript
// 把一个索引类型的值变成 3 个元素的数组
type MapType<T> = {
  [Key in keyof T]: [T[Key], T[Key], T[Key]];
};

type res = MapType<{ a: 1; b: 2 }>; // type res = { a: [1, 1, 1]; b: [2, 2, 2]; }
```

### 重映射（as）

```typescript
// 将遍历中的示例结果的 key 重映射为别的
type MapType<T> = {
  [Key in keyof T as `${Key & string}${Key & string}${Key & string}`]: [
    T[Key],
    T[Key],
    T[Key]
  ];
};

type res = MapType<{ a: 1; b: 2 }>; // type res = { aaa: [1, 1, 1]; bbb: [2, 2, 2]; }
```

**注意**：因为索引类型（对象、`class` 等）可以用 `string`、`number` 和 `symbol` 作为 key，所以上面示例 `keyof T` 取出的索引就是 `string | number | symbol` 的联合类型。`Key & string` 中使用 `&` 和 `string` 取交叉部分就可以只剩下 `string` 了（**交叉类型会把同一类型做合并，不同类型舍弃**）。

## 模式匹配

**Typescript 类型的模式匹配** 是通过 extends 对类型参数做匹配，结果保存到通过 infer 声明的局部类型变量里，之后可以从这个局部变量拿到类型做各种后续处理

[js 中的模式匹配](https://github.com/XieZongChen/practice-ts/blob/a2a0d5c2cb1a9ccc1263924d09a6cc99a32265a0/src/patternMatching.ts#L6)

[ts 中常规模式匹配示例](https://github.com/XieZongChen/practice-ts/blob/133bfedbeb1d70a0c8f3039932c5375a8b73663d/src/patternMatching.ts#L12)

### 数组类型

#### 匹配第一个元素

[匹配数组类型第一个元素类型示例](https://github.com/XieZongChen/practice-ts/blob/a2a0d5c2cb1a9ccc1263924d09a6cc99a32265a0/src/patternMatching.ts#L20)

#### 匹配最后一个元素

[匹配数组类型最后一个元素类型示例](https://github.com/XieZongChen/practice-ts/blob/a2a0d5c2cb1a9ccc1263924d09a6cc99a32265a0/src/patternMatching.ts#L31)

#### 匹配数组类型除去最后一个元素以外的类型

[提取数组类型除去最后一个元素以外的类型](https://github.com/XieZongChen/practice-ts/blob/a2a0d5c2cb1a9ccc1263924d09a6cc99a32265a0/src/patternMatching.ts#L39)

#### 匹配数组类型除去第一个元素以外的类型

[提取数组类型除去第一个元素以外的类型](https://github.com/XieZongChen/practice-ts/blob/a2a0d5c2cb1a9ccc1263924d09a6cc99a32265a0/src/patternMatching.ts#L51)

### 字符串类型

#### 判断字符串是否以某个前缀开头

[判断字符串是否以某个前缀开头](https://github.com/XieZongChen/practice-ts/blob/a2a0d5c2cb1a9ccc1263924d09a6cc99a32265a0/src/patternMatching.ts#L61)

#### 替换指定字符串

[判断字符串是否以某个前缀开头](https://github.com/XieZongChen/practice-ts/blob/a2a0d5c2cb1a9ccc1263924d09a6cc99a32265a0/src/patternMatching.ts#L73)

#### 去掉空格

[去除字符串右侧的空格](https://github.com/XieZongChen/practice-ts/blob/a2a0d5c2cb1a9ccc1263924d09a6cc99a32265a0/src/patternMatching.ts#L89)

[去除字符串左侧的空格](https://github.com/XieZongChen/practice-ts/blob/a2a0d5c2cb1a9ccc1263924d09a6cc99a32265a0/src/patternMatching.ts#L104)

[去除字符串两侧的空格](https://github.com/XieZongChen/practice-ts/blob/a2a0d5c2cb1a9ccc1263924d09a6cc99a32265a0/src/patternMatching.ts#L116)

### 函数

#### 提取参数的类型

[提取参数的类型](https://github.com/XieZongChen/practice-ts/blob/a2a0d5c2cb1a9ccc1263924d09a6cc99a32265a0/src/patternMatching.ts#L123)

#### 提取返回值的类型

[提取返回值的类型](https://github.com/XieZongChen/practice-ts/blob/a2a0d5c2cb1a9ccc1263924d09a6cc99a32265a0/src/patternMatching.ts#L136)

#### 提取 this 参数的类型

[声明类的方法时，约束其 this 类型](https://github.com/XieZongChen/practice-ts/blob/a2a0d5c2cb1a9ccc1263924d09a6cc99a32265a0/src/patternMatching.ts#L148)

[提取 this 参数的类型](https://github.com/XieZongChen/practice-ts/blob/a2a0d5c2cb1a9ccc1263924d09a6cc99a32265a0/src/patternMatching.ts#L163)

### 构造器

构造器和函数的区别是，构造器是用于创建对象的，所以可以被 new。

#### 约束构造器的实例类型

[约束构造器的实例类型](https://github.com/XieZongChen/practice-ts/blob/a2a0d5c2cb1a9ccc1263924d09a6cc99a32265a0/src/patternMatching.ts#L178)

[提取构造器的实例类型](https://github.com/XieZongChen/practice-ts/blob/a2a0d5c2cb1a9ccc1263924d09a6cc99a32265a0/src/patternMatching.ts#L189)

#### 提取构造器的参数类型

[提取构造器的参数类型](https://github.com/XieZongChen/practice-ts/blob/a2a0d5c2cb1a9ccc1263924d09a6cc99a32265a0/src/patternMatching.ts#L200)

### 索引类型

索引类型也同样可以用模式匹配提取某个索引的值的类型，比如 React 的 index.d.ts 里的 `PropsWithRef` 的高级类型，就是通过模式匹配提取了 ref 的值的类型：

![image](https://github.com/user-attachments/assets/4deca61d-83bc-4145-aaa0-df59dbd70a3a)

[提取索引类型值的类型](https://github.com/XieZongChen/practice-ts/blob/a2a0d5c2cb1a9ccc1263924d09a6cc99a32265a0/src/patternMatching.ts#L213)

## 重新构造

**TypeScript 的 type、infer、类型参数声明的变量都不能修改，想对类型做各种变换产生新的类型就需要重新构造**

数组、字符串、函数等类型的重新构造比较简单。而索引类型，也就是多个元素的聚合类型的重新构造复杂一些，涉及到了映射类型的语法。

### 数组类型

[在元组/数组的末尾添加一个元素](https://github.com/XieZongChen/practice-ts/blob/a2a0d5c2cb1a9ccc1263924d09a6cc99a32265a0/src/restructure.ts#L8)
