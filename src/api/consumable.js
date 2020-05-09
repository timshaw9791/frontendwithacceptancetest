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
export function addConsumable(params,data) {
    return request({
        url: '/consumables',
        method: 'post',
        params:params,
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

// 领取和补充耗材
export function receiveConsumable(params,data) {
    return request({
        url: `/consumables/consumable-order`,
        method: 'POST',
        params:params,
        data:data
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