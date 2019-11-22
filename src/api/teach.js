import request from 'common/js/request'


export function getEquipArgs(params) {
    return request({
        url: '/equip/equipArgsByName',
        method: 'get',
        params:params
    })
}


