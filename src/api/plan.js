import request from 'common/js/request'


export function getPlanList(data) {
    return request({
        url: '/planManage/planList',
        method: 'get',
        params: data
    })
}


export function savePlan(data) {
    return request({
        url: '/planManage/savePlanMange',
        method: 'post',
        data
    })
}
export function updatePlan(data) {
    return request({
        url: '/planManage/updatePlanMange',
        method: 'post',
        data
    })
}


export function delectPlan(data) {
    return request({
        url: `/planManage/deleteBy/${data}`,
        method: 'POST',
    })
}

export function searchPlan(data) {
    return request({
        url: '/planManage/findByNameLike',
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