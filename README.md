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

## ts 的类型运算

ts 可以通过泛型 `<T>` 以及下面的运算符来进行类型的运算操作。

**高级类型**：通过 `<T>` 传入类型参数，经过一系列类型运算逻辑后，返回新的类型

### 条件类型（Conditional Type）- extends ? :

```typescript
// 静态运算
type res = 1 extends 2 ? true : false; // type res = false

// 动态运算
type isTwo<T> = T extends 2 ? true: false;
type res = isTwo<1>; // type res = false
type res2 = isTwo<2>; // type res2 = true
```