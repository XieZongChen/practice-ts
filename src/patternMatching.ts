/**
 * 模式匹配提取练习
 */
(function () {
  /**
   * js 中的模式匹配，`$1` 可以取到提取的子组
   */
  const jsRes = 'abc'.replace(/a(b)c/, '$1,$1,$1'); // 'b,b,b'
  console.log(jsRes);

  /**
   * 提取 `Promise<T>` 的 `T` 类型
   * - 通过 extends 对传入的类型参数 P 做模式匹配，其中值的类型是需要提取的
   * - 通过 infer 声明一个局部变量 Value 来保存，如果匹配，就返回匹配到的 Value，否则就返回 never 代表没匹配到
   */
  type GetValueType<P> = P extends Promise<infer Value> ? Value : never;
  type GetValueRes = GetValueType<Promise<'test'>>;

  /**
   * 提取数组类型第一个元素的类型
   * - 类型参数 Arr 通过 extends 约束为只能是数组类型，unknown 表示数组元素可以是任何值
   * - 对 Arr 做模式匹配，把我们要提取的第一个元素的类型放到通过 infer 声明的 First 局部变量里，
   *   后面的元素可以是任何类型，用 unknown 接收，然后把局部变量 First 返回
   */
  type GetFirst<Arr extends unknown[]> = Arr extends [infer First, ...unknown[]]
    ? First
    : never;
  type GetFirstRes = GetFirst<[1, 2, 3]>;

  /**
   * 提取数组类型最后一个元素的类型
   */
  type GetLast<Arr extends unknown[]> = Arr extends [...unknown[], infer Last]
    ? Last
    : never;
  type GetLastRes = GetLast<[1, 2, 3]>;

  /**
   * 提取数组类型最后一个元素的类型
   * - 如果是空数组，就直接返回，否则匹配剩余的元素，放到 infer 声明的局部变量 Rest 里，返回 Rest
   */
  type PopArr<Arr extends unknown[]> = Arr extends []
    ? []
    : Arr extends [...infer Rest, unknown]
    ? Rest
    : never;
  type PopArrRes = PopArr<[1, 2, 3]>;
  type PopArrRes2 = PopArr<[]>;
})();
