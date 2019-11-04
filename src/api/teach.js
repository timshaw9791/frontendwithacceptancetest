import request from 'common/js/request'


export function getEquipArgs(params) {
    return request({
        url: '/equip-args',
        method: 'get',
        params:params
    })
}


