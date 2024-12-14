/**
 * 重新构造练习
 */
(function () {
  type tuple = [1, 2, 3];

  /**
   * 在元组/数组的末尾添加一个元素
   * - 类型参数 Arr 是要修改的数组/元组类型，元素的类型任意，也就是 unknown
   * - 类型参数 Ele 是添加的元素的类型
   * - 通过 ... 运算符把 Arr 和 Ele 连接起来，返回新的数组/元组类型
   */
  type Push<Arr extends unknown[], Ele> = [...Arr, Ele];
  type PushRes = Push<tuple, 4>;

  /**
   * 在元组/数组的开头添加一个元素
   */
  type Unshift<Arr extends unknown[], Ele> = [Ele, ...Arr];
  type UnshiftRes = Unshift<[1, 2, 3], 0>;

  /**
   * 按项分组合并两个数组/元组
   * - 类型参数 One、Other 声明为 unknown[]，也就是元素个数任意，类型任意的数组
   * - 每次提取 One 和 Other 的第一个元素 OneFirst、OtherFirst，剩余的放到 OneRest、OtherRest 里
   * - 用 OneFirst、OtherFirst 构造成新的元组的一个元素，剩余元素继续递归处理 OneRest、OtherRest
   */
  type Zip<One extends unknown[], Other extends unknown[]> = One extends [
    infer OneFirst,
    ...infer OneRest
  ]
    ? Other extends [infer OtherFirst, ...infer OtherRest]
      ? [[OneFirst, OtherFirst], ...Zip<OneRest, OtherRest>] // 这里用了递归的思想
      : []
    : [];
  type ZipRes = Zip<[1, 2, 3, 4], ['1', '2', '3', '4']>;
})();
