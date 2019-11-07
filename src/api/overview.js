import request from 'common/js/request'


export function getReceiveList() {
    return request({
        url: '/equips/need-return',
        method: 'get'
    })
}



