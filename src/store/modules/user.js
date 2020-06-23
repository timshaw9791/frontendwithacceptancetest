import {login} from 'api/login'
import { getHouseInfo } from '@/api/warehouse'
import {getToken, setToken, removeToken} from 'common/js/auth'
import {Message} from 'element-ui'


function setDeploy() {
    if (process.env.NODE_ENV == "production") {
        let fs = window.require('fs'), result, path = 'C:\\config.json';
        result = fs.readFileSync(path).toString()
        result = eval(`(${result})`)
        localStorage.setItem('deploy', JSON.stringify(result))
    }
}


const user = {
    state: {
        token: getToken(),
        name: '',
        avatar: '',
        roles: '',
        userId: '',
        deploy: '',
        userInfo: ''
    },
    mutations: {
        setToken(state, token) {
            state.token = token
        },
        SET_NAME: (state, name) => {
            state.name = name
        },
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar
        },
        setRoles(state, roles) {
            state.roles = roles
        },
        SET_USERID: (state, userId) => {
            state.userId = userId
        },
        SET_DEPLOY: (state, deploy) => {
            state.deploy = deploy
        },
        setUserInfo(state, data) {
            state.userInfo = data
        }
    },
    actions: {
        // 登录
        Login({commit}, userInfo) {
            const username = userInfo.username.trim()
            return new Promise((resolve, reject) => {
                login(username, userInfo.password).then(response => {
                    // let newVal = response.role;
                    // if (newVal == 'SUPER_ADMINISTRATOR'|| newVal=='LEADER' || newVal=='ADMIN') {
                    //     response.role = ['ADMINISTRATOR'];
                    // }
                    localStorage.setItem('user', JSON.stringify(response));
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },

        GetInfo({commit}) {
            getHouseInfo().then(res => {
                commit('setOrganUnit', {id: res.organUnitId, name: res.organUnitName});
                commit('setWarehouse', {id: res.houseId, name: res.houseName})
            })
            return new Promise((resolve, reject) => {
                if (localStorage.getItem('user')) {
                    let data = JSON.parse(localStorage.getItem('user')),
                        roleData = data.role || 'look';
                    commit('setUserInfo', data)
                    commit('setRoles', roleData)
                    resolve(roleData)
                } else {
                    reject(error)
                }
            })
        },


        // 登出
        LogOut({commit}, status) {
            return new Promise((resolve, reject) => {
                    commit('setToken', '');
                    commit('setRoles', '');
                    commit('setUserInfo', {});
                    removeToken();
                    localStorage.clear();
                    status && Message.success({
                        message: '退出成功!'
                    });
                    resolve();
            })
        },

        // 前端 登出
        FedLogOut({commit}) {
            return new Promise(resolve => {
                commit('setToken', '')
                commit('setRoles', '');
                commit('setUserInfo', {});
                removeToken()
                resolve()
            })
        }
    }
}

export default user
