import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import {getToken} from "@/common/js/auth"; // getToken from cookie

NProgress.configure({showSpinner: false})// NProgress Configuration

const whiteList = ['/login']; // 登录白名单


router.beforeEach((to, from, next) => {
    NProgress.start()
    if (getToken()) {
        if (to.path === '/login') {
            next();
        } else {
            if(!store.getters.matchRouters.length) { // 刷新页面导致VueX中匹配的路由数据丢失
                store.dispatch('matchRouter').then(() => { // 重新获取后进入对应页面(只有在匹配路由数据丢失才会重新匹配一次)
                    next({...to, replace: true})
                }).catch(err => {
                    store.dispatch('LogOut').then(() => { // 如果重新匹配过程中出现问题，则跳转至登录页重新登录
                        console.error(err)
                        next({path: '/login'})
                    })
                })
            } else {
                next()
            }
        }
    } else {
        if (whiteList.includes(to.path)) { // 在免登录白名单，直接进入
            next();
        } else {
            next('/login');
            NProgress.done();
        }
    }
})

router.afterEach(() => {
    NProgress.done();
})
