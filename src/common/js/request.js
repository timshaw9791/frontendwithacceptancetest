import axios from 'axios'
import qs from 'qs';
import {Message, MessageBox} from 'element-ui'
import store from 'store'
import {getToken, setToken, removeToken} from 'common/js/auth'
import {baseURL, tokenName} from 'api/config';

// 创建axios实例


let URL = window.location.origin;
let URL1 = '';
if (window.location.pathname == '/') {
    URL1 = '/';
} else {
    URL1 = window.location.pathname;
}
let config = {
    loginUrl: `${URL}${URL1}#/login`, /*登陆地址*/
    loginApi: `${baseURL}/login`, /*登陆API*/
    logoutApi: `${baseURL}/logout`, /*退出API*/
    indexUrl: `${URL}${URL1}/#/home` /*首页*/
};

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
    // Do something with request error
    Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(response => {
        if(!['get','GET'].includes(response.config.method)) {
            Message.success({
                message: '操作成功'
            })
        }
        let token = response.headers[tokenName];
        if (token) {
            setToken(token);
            store.commit('SET_TOKEN', token)
        }
        const res = response.data;
        return res;
        /* if (res.code !== 20000) {
           Message({
             message: res.message,
             type: 'error',
             duration: 5 * 1000
           })

           // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
           if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
             MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
               confirmButtonText: '重新登录',
               cancelButtonText: '取消',
               type: 'warning'
             }).then(() => {
               store.dispatch('FedLogOut').then(() => {
                 location.reload()// 为了重新实例化vue-router对象 避免bug
               })
             })
           }
           return Promise.reject('error')
         } else {
           return response.data
         }*/
    },
    error => {
        console.log('err' + error) // for debug

        let errcode = String(error);
        if (errcode.includes('401')) {
            if (location.href === config.loginUrl) {    /*登陆页面401错误，提示用户名或者密码错误*/
                Message.error({
                    message: '账号或密码错误'
                });
            } else {
                Message.error({
                    message: '超时'
                });
                console.log(config.loginUrl);
                removeToken();
                location.href = config.loginUrl;
            }
        }
        else if (errcode.includes('500')) {
            Message.error({
                message: `${error.response.data.message}`
            });
        }
        else if (errcode.includes('Network')) {
            Message.error({
                message: `请求超时请重试!`
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

export default service
