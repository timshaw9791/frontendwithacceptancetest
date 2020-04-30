import {login, logout, getInfo} from 'api/login'
import {getToken, setToken, removeToken} from 'common/js/auth'
import {Message} from 'element-ui'
import {getdeploy} from "api/login";
import {baseBURL, baseURL, localTitle} from "../../api/config";


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
        roles: [],
        userId: '',
        deploy: '',
    },

    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_NAME: (state, name) => {
            state.name = name
        },
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles
        },
        SET_USERID: (state, userId) => {
            state.userId = userId
        },
        SET_DEPLOY: (state, deploy) => {
            state.deploy = deploy
        }
    },

    actions: {
        // 登录
        Login({commit}, userInfo) {
            const username = userInfo.username.trim()
            return new Promise((resolve, reject) => {
                login(username, userInfo.password).then(response => {
                    let newVal = response.role;
                    if (newVal == 'SUPER_ADMINISTRATOR'|| newVal=='LEADER' || newVal=='ADMIN') {
                        response.role = ['ADMINISTRATOR'];
                    }
                    localStorage.setItem('user', JSON.stringify(response));
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },

        GetInfo({commit}) {
            return new Promise((resolve, reject) => {
                if (localStorage.getItem('user')) {
                    let data = JSON.parse(localStorage.getItem('user'));
                    let roleData = [];
                    if (data.role && data.role.length > 0) { // 验证返回的roles是否是一个非空数组
                        roleData=[...data.role];
                        commit('SET_ROLES', roleData);
                    } else {
                        roleData.push('look');
                        commit('SET_ROLES', roleData);
                        // reject('getInfo: roles must be a non-null array!')
                    }
                    resolve(roleData)
                } else {
                    reject(error)
                }
            })
        },


        // 登出
        LogOut({commit, state}) {
            return new Promise((resolve, reject) => {
                    commit('SET_TOKEN', '');
                    commit('SET_ROLES', []);
                    removeToken();
                    localStorage.clear();
                    Message.success({
                        message: '退出成功!'
                    });
                    resolve();
            })
        },

        // 前端 登出
        FedLogOut({commit}) {
            return new Promise(resolve => {
                commit('SET_TOKEN', '')
                removeToken()
                resolve()
            })
        }
    }
}

export default user
