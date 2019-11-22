import request from 'common/js/request'

export function retirementApplication(data) {
    return request({
        url: '/equip-scrap/equip-scrap-start',
        method: 'post',
        params: data
    })
}
export function findrepairingequips() {
    return request({
        url: '/equip/findrepairingequips',
        method: 'get',
    })
}
// export function maintainEquipApplyOrders(params) {
//     return request({
//         url: "/maintain-equip-apply-orders",
//         method: "GET",
//         params
//     })
// }

// 查询不同状态的装备列表(正在充电、维修、保养)
export function getEquipsList() {
    return request({
        url: "/equip/findchargeingequips",
        method: "GET"
    })
}
export function findrepairingEquips() {
    return request({
        url: "/equip/findrepairingequips",
        method: "GET"
    })
}

export function equipsMaintain(data) {
    return request({
        url: "/equips/maintain",
        method: "PUT",
        data
    })
}

/* 维修、保养装备归还 */
export function equipsReturn(data) {
    return request({
        url: "/equips/return",
        method: "PUT",
        data: data
    })
}

/* 批量保养 */
export function equipsUpkeep(data) {
    return request({
        url: "/equips/upkeep",
        method: "PUT",
        data
    })
}
