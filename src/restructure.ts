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
})();
