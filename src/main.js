import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element'
import 'core-js';
import './components/icons'
import axios from 'axios';
import PDFJS from 'pdfjs-dist'
import './plugins/field';
import '@/permission'
import Video from 'video.js'
import _ from 'lodash'
Vue.prototype.$video = Video;

import { parseTime, filterFrame,formatFunc,formatFuncOrder } from 'common/js/index'
import VideoPlayer from 'vue-video-player'
import {sumFunc,delRow} from "@/common/js/tableFunc";
import {interval} from "@/common/js";

Vue.use(VideoPlayer);


Vue.config.errorHandler = function(err, vm, info) {
    let {message, name, stack} = err;
    console.log('*************************');
    switch (name) {
        case 'SyntaxError':
            console.error("语法错误");
            break;
        case 'ReferenceError':
            console.error("引用错误");
            break;
        case 'RangeError':
            console.error("范围错误");
            break;
        case 'TypeError':
            console.error("类型错误");
            break;
        case 'URLError':
            console.error('URL地址错误');
            break;
        case 'EvalError':
            console.error('eval错误');
            break;
        default:
            console.error(name)
            break;
    }
    console.log("错误信息：", message);
    console.log("错误对象：", stack);
    console.log("错误组件：", vm);
    console.log("特定信息：", info);
    console.log('*************************');
}




Vue.config.productionTip = false;
Vue.prototype.$ajax = axios;
Vue.prototype.$formatFuncLoc = formatFunc
Vue.prototype.$formatFuncOrderLoc = formatFuncOrder
Vue.prototype.$filterTime = parseTime
Vue.prototype.$interval = interval
Vue.prototype.$filterFrame = filterFrame
Vue.prototype._ = _
Vue.prototype.$sumFunc = sumFunc
Vue.prototype.$delRow = delRow
Vue.prototype.$eventBus = new Vue()

new Vue({
    router,
    store,
    PDFJS,
    render: h => h(App)
}).$mount('#app')