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
        method: 'put',
        data:data
    })
}

// 领取耗材
export function receiveConsumable(id,params) {
    return request({
        url: `/consumables/${id}/receive`,
        method: 'post',
        params:params
    })
}

// 补充耗材列表
export function supplementConsumable(id,params) {
    return request({
        url: `/consumables/${id}/replenish`,
        method: 'post',
        params:params
    })
}
// 耗材记录列表
export function consumableRecordList(params) {
    return request({
        url: `/consumable-orders`,
        method: 'GET',
        params:params
    })
}