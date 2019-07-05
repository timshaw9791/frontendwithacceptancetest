import request from 'common/js/request';

export function login(username, password) {
  return request({
    url: '/login',
    method: 'post',
    params: {
      username,
      password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}


export function getdeploy () {
  return request({
    url:'/environment/deviceConfig',
    method:'get',
  })
}