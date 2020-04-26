import request from 'common/js/request'

// 获取耗材列表
export function getConsumableList(data) {
    return request({
        url: '/consumables',
        method: 'get',
        params: data
    })
}
// 新增耗材
export function addConsumable(data) {
    return request({
        url: '/consumables',
        method: 'post',
        data:data
    })
}

// 编辑耗材列表
export function editConsumable(id,data) {
    return request({
        url: `/consumables/${id}`,
        method: 'post',
        data:data
    })
}

// 领取耗材
export function receiveConsumable(id,params) {
    return request({
        url: `/consumables/${id}`,
        method: 'patch',
        params:params
    })
}

// 补充耗材列表
export function supplementConsumable(data) {
    return request({
        url: '/consumables/updateNameAndDescribes',
        method: 'post',
        data:data
    })
}