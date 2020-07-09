/* axios实例、请求/响应拦截 */
import axios from 'axios'
import qs from 'qs';
import { Message } from 'element-ui'
import store from 'store'
import {getToken, setToken, removeToken} from 'common/js/auth'
import {baseURL, tokenName} from 'api/config';

let loginUrl = `${window.location.origin}${window.location.pathname}#/login`; /*登陆地址 主要用于判断是否为登录页，以及跳转回登录页*/

// 创建axios实例
const service = axios.create({
    baseURL, // api的base_url
    timeout: 15000, // 请求超时时间
    // withCredentials: true
});

// request拦截器
service.interceptors.request.use(config => {
    if (config.headers['Content-Type'] === "application/x-www-form-urlencoded") {
        config.data = qs.stringify(config.data);
    }
    if (getToken()) {
        config.headers[tokenName] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config
}, error => {
    Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(response => {
        let token = response.headers[tokenName];
        if (token) {
            setToken(token);
            store.commit('setToken', token)
        }
        const res = response.data;
        return res;
    },
    error => {
        let errcode = String(error);
        if (errcode.includes('401')) {
            if (location.href === loginUrl) {    /*登陆页面401错误，提示用户名或者密码错误*/
                Message.error({
                    message: '账号或密码错误！'
                });
            } else {
                Message.error({
                    message: '权限不足或已失效！'
                });
                store.dispatch('LogOut').then(() => {
                    setTimeout(() => location.reload(), 1000)
                })
            }
        } else if (errcode.includes('Network')) {
            Message.error({
                message: `请求超时请重试！`
            });
        } else {
            if(error.response) {
                Message.error({
                    message: error.response.data.message
                })
            }
            console.log(error);
        }
        return Promise.reject(error)
    }
)

function request(configParam, state = false) {
    return service(configParam).then(res => {
        state && Message.success('操作成功');
        return new Promise(reslove => reslove(res))
    })
}

export default request