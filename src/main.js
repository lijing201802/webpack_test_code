import count from "./js/count";
import sum from "./js/sum";
// 想要webpack打包资源，必须引入该资源
import './css/iconfont.css'
import './css/index.css'
import './less/index.less'
import './sass/index.sass'
import './sass/index.scss'
import './stylus/index.styl'

// var result = count(2, 1);//会触发ESLINT no-var规则报错。
let result = count(2,1)
console.log(result); 
let result2 = sum(1,2,3,4);
console.log(result2);

if (module.hot) {
    // 判断是否支持热模块替换功能
    module.hot.accept("./js/count");
    module.hot.accept("./js/sum");
  }