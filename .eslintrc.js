module.exports = {
    // 继承 Eslint 规则
    extends: ["eslint:recommended"],
    env: {
      node: true, // 启用node中全局变量
      browser: true, // 启用浏览器中全局变量 比如window, console 能不能直接用
    },
    parserOptions: {
      ecmaVersion: 6, //es6 版本
      sourceType: "module", //es module
    },
    rules: {
      "no-var": 2, // 不能使用 var 定义变量 error" 或 2 - 开启规则，使用错误级别的错误：error (当被触发的时候，程序会退出)
    },
  };