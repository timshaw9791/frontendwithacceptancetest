import router from './router'
import store from './store'
import {Message} from 'element-ui'
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
            if (!store.getters.roles) { // 判断当前用户是否已拉取完user_info信息
                store.dispatch('GetInfo').then((res) => { // 没有用户信息则重新拉取
                    store.dispatch('GenerateRoutes', res).then(() => { // 获得信息后，再获取权限匹配的路由表
                        return new Promise((reslove, reject) => {
                            router.addRoutes(store.getters.addRouters); // 动态添加可访问路由表
                            reslove();
                        })
                    }).then(() => {
                        next({...to, replace: true});
                   })
                }).catch((err) => { // localStorage没有用户信息
                    store.dispatch('FedLogOut').then(() => {
                        Message.error(err);
                        next({path: '/'});
                    })
                })
            } else {
                next();
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
