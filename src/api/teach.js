import request from 'common/js/request'


export function getEquipArgs(params) {
    return request({
        url: '/equip/findByNameOrModelLike',
        method: 'get',
        params:params
    })
}


