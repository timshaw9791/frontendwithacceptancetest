import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element'
import provide from './vue-apollo'
import 'core-js';
import './components/icons'
import './plugins/field';
import '@/permission'

import VideoPlayer from 'vue-video-player'
Vue.use(VideoPlayer)



Vue.config.productionTip = false

new Vue({
    router,
    store,
    provide,
    render: h => h(App)
}).$mount('#app')
