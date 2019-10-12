import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element'
import provide from './vue-apollo'
import 'core-js';
import './components/icons'
import axios from 'axios';
import PDFJS from 'pdfjs-dist'
import './plugins/field';
import '@/permission'
import Video from 'video.js'
import { parseTime } from 'common/js/index'
Vue.prototype.$video = Video;

import VideoPlayer from 'vue-video-player'

const cmdPath = 'C:\\Users\\Administrator';
const exec = window.require('child_process').exec;
const spawn = window.require('child_process').spawn;



Vue.use(VideoPlayer);


Vue.config.productionTip = false;
Vue.prototype.$ajax = axios;

Vue.prototype.$filterTime = parseTime

new Vue({
    router,
    store,
    provide,
    PDFJS,
    render: h => h(App)
}).$mount('#app')