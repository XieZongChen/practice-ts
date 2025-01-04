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
  type DeepPromiseValueType1<P extends Promise<unknown>> = P extends Promise<
    infer ValueType
  >
    ? ValueType extends Promise<unknown>
      ? DeepPromiseValueType1<ValueType>
      : ValueType
    : never;
  type DeepPromiseValueTypeRes1 = DeepPromiseValueType1<
    Promise<Promise<Promise<string>>>
  >;

  /**
   * 提取不确定层数的 Promise 中的 value 类型第二种方式
   */
  type DeepPromiseValueType2<T> = T extends Promise<infer ValueType>
    ? DeepPromiseValueType2<ValueType>
    : T;
  type DeepPromiseValueTypeRes2 = DeepPromiseValueType2<
    Promise<Promise<Promise<string>>>
  >;

  /**
   * 反转数组
   * - 类型参数 Arr 为待处理的数组类型，元素类型不确定，也就是 unknown
   * - 每次只处理一个元素的提取，放到 infer 声明的局部变量 First 里，剩下的放到 Rest 里
   * - 用 First 作为最后一个元素构造新数组，其余元素递归的取
   * - 结束条件就是取完所有的元素，也就是不再满足模式匹配的条件，这时候就返回 Arr
   */
  type ReverseArr<Arr extends unknown[]> = Arr extends [
    infer First,
    ...infer Rest
  ]
    ? [...ReverseArr<Rest>, First]
    : Arr;
  type ReverseArrRes = ReverseArr<[1, 2, 3]>;

  /**
   * 判断两个类型是否相等
   * - 如果两个类型互为子类型，则说明它们是相等的
   */
  type IsEqual<A, B> = (A extends B ? true : false) &
    (B extends A ? true : false);

  /**
   * 查找数组中是否有指定元素
   * - 类型参数 Arr 是待查找的数组类型，元素类型任意，也就是 unknown。FindItem 是待查找的元素类型
   * - 每次提取一个元素到 infer 声明的局部变量 First 中，剩余的放到局部变量 Rest
   * - 判断 First 是否是要查找的元素，也就是和 FindItem 相等，是的话就返回 true，否则继续递归判断下一个元素
   * - 直到结束条件也就是提取不出下一个元素，这时返回 false
   */
  type Includes<Arr extends unknown[], FindItem> = Arr extends [
    infer First,
    ...infer Rest
  ]
    ? IsEqual<First, FindItem> extends true
      ? true
      : Includes<Rest, FindItem>
    : false;
  type IncludesRes1 = Includes<[1, 2, 3], 2>;
  type IncludesRes2 = Includes<[1, 2, 3], 4>;

  /**
   * 移除数组中的指定元素并构造一个新的数组返回
   * - 类型参数 Arr 是待处理的数组，元素类型任意，也就是 unknown[]。类型参数 Item 为待查找的元素类型。类型参数 Result 是构造出的新数组，默认值是 []
   * - 通过模式匹配提取数组中的一个元素的类型，如果是 Item 类型的话就删除，也就是不放入构造的新数组，直接返回之前的 Result
   * - 否则放入构造的新数组，也就是再构造一个新的数组 [...Result, First]
   * - 直到模式匹配不再满足，也就是处理完了所有的元素，返回这时候的 Result
   */
  type RemoveItem<
    Arr extends unknown[],
    Item,
    Result extends unknown[] = []
  > = Arr extends [infer First, ...infer Rest]
    ? IsEqual<First, Item> extends true
      ? RemoveItem<Rest, Item, Result>
      : RemoveItem<Rest, Item, [...Result, First]>
    : Result;
  type RemoveItemRes = RemoveItem<[1, 2, 3, 4, 3], 3, [5]>;

  /**
   * 构造一个指定长度和类型的数组
   * - 类型参数 Length 为数组长度，约束为 number。类型参数 Ele 为元素类型，默认值为 unknown。类型参数 Arr 为构造出的数组，默认值是 []
   * - 每次判断下 Arr 的长度是否到了 Length，是的话就返回 Arr，否则在 Arr 上加一个元素，然后递归构造
   */
  type BuildArray<
    Length extends number,
    Ele = unknown,
    Arr extends unknown[] = []
  > = Arr['length'] extends Length
    ? Arr
    : BuildArray<Length, Ele, [...Arr, Ele]>;
  type BuildArrayRes = BuildArray<6, string, [1]>;

  /**
   * 替换字符串中的所有指定子串
   * - 类型参数 Str 是待处理的字符串类型，From 是待替换的字符，To 是替换到的字符
   * - 通过模式匹配提取 From 左右的字符串到 infer 声明的局部变量 Left 和 Right 里
   * - 用 Left 和 To 构造新的字符串，剩余的 Right 部分继续递归的替换
   * - 结束条件是不再满足模式匹配，也就是没有要替换的元素，这时就直接返回字符串 Str
   */
  type ReplaceAll<
    Str extends string,
    From extends string,
    To extends string
  > = Str extends `${infer Left}${From}${infer Right}`
    ? `${Left}${To}${ReplaceAll<Right, From, To>}`
    : Str;
  type ReplaceAllRes = ReplaceAll<'test test', 'test', 'some'>;

  /**
   * 将字符串字面量类型的每个字符都提取出来组成联合类型
   * - 类型参数 Str 为待处理的字符串类型，通过 extends 约束为 string
   * - 通过模式匹配提取第一个字符到 infer 声明的局部变量 First，其余的字符放到局部变量 Rest
   * - 用 First 构造联合类型，剩余的元素递归的取
   */
  type StringToUnion<Str extends string> =
    Str extends `${infer First}${infer Rest}`
      ? First | StringToUnion<Rest>
      : never;
  type StringToUnionRes = StringToUnion<'test'>;
})();
