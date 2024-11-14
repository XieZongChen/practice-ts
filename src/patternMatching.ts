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
})();
