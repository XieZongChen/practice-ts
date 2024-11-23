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
   * 提取数组类型除去最后一个元素以外的类型
   * - 如果是空数组，就直接返回，否则匹配剩余的元素，放到 infer 声明的局部变量 Rest 里，返回 Rest
   */
  type PopArr<Arr extends unknown[]> = Arr extends []
    ? []
    : Arr extends [...infer Rest, unknown]
    ? Rest
    : never;
  type PopArrRes = PopArr<[1, 2, 3]>;
  type PopArrRes2 = PopArr<[]>;

  /**
   * 提取数组类型除去第一个元素以外的类型
   */
  type ShiftArr<Arr extends unknown[]> = Arr extends []
    ? []
    : Arr extends [unknown, ...infer Rest]
    ? Rest
    : never;
  type ShiftArrRes = ShiftArr<[1, 2, 3]>;

  /**
   * 判断字符串是否以某个前缀开头
   * - 用 Str 去匹配一个模式类型，模式类型的前缀是 Prefix，后面是任意的 string
   * - 如果匹配返回 true，否则返回 false
   */
  type StartsWith<
    Str extends string,
    Prefix extends string
  > = Str extends `${Prefix}${string}` ? true : false;
  type StartsWithRes1 = StartsWith<'abc', 'a'>;
  type StartsWithRes2 = StartsWith<'abc', 'b'>;

  /**
   * 替换指定字符串
   * - 声明要替换的字符串 Str、待替换的字符串 From、替换成的字符串 3 个类型参数，通过 extends 约束为都是 string 类型
   * - 用 Str 去匹配模式串，模式串由 From 和之前之后的字符串构成，把之前之后的字符串放到通过 infer 声明的局部变量 Prefix、Suffix 里
   * - 用 Prefix、Suffix 加上替换到的字符串 To 构造成新的字符串类型返回
   */
  type ReplaceStr<
    Str extends string,
    From extends string,
    To extends string
  > = Str extends `${infer Prefix}${From}${infer Suffix}`
    ? `${Prefix}${To}${Suffix}`
    : Str;
  type ReplaceStrRes1 = ReplaceStr<'abc', 'a', 'b'>;
  type ReplaceStrRes2 = ReplaceStr<'abc', 'd', 'b'>;

  /**
   * 去除字符串右侧的空格
   * - 由于一次只能去掉一个，所以需要递归
   * - 类型参数 Str 是要 Trim 的字符串
   * - 如果 Str 匹配字符串 + 空白字符 (空格、换行、制表符)，那就把字符串放到 infer 声明的局部变量 Rest 里
   * - 把 Rest 作为类型参数递归 TrimStrRight，直到不匹配，这时的类型参数 Str 就是处理结果
   */
  type TrimStrRight<Str extends string> = Str extends `${infer Rest}${
    | ' '
    | '\n'
    | '\t'}`
    ? TrimStrRight<Rest>
    : Str;
  type TrimStrRightRes = TrimStrRight<'abc  '>;

  /**
   * 去除字符串左侧的空格
   * - 类似右侧的去除，只是匹配的顺序不同
   */
  type TrimStrLeft<Str extends string> = Str extends `${
    | ' '
    | '\n'
    | '\t'}${infer Rest}`
    ? TrimStrLeft<Rest>
    : Str;
  type TrimStrLeftRes = TrimStrLeft<'  abc'>;

  /**
   * 去除字符串两侧的空格
   * - 先去除左侧的空格，再去除右侧的空格
   */
  type TrimStr<Str extends string> = TrimStrRight<TrimStrLeft<Str>>;
  type TrimStrRes = TrimStr<'  abc  '>;

  /**
   * 提取参数的类型
   * - 类型参数 Func 是要匹配的函数类型，通过 extends 约束为 Function
   * - Func 和模式类型做匹配，参数类型放到用 infer 声明的局部变量 Args 里
   * - 返回值可以是任何类型，用 unknown
   */
  type GetParameters<Func extends Function> = Func extends (
    ...args: infer Args
  ) => unknown
    ? Args
    : never;
  type GetParametersRes = GetParameters<(name: string, age: number) => void>;
})();
