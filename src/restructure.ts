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

  /**
   * 映射一个索引类型
   * - 类型参数 Obj 是待处理的索引类型，通过 extends 约束为 object
   * - 用 keyof 取出 Obj 的索引，作为新的索引类型的索引，也就是 Key in keyof Obj
   * - 值的类型可以做变换，这里用之前索引类型的值 Obj[Key] 构造成了三个元素的元组类型 [Obj[Key], Obj[Key], Obj[Key]]
   */
  type Mapping<Obj extends object> = {
    [Key in keyof Obj]: [Obj[Key], Obj[Key], Obj[Key]];
  };
  type MappingRes = Mapping<{ key: 'value'; key2: 'value2' }>;

  /**
   * 把索引类型的 Key 变为大写
   * - 类型参数 Obj 是待处理的索引类型，通过 extends 约束为 object
   * - 新的索引类型的索引为 Obj 中的索引，也就是 Key in keyof Obj，但要做一些变换，也就是 as 之后的
   * - 通过 Uppercase 把索引 Key 转为大写，因为索引可能为 string、number、symbol 类型，而这里只能接受 string 类型，所以要 & string，也就是取索引中 string 的部分
   * - value 保持不变，也就是之前的索引 Key 对应的值的类型 Obj[Key]
   */
  type UppercaseKey<Obj extends object> = {
    [Key in keyof Obj as Uppercase<Key & string>]: Obj[Key];
  };
  type UppercaseKeyRes = UppercaseKey<{ key: 'value'; key2: 'value2' }>;

  /**
   * 使用 Record 改写把索引类型的 Key 变为大写
   * - TypeScript 提供了内置的高级类型 Record 来创建索引类型
   */
  type UppercaseKey2<Obj extends Record<string, any>> = {
    [Key in keyof Obj as Uppercase<Key & string>]: Obj[Key];
  };
  type UppercaseKeyRes2 = UppercaseKey2<{ key: 'value'; key2: 'value2' }>;

  /**
   * 把索引类型的值映射为只读类型
   * - 索引类型的索引可以添加 readonly 的修饰符，代表只读
   */
  type ToReadonly<T> = {
    readonly [Key in keyof T]: T[Key];
  };
  type ToReadonlyRes = ToReadonly<{ key: 'value'; key2: 'value2' }>;

  /**
   * 把索引类型的值映射为可选类型
   * - 索引类型的索引可以添加 ? 的修饰符，代表可选
   */
  type ToPartial<T> = {
    [Key in keyof T]?: T[Key];
  };
  type ToPartialRes = ToPartial<{ key: 'value'; key2: 'value2' }>;

  /**
   * 把索引类型的值映射为可变类型
   * - 索引类型的索引可以添加 -readonly 的修饰符，代表去掉只读
   */
  type ToMutable<T> = {
    -readonly [Key in keyof T]: T[Key];
  };
  type ToMutableRes = ToMutable<{
    readonly key: 'value';
    readonly key2: 'value2';
  }>;

  /**
   * 把索引类型的值映射为必选类型
   * - 索引类型的索引可以添加 -? 的修饰符，代表去掉可选
   */
  type ToRequired<T> = {
    [Key in keyof T]-?: T[Key];
  };
  type ToRequiredRes = ToRequired<{ key?: 'value'; key2?: 'value2' }>;
})();
