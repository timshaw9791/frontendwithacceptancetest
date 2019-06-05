import request from 'common/js/request'


export function getPlanList(data) {
    return request({
        url: '/plan-manage',
        method: 'get',
        params: data
    })
}


export function savePlan(data) {
    return request({
        url: '/plan-manage',
        method: 'post',
        data
    })
}


export function delectPlan(data) {
    return request({
        url: `/plan-manage/${data}`,
        method: 'delete',
    })
}
