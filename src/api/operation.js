import request from 'common/js/request'
var qs = require('qs')
export function retirementApplication(data) {
    return request({
        url: '/equip-scrap/equip-scrap-start',
        method: 'post',
        params: data
    })
}
//正在保养
export function inKeepEquips() {
    return request({
        url: '/equips/in-upkeep',
        method: 'get',
    })
}
//结束保养
export function endKeepEquips(state,list) {
    return request({
        url: `/equip-maintain/upkeep?${qs.stringify({rfids:list},{indices:false})}&state=${state}`,
        method: 'post',
    })
}

export function findkeepingequips() {
    return request({
        url: '/equip/findkeepingequips',
        method: 'get',
    })
}

export function repairEquipMaintain(rfids,state) {
    return request({
        url: `/equipMaintain/repair?rfids=${rfids}&&state=${state}`,
        method: 'post',
    })
}
export function findByRfids(rfids) {
    return request({
        url: `/equip/findByRfids?rfids=${rfids}`,
        method: 'get',
    })
}
export function upkeep(rfids,state) {
    return request({
        url: `/equipMaintain/upkeep?rfids=${rfids}&&state=${state}`,
        method: 'post',
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

// export function equipsMaintain(data) {
//     return request({
//         url: "/equips/maintain",
//         method: "PUT",
//         data
//     })
// }

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
