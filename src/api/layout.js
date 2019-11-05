import request from 'common/js/request'


export function getUserInfo(id) {
    return request({
        url: `/identity/user/${id}`,
        method: 'get'
    })
}

