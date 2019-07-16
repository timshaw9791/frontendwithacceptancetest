import {login, logout, getInfo} from 'api/login'
import {getToken, setToken, removeToken} from 'common/js/auth'
import {Message} from 'element-ui'
import {delectSocket} from "common/js/webSocket";
import {getdeploy} from "api/login";

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
                    let newVal = JSON.stringify(response.role);
                    if (newVal.includes('SUPER_ADMINISTRATOR') || newVal.includes('LEADER') || newVal.includes('ADMINISTRATOR')) {
                        response.role = ['ADMINISTRATOR'];
                    }
                    localStorage.setItem('user', JSON.stringify(response));

                    getdeploy().then((res) => {
                        console.log(res);
                        commit('SET_DEPLOY', res);
                    });

                    // commit('SET_USERID', response.id);
                    /*  const data = response.data
                      setToken(data.token)
                      commit('SET_TOKEN', data.token)*/
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 获取用户信息
        // GetInfo({commit, state}) {
        //   return new Promise((resolve, reject) => {
        //     getInfo(state.token).then(response => {
        //       const data = response.data
        //       if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
        //         commit('SET_ROLES', data.roles)
        //       } else {
        //         reject('getInfo: roles must be a non-null array !')
        //       }
        //       commit('SET_NAME', data.name)
        //       commit('SET_AVATAR', data.avatar)
        //       resolve(response)
        //     }).catch(error => {
        //       reject(error)
        //     })
        //   })
        // },

        GetInfo({commit}) {
            return new Promise((resolve, reject) => {
                if (localStorage.getItem('user')) {
                    let data = JSON.parse(localStorage.getItem('user'));
                    let roleData = [];
                    if (data.role && data.role.length > 0) { // 验证返回的roles是否是一个非空数组
                        data.role.forEach((value) => {
                            roleData.push(value);
                        });
                        commit('SET_ROLES', roleData);
                    } else {
                        roleData.push('look');
                        commit('SET_ROLES', roleData);
                        // reject('getInfo: roles must be a non-null array!')
                    }
                    console.log(roleData);
                    resolve(roleData)
                } else {
                    reject(error)
                }
            })
        },


        // 登出
        LogOut({commit, state}) {
            return new Promise((resolve, reject) => {
                logout(state.token).then(() => {
                    delectSocket();
                    commit('SET_TOKEN', '');
                    commit('SET_ROLES', []);
                    removeToken();
                    localStorage.clear();
                    Message.success({
                        message: '退出成功!'
                    });
                    resolve();
                }).catch(error => {
                    reject(error)
                })
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
