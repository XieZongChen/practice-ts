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

[匹配数组类型第一个元素类型](https://github.com/XieZongChen/practice-ts/blob/a2a0d5c2cb1a9ccc1263924d09a6cc99a32265a0/src/patternMatching.ts#L20)

[匹配数组类型最后一个元素类型](https://github.com/XieZongChen/practice-ts/blob/a2a0d5c2cb1a9ccc1263924d09a6cc99a32265a0/src/patternMatching.ts#L31)

[提取数组类型除去最后一个元素以外的类型](https://github.com/XieZongChen/practice-ts/blob/a2a0d5c2cb1a9ccc1263924d09a6cc99a32265a0/src/patternMatching.ts#L39)

[提取数组类型除去第一个元素以外的类型](https://github.com/XieZongChen/practice-ts/blob/a2a0d5c2cb1a9ccc1263924d09a6cc99a32265a0/src/patternMatching.ts#L51)

### 字符串类型

[判断字符串是否以某个前缀开头](https://github.com/XieZongChen/practice-ts/blob/a2a0d5c2cb1a9ccc1263924d09a6cc99a32265a0/src/patternMatching.ts#L61)

[判断字符串是否以某个前缀开头](https://github.com/XieZongChen/practice-ts/blob/a2a0d5c2cb1a9ccc1263924d09a6cc99a32265a0/src/patternMatching.ts#L73)

[去除字符串右侧的空格](https://github.com/XieZongChen/practice-ts/blob/a2a0d5c2cb1a9ccc1263924d09a6cc99a32265a0/src/patternMatching.ts#L89)

[去除字符串左侧的空格](https://github.com/XieZongChen/practice-ts/blob/a2a0d5c2cb1a9ccc1263924d09a6cc99a32265a0/src/patternMatching.ts#L104)

[去除字符串两侧的空格](https://github.com/XieZongChen/practice-ts/blob/a2a0d5c2cb1a9ccc1263924d09a6cc99a32265a0/src/patternMatching.ts#L116)

### 函数

[提取参数的类型](https://github.com/XieZongChen/practice-ts/blob/a2a0d5c2cb1a9ccc1263924d09a6cc99a32265a0/src/patternMatching.ts#L123)

[提取返回值的类型](https://github.com/XieZongChen/practice-ts/blob/a2a0d5c2cb1a9ccc1263924d09a6cc99a32265a0/src/patternMatching.ts#L136)

[声明类的方法时，约束其 this 类型](https://github.com/XieZongChen/practice-ts/blob/a2a0d5c2cb1a9ccc1263924d09a6cc99a32265a0/src/patternMatching.ts#L148)

[提取 this 参数的类型](https://github.com/XieZongChen/practice-ts/blob/a2a0d5c2cb1a9ccc1263924d09a6cc99a32265a0/src/patternMatching.ts#L163)

### 构造器

构造器和函数的区别是，构造器是用于创建对象的，所以可以被 new。

[约束构造器的实例类型](https://github.com/XieZongChen/practice-ts/blob/a2a0d5c2cb1a9ccc1263924d09a6cc99a32265a0/src/patternMatching.ts#L178)

[提取构造器的实例类型](https://github.com/XieZongChen/practice-ts/blob/a2a0d5c2cb1a9ccc1263924d09a6cc99a32265a0/src/patternMatching.ts#L189)

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

[在元组/数组的开头添加一个元素](https://github.com/XieZongChen/practice-ts/blob/a2a0d5c2cb1a9ccc1263924d09a6cc99a32265a0/src/restructure.ts#L17)

[按项分组合并两个数组/元组](https://github.com/XieZongChen/practice-ts/blob/a2a0d5c2cb1a9ccc1263924d09a6cc99a32265a0/src/restructure.ts#L23)

### 字符串类型

[将字符串的首字母转换为大写](https://github.com/XieZongChen/practice-ts/blob/a2a0d5c2cb1a9ccc1263924d09a6cc99a32265a0/src/restructure.ts#L39)

[将蛇形表示法（Snake Case）转换为驼峰表示法（Camel Case）](https://github.com/XieZongChen/practice-ts/blob/a2a0d5c2cb1a9ccc1263924d09a6cc99a32265a0/src/restructure.ts#L56)

[删除字符串中的指定子串](https://github.com/XieZongChen/practice-ts/blob/a2a0d5c2cb1a9ccc1263924d09a6cc99a32265a0/src/restructure.ts#L63)

### 函数类型

[为函数类型添加一个指定类型参数](https://github.com/XieZongChen/practice-ts/blob/a2a0d5c2cb1a9ccc1263924d09a6cc99a32265a0/src/restructure.ts#L78)

### 索引类型

[映射一个索引类型](https://github.com/XieZongChen/practice-ts/blob/a2a0d5c2cb1a9ccc1263924d09a6cc99a32265a0/src/restructure.ts#L91)

[把索引类型的 Key 变为大写](https://github.com/XieZongChen/practice-ts/blob/a2a0d5c2cb1a9ccc1263924d09a6cc99a32265a0/src/restructure.ts#L102)

[使用 Record 改写把索引类型的 Key 变为大写](https://github.com/XieZongChen/practice-ts/blob/a2a0d5c2cb1a9ccc1263924d09a6cc99a32265a0/src/restructure.ts#L114)

[把索引类型的值映射为只读类型](https://github.com/XieZongChen/practice-ts/blob/a2a0d5c2cb1a9ccc1263924d09a6cc99a32265a0/src/restructure.ts#L123)

[把索引类型的值映射为可选类型](https://github.com/XieZongChen/practice-ts/blob/a2a0d5c2cb1a9ccc1263924d09a6cc99a32265a0/src/restructure.ts#L132)

[把索引类型的值映射为可变类型](https://github.com/XieZongChen/practice-ts/blob/a2a0d5c2cb1a9ccc1263924d09a6cc99a32265a0/src/restructure.ts#L141)

[把索引类型的值映射为必选类型](https://github.com/XieZongChen/practice-ts/blob/a2a0d5c2cb1a9ccc1263924d09a6cc99a32265a0/src/restructure.ts#L153)

[根据类型做过滤并构造新的索引类型](https://github.com/XieZongChen/practice-ts/blob/a2a0d5c2cb1a9ccc1263924d09a6cc99a32265a0/src/restructure.ts#L162)

## 递归复用

递归是把问题分解为一系列相似的小问题，通过函数不断调用自身来解决这一个个小问题，直到满足结束条件，就完成了问题的求解。

TypeScript 类型系统不支持循环，但支持递归。当处理数量（个数、长度、层数）不固定的类型的时候，可以只处理一个类型，然后递归的调用自身处理下一个类型，直到结束条件也就是所有的类型都处理完了，就完成了不确定数量的类型编程，达到循环的效果。

### Promise 的递归复用

[提取不确定层数的 Promise 中的 value 类型第一种方式](https://github.com/XieZongChen/practice-ts/blob/a2a0d5c2cb1a9ccc1263924d09a6cc99a32265a0/src/recursiveReuse.ts#L6)

[提取不确定层数的 Promise 中的 value 类型第二种方式](https://github.com/XieZongChen/practice-ts/blob/a2a0d5c2cb1a9ccc1263924d09a6cc99a32265a0/src/recursiveReuse.ts#L24)

### 数组类型

[反转数组](https://github.com/XieZongChen/practice-ts/blob/a2a0d5c2cb1a9ccc1263924d09a6cc99a32265a0/src/recursiveReuse.ts#L34)

[查找数组中是否有指定元素](https://github.com/XieZongChen/practice-ts/blob/a2a0d5c2cb1a9ccc1263924d09a6cc99a32265a0/src/recursiveReuse.ts#L56)

[移除数组中的指定元素并构造一个新的数组返回](https://github.com/XieZongChen/practice-ts/blob/a2a0d5c2cb1a9ccc1263924d09a6cc99a32265a0/src/recursiveReuse.ts#L74)

[构造一个指定长度和类型的数组](https://github.com/XieZongChen/practice-ts/blob/a2a0d5c2cb1a9ccc1263924d09a6cc99a32265a0/src/recursiveReuse.ts#L92)

### 字符串类型

[替换字符串中的所有指定子串](https://github.com/XieZongChen/practice-ts/blob/a2a0d5c2cb1a9ccc1263924d09a6cc99a32265a0/src/recursiveReuse.ts#L106)

[将字符串字面量类型的每个字符都提取出来组成联合类型](https://github.com/XieZongChen/practice-ts/blob/a2a0d5c2cb1a9ccc1263924d09a6cc99a32265a0/src/recursiveReuse.ts#L122)

[字符串反转](https://github.com/XieZongChen/practice-ts/blob/a2a0d5c2cb1a9ccc1263924d09a6cc99a32265a0/src/recursiveReuse.ts#L134)

### 对象类型

[递归给传入 obj 的所有属性加上 Readonly](https://github.com/XieZongChen/practice-ts/blob/a2a0d5c2cb1a9ccc1263924d09a6cc99a32265a0/src/recursiveReuse.ts#L148)

## 数组长度计数

TypeScript 类型系统中没有加减乘除运算符，但是可以通过构造不同的数组然后取 length 的方式来完成数值计算，把数值的加减乘除转化为对数组的提取和构造

### 数组长度实现加减乘除

[构造一个指定长度的数组](https://github.com/XieZongChen/practice-ts/blob/a2a0d5c2cb1a9ccc1263924d09a6cc99a32265a0/src/arrayLength.ts#L6)

[实现加法](https://github.com/XieZongChen/practice-ts/blob/a2a0d5c2cb1a9ccc1263924d09a6cc99a32265a0/src/arrayLength.ts#L20)

[实现减法](https://github.com/XieZongChen/practice-ts/blob/a2a0d5c2cb1a9ccc1263924d09a6cc99a32265a0/src/arrayLength.ts#L32)

[实现乘法](https://github.com/XieZongChen/practice-ts/blob/a2a0d5c2cb1a9ccc1263924d09a6cc99a32265a0/src/arrayLength.ts#L46)

[实现除法](https://github.com/XieZongChen/practice-ts/blob/a2a0d5c2cb1a9ccc1263924d09a6cc99a32265a0/src/arrayLength.ts#L68)

### 数组长度实现计数

[字符串计数](https://github.com/XieZongChen/practice-ts/blob/a2a0d5c2cb1a9ccc1263924d09a6cc99a32265a0/src/arrayLength.ts#L84)

[比较第一个数是否比第二个大](https://github.com/XieZongChen/practice-ts/blob/a2a0d5c2cb1a9ccc1263924d09a6cc99a32265a0/src/arrayLength.ts#L98)

[构造指定长度的 Fibonacci 数列，并返回指定位置（Num）的数](https://github.com/XieZongChen/practice-ts/blob/a2a0d5c2cb1a9ccc1263924d09a6cc99a32265a0/src/arrayLength.ts#L121)
