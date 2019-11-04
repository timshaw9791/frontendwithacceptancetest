import request from 'common/js/request'

export function retirementApplication(data) {
    return request({
        url: '/equip-scrap/equip-scrap-start',
        method: 'post',
        params: data
    })
}

export function maintainEquipApplyOrders(params) {
    return request({
        url: "/maintain-equip-apply-orders",
        method: "GET",
        params
    })
}

export function equipsMaintain(data) {
    return request({
        url: "/equips/maintain",
        method: "PUT",
        data
    })
}
