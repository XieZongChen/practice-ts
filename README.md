# practice-ts

练习 ts 的地方，包括一些类型体操以及测试 ts 编译

# 笔记

## ts 的类型

基础类型：number、boolean、string、object、bigint、symbol、undefined、null

包装类型：Number、Boolean、String、Object、Symbol

复合类型：class、Array、Tuple（元组）、Interface（接口）、Enum（枚举）

特殊类型：字面量类型、void、never、any、unknown

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
    age: 18
}

// 描述对象的索引签名 
interface IPerson {
    [prop: string]: string | number;
}
const obj:IPerson = {};
obj.name = 'guang';
obj.age = 18;

// 描述函数
interface SayHello {
    (name: string): string;
}

const func: SayHello = (name: string) => {
    return 'hello,' + name
}

// 描述构造器
interface PersonConstructor {
    new (name: string, age: number): IPerson;
}

function createPerson(ctor: PersonConstructor):IPerson {
    return new ctor('guang', 18);
}

```