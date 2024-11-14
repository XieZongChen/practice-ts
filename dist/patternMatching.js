/**
 * 模式匹配提取练习
 */
(function () {
    /**
     * js 中的模式匹配，`$1` 可以取到提取的子组
     */
    const jsRes = 'abc'.replace(/a(b)c/, '$1,$1,$1'); // 'b,b,b'
    console.log(jsRes);
})();
export {};
