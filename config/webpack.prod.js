/**
 * 1. npm init -y 初始化package.json后，
 * 2. 在项目根目录下新建文件：webpack.config.js
 *    指定基本结构，entry, output, module, plugins,devServer,mode
 *    entry: "./src/main.js",
 *    output: 指定其中的path, filename
 * 3. 下载依赖：
 *    3.1 安装webpack: npm i webpack webpack-cli -D
 *    3.2 安装css-loader: npm i css-loader style-loader -D  
 *                  其中style-loder可以不用安装，后面会被MiniCssExtractPlugin（生成专门的css文件，link引入）代替
 *    3.3 安装需要使用的预处理器（一般一个就行）
 *      less-loader: npm i less-loader -D
 *      sass-loder, scss-loader: npm i less-loader -D
 *      stylus-loader: npm i less-loader -D
 *    3.4 安装babel，用来编译es6语法
 *      npm i babel-loader @babel/core @babel/preset-env -D
 *    3.5 安装HtmlWebpackPlugin。用途：不使用的话，无法生成 index.html文件，需要手动的把dist文件下的main.js引入到public/index.html。
 *        使用这个插件，可以以 public/index.html 为模板创建文件 并自动引入打包生成的js等资源
 *      npm i html-webpack-plugin -D
 *    3.6 安装开发服务器
 *      npm i webpack-dev-server -D

 * 4. 配置
 *    4.1 配置css-loader （在module的rules里）
 *    4.2 配置预处理器 （在module的rules里）
 *    4.3 配置图片资源 （在module的rules里）
 *       {//过去在 Webpack4 时，我们处理图片资源通过 file-loader（直接输出原来格式） 和 url-loader（转成base64） 进行处理
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
 *    4.4 配置其他媒体资源 （在module的rules里）
 *      {
          test: /.(ttf|woff2?|mp3|mp4|avi)$/,
          type: 'asset/resource',//不处理，直接输出的资源
          generator: {
            filename: "static/media/[hash:8][ext][query]",
          },
        },
      4.5 配置Babel
        4.5.1 在module的rules里
          {
            test: /\.js$/,
            exclude: /node_modules/, // 排除node_modules代码不编译
            use: {
              loader: "babel-loader",
              // options: ["@babel/preset-env"] //写在这里，或者写在外面的babel.config.js
            }
            
          },
        4.5.2 babel.config.js
          module.exports = {
            presets: ["@babel/preset-env"],
          };
      4.6 配置HtmlWebpackPlugin
        4.6.1 引入 const HtmlWebpackPlugin = require("html-webpack-plugin");
        4.6.2 在plugins中配置
        new HtmlWebpackPlugin({
          template: path.resolve(__dirname, "../public/index.html"),
        }),
        4.6.3 如果之前在public/index.html中有引入dist下的main.js，现在可以删除
      4.7 配置开发服务器，devServer和module、plugin等同级   
 *      
 *      
 */

// Node.js的核心模块，专门用来处理文件路径
const path = require("path");
const ESLintWebpackPlugin = require("eslint-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

/**
 * 获取处理样式的Loaders
 * loader的顺序很重要
 * @param {String} preProcessor 样式预处理器的名字。将对应的如less, sass, scss stylus等编译成css文件
 * @returns 
 */
const getStyleLoaders = (preProcessor) => {
  return [
    MiniCssExtractPlugin.loader,// npm i mini-css-extract-plugin -D  提取单独的Css文件，通过link标签加载,代替style-loader
    // "style-loader", //将js中css通过创建style标签添加到html文件中生效
    "css-loader",//npm i css-loader style-loader -D 将css资源编译成commonjs的模块到js中
    {
      loader: "postcss-loader",//Css 兼容性处理, 如flex等
      options: {
        postcssOptions: {
          plugins: [
            "postcss-preset-env", // 能解决大多数样式兼容性问题
          ],
        },
      },
    },
    preProcessor //将样式预处理器编译成css
  ].filter(Boolean)
}
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
            use: getStyleLoaders(),
        },
        {//npm i less less-loader -D
          test: /\.less$/,
          // loader: 'xxx', // 只能使用1个loader
          use: getStyleLoaders("less-loader"), 
        },
        { //npm i sass-loader sass -D
          test: /\.s[ac]ss$/,
          use: getStyleLoaders("sass-loader"),
        },
        { //npm i stylus stylus-loader -D
          test: /\.styl$/,
          use: getStyleLoaders("stylus-loader"),
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
    // npm i mini-css-extract-plugin -D 提取css成单独文件 通过link标签加载,代替style-loader
    new MiniCssExtractPlugin({
      // 定义输出文件名和目录
      filename: "static/css/main.css",
    }),
    //npm i css-minimizer-webpack-plugin -D  css压缩
    new CssMinimizerPlugin(),
  ],

  // 开发服务器：不会输出资源，在内存中编译打包
  // 安装：npm i webpack-dev-server -D 运行：npx webpack serve
  devServer: { //生产模式，不用配置开发服务器。
    host: "localhost", // 启动服务器域名
    port: "3000", // 启动服务器端口号
    open: true, // 是否自动打开浏览器
  },
  // 模式
  mode: "production", // 开发模式
};