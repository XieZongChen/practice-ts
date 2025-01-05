/**
 * 数组长度计数
 */
(function () {
  /**
   * 构造一个指定长度的数组
   * - 类型参数 Length 是要构造的数组的长度。类型参数 Ele 是数组元素，默认为 unknown。类型参数 Arr 为构造出的数组，默认是 []
   * - 如果 Arr 的长度到达了 Length，就返回构造出的 Arr，否则继续递归构造
   */
  type BuildArray<
    Length extends number,
    Ele = unknown,
    Arr extends unknown[] = []
  > = Arr['length'] extends Length
    ? Arr
    : BuildArray<Length, Ele, [...Arr, Ele]>;
  type BuildArrayRes = BuildArray<6, string>;

  /**
   * 实现加法
   * - 类型参数 Num1 和 Num2 是要相加的两个数
   * - 使用 BuildArray 构造出要相加数量长度的数组，将其合并到一个数组里
   * - 这个数组的长度即为两数相加的结果
   */
  type Add<Num1 extends number, Num2 extends number> = [
    ...BuildArray<Num1>,
    ...BuildArray<Num2>
  ]['length'];
  type AddRes = Add<3, 4>;

  /**
   * 实现减法
   * - 类型参数 Num1、Num2 分别是被减数和减数，通过 extends 约束为 number
   * - 构造 Num1 长度的数组，通过模式匹配提取出 Num2 长度个元素，剩下的放到 infer 声明的局部变量 Rest 里
   * - 取 Rest 的长度返回，就是减法的结果
   */
  type Subtract<
    Num1 extends number,
    Num2 extends number
  > = BuildArray<Num1> extends [...arr1: BuildArray<Num2>, ...arr2: infer Rest]
    ? Rest['length']
    : never;
  type SubtractRes = Subtract<11, 7>;

  /**
   * 实现乘法
   * - 类型参数 Num1 和 Num2 分别是被乘数和乘数
   * - 因为乘法是多个加法结果的累加，我们加了一个类型参数 ResultArr 来保存中间结果，默认值是 []，相当于从 0 开始加
   * - 每加一次就把 Num2 减一，直到 Num2 为 0，就代表加完了
   * - 加的过程就是往 ResultArr 数组中放 Num1 个元素
   * - 这样递归的进行累加，也就是递归的往 ResultArr 中放元素
   * - 最后取 ResultArr 的 length 就是乘法的结果
   */
  type Multiplication<
    Num1 extends number,
    Num2 extends number,
    ResultArr extends unknown[] = []
  > = Num2 extends 0
    ? ResultArr['length']
    : Multiplication<
        Num1,
        Subtract<Num2, 1>,
        [...BuildArray<Num1>, ...ResultArr]
      >;
  type MultiplicationRes = Multiplication<3, 4>;

  /**
   * 实现除法
   * - 类型参数 Num1 和 Num2 分别是被减数和减数
   * - 类型参数 CountArr 是用来记录减了几次的累加数组
   * - 如果 Num1 减到了 0 ，那么这时候减了几次就是除法结果，也就是 CountArr['length']
   * - 否则继续递归的减，让 Num1 减去 Num2，并且 CountArr 多加一个元素代表又减了一次
   */
  type Divide<
    Num1 extends number,
    Num2 extends number,
    CountArr extends unknown[] = []
  > = Num1 extends 0
    ? CountArr['length']
    : Divide<Subtract<Num1, Num2>, Num2, [unknown, ...CountArr]>;
  type DivideRes = Divide<12, 4>;

  /**
   * 字符串计数
   * - 类型参数 Str 是待处理的字符串。类型参数 CountArr 是做计数的数组，默认值 [] 代表从 0 开始
   * - 每次通过模式匹配提取去掉一个字符之后的剩余字符串，并且往计数数组里多放入一个元素。递归进行取字符和计数
   * - 如果模式匹配不满足，代表计数结束，返回计数数组的长度 CountArr['length']
   */
  type StrLen<
    Str extends string,
    CountArr extends unknown[] = []
  > = Str extends `${string}${infer Rest}`
    ? StrLen<Rest, [...CountArr, unknown]>
    : CountArr['length'];
  type StrLenRes = StrLen<'test'>;
})();
