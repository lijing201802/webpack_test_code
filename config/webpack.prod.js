/**
 * 1. npm init -y 初始化package.json后，
 * 2. 在项目根目录下新建文件：webpack.config.js
 */

// Node.js的核心模块，专门用来处理文件路径
const path = require("path");
const ESLintWebpackPlugin = require("eslint-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  // 入口
  // 相对路径和绝对路径都行
  entry: "./src/main.js", //相对运行代码命令的地方
  // 输出
  output: {
    // path: 文件输出目录，必须是绝对路径
    // path.resolve()方法返回一个绝对路径
    // __dirname nodejs的变量，代表当前文件的文件夹目录绝对路径
    path: path.resolve(__dirname, "../dist"),//绝对路径
    // filename: 入口文件打包输出文件名 （其他文件默认在path下）
    filename: "static/js/main.js",
    // 自动清空上次打包的内容
    // 原理：在打包前，将 path整个目录内容清空，再进行打包
    clean: true,
  },
  // 加载器
  module: {
    rules: [
        {
            // 用来匹配 .css 结尾的文件
            test: /\.css$/,//只检测.css文件
            // use 数组里面 Loader 执行顺序是从右到左，即从下到上
            use: [
                "style-loader", //将js中css通过创建style标签添加到html文件中生效
                "css-loader"//将css资源编译成commonjs的模块到js中
            ],
        },
        {//npm i less less-loader -D
          test: /\.less$/,
          // loader: 'xxx', // 只能使用1个loader
          use: [// 使用多个loader
              "style-loader", 
              "css-loader",
              "less-loader"// 将less编译成css文件
          ],
        },
        { //npm i sass-loader sass -D
          test: /\.s[ac]ss$/,
          use: [
              "style-loader", 
              "css-loader",
              "sass-loader"// 将sass编译成css文件
          ],
        },
        { //npm i stylus stylus-loader -D
          test: /\.styl$/,
          use: [
              "style-loader", 
              "css-loader",
              "stylus-loader"// 将stylus编译成css文件
          ],
        },
        {//过去在 Webpack4 时，我们处理图片资源通过 file-loader（直接输出原来格式） 和 url-loader（转成base64） 进行处理
          // 现在 Webpack5 已经将两个 Loader 功能内置到 Webpack 里了
          test: /\.(png|jpe?g|gif|webp)$/,
          type: "asset",
          parser: {
            dataUrlCondition: {
              // 小于10kb的图片会被base64处理
              // 优点：减少请求数量。缺点：体积会更大
              maxSize: 10 * 1024 
            }
          },
          generator: {
            // 输出图片的名称
            // filename: 'static/images/[hash][ext][query]'
            // [hash:10] hash值只取前10位
            filename: 'static/images/[hash:10][ext][query]'
          }
        },
        {
          test: /.(ttf|woff2?|mp3|mp4|avi)$/,
          type: 'asset/resource',//不处理，直接输出的资源
          generator: {
            filename: "static/media/[hash:8][ext][query]",
          },
        },
        {
          test: /\.js$/,
          exclude: /node_modules/, // 排除node_modules代码不编译
          use: {
            loader: "babel-loader",
            // options: ["@babel/preset-env"] //写在这里，或者写在外面的babel.config.js
          }
          
        },
    ],
  },
  // 插件
  plugins: [
    //npm i eslint-webpack-plugin eslint -D
    new ESLintWebpackPlugin({
      // 指定检查文件的根目录
      context: path.resolve(__dirname, "../src"),
    }),
    // 处理html资源。作用是自动引入打包资源。
    // 当前是在public下的index.html中手动引入的打包后dist下的 main.js
    // 以后打包后的可能不叫main.js，而且可能会生成多个js，一个一个手动引入很麻烦。
    // npm i html-webpack-plugin -D
    new HtmlWebpackPlugin({
      // 以 public/index.html 为模板创建文件（创建新的index.html，会在dist里）
      // 新的html文件有两个特点：1. 内容和源文件一致 2. 自动引入打包生成的js等资源
      // 要记得注释掉原先publit/index.html中引入dist下js的代码
      template: path.resolve(__dirname, "../public/index.html"),
    }),
  ],

  // 开发服务器：不会输出资源，在内存中编译打包
  // 安装：npm i webpack-dev-server -D 运行：npx webpack serve
  // devServer: { //生产模式，不用配置开发服务器。
  //   host: "localhost", // 启动服务器域名
  //   port: "3000", // 启动服务器端口号
  //   open: true, // 是否自动打开浏览器
  // },
  // 模式
  mode: "production", // 开发模式
};