/**
 * 递归复用练习
 */
(function () {
  /**
   * 提取不确定层数的 Promise 中的 value 类型第一种方式
   * - 类型参数 P 是待处理的 Promise，通过 extends 约束为 Promise 类型，value 类型不确定，设为 unknown
   * - 每次只处理一个类型的提取，也就是通过模式匹配提取出 value 的类型到 infer 声明的局部变量 ValueType 中
   * - 判断如果 ValueType 依然是 Promise类型，就递归处理
   * - 结束条件就是 ValueType 不为 Promise 类型，那就处理完了所有的层数，返回这时的 ValueType
   */
  type DeepPromiseValueType<P extends Promise<unknown>> = P extends Promise<
    infer ValueType
  >
    ? ValueType extends Promise<unknown>
      ? DeepPromiseValueType<ValueType>
      : ValueType
    : never;
  type DeepPromiseValueTypeRes = DeepPromiseValueType<
    Promise<Promise<Promise<string>>>
  >;
})();
