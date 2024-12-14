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

  /**
   * 将字符串的首字母转换为大写
   * - 类型参数 Str 是要处理的字符串类型，通过 extends 约束为 string
   * - 通过 infer 提取出首个字符到局部变量 First，提取后面的字符到局部变量 Rest
   * - 使用 TypeScript 提供的内置高级类型 Uppercase 把首字母转为大写，加上 Rest，构造成新的字符串类型返回
   */
  type CapitalizeStr<Str extends string> =
    Str extends `${infer First}${infer Rest}`
      ? `${Uppercase<First>}${Rest}`
      : Str;
  type CapitalizeStrRes = CapitalizeStr<'hello'>;

  /**
   * 将蛇形表示法（Snake Case）转换为驼峰表示法（Camel Case）
   * - 参数 Str 是待处理的字符串类型，约束为 string
   * - 提取 _ 之前和之后的两个字符到 infer 声明的局部变量 Left 和 Right，剩下的字符放到 Rest 里
   * - 把右边的字符 Right 大写，和 Left 构造成新的字符串，剩余的字符 Rest 要继续递归的处理
   */
  type CamelCase<Str extends string> =
    Str extends `${infer Left}_${infer Right}${infer Rest}`
      ? `${Left}${Uppercase<Right>}${CamelCase<Rest>}`
      : Str;
  type CamelCaseRes = CamelCase<'test_test_test'>;

  /**
   * 删除字符串中的指定子串
   * - 类型参数 Str 是待处理的字符串， SubStr 是要删除的字符串，都通过 extends 约束为 string 类型
   * - 通过模式匹配提取 SubStr 之前和之后的字符串到 infer 声明的局部变量 Prefix、Suffix 中
   * - 如果不匹配就直接返回 Str；如果匹配，那就用 Prefix、Suffix 构造成新的字符串，然后继续递归删除 SubStr
   * - 直到不再匹配，也就是没有 SubStr 了
   */
  type DropSubStr<
    Str extends string,
    SubStr extends string
  > = Str extends `${infer Prefix}${SubStr}${infer Suffix}`
    ? DropSubStr<`${Prefix}${Suffix}`, SubStr>
    : Str;
  type DropSubStrRes = DropSubStr<'!hello!!!!', '!'>;

  /**
   * 为函数类型添加一个指定类型参数
   * - 类型参数 Func 是待处理的函数类型，通过 extends 约束为 Function，Arg 是要添加的参数类型
   * - 通过模式匹配提取参数到 infer 声明的局部变量 Args 中，提取返回值到局部变量 ReturnType 中
   * - 用 Args 数组添加 Arg 构造成新的参数类型，结合 ReturnType 构造成新的函数类型返回
   */
  type AppendArgument<Func extends Function, Arg> = Func extends (
    ...args: infer Args
  ) => infer ReturnType
    ? (...args: [...Args, Arg]) => ReturnType
    : never;
  type AppendArgumentRes = AppendArgument<(first: string) => boolean, number>;
})();
