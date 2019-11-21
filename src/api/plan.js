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

export function searchPlan(data) {
    return request({
        url: '/plan-manage/search/like-by-name',
        method: 'get',
        params:data
    })
}

//equipList
export function getEquipList() {
    return request({
        url: "/equip/equipArgsByName",
        method: "GET",
    })
}