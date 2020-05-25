import request from 'common/js/request'

//获取预案列表
export function getPlan(data) {
    return request({
        url: '/plan-manages',
        method: 'get',
        params: data
    })
}

// 新增预案
export function addPlan(data, tipState) {
    return request({
        url: '/plan-manages',
        method: 'post',
        data
    }, tipState)
}

// 更新预案
export function updatePlan(id,data, tipState) {
    return request({
        url: `/plan-manages/${id}`,
        method: 'put',
        data
    }, tipState)
}

// 删除预案
export function delectPlan(id, tipState) {
    return request({
        url: `/plan-manages/${id}`,
        method: 'delete',
    }, tipState)
}
