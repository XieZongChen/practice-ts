class HelloWorld {
  constructor() {
    console.log('Hello World');
  }
}

const helloWorld = new HelloWorld();

// 提取元组类型的第一个元素
type First<Tuple extends unknown[]> = Tuple extends [infer T, ...infer R]
  ? T
  : never;

type res = First<[1, 2, 3]>; // type res = 1