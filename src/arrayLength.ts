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
})();
