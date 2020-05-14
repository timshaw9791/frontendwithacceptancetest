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
//正在保养
export function needKeepEquips() {
    return request({
        url: '/equips/need-upkeep',
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

//获取需要报废的装备
export function maturityScrap(params) {
    return request({
        url:"/equips/need-scrap",
        method: 'get',
        params
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
        url: `/equip-maintain/repair?${qs.stringify({rfids:rfids},{indices:false})}&state=${state}`,
        method: 'post',
    })
}
//维修单
export function getRepairOrder(params) {
    return request({
        url: "/repair-orders",
        method: 'get',
        params:params
    })
}
export function rightRepairOrder(params) {
    return request({
        url: "/equips/in-repair",
        method: 'get',
        params:params
    })
}
//装备报废 
export function equipScrap(category,remark,list) {
    return request({
        url: `/equip-maintain/scrap?category=${category}&remark=${remark}&rfids=${list}`,
        method: 'post',
    })
}

//保养单列表
export function keepOrders(params) {
    return request({
        url: "/keep-orders",
        method: 'get',
        params:params
    })
}
//维修单列表
export function serviceOrders(params) {
    return request({
        url:  "/repair-orders",
        method: 'get',
        params:params
    })
}
//报废单列表
export function scarpsOrders(params) {
    return request({
        url:  "/scarp-orders",
        method: 'get',
        params:params
    })
}
//维修申请列表
export function RepairOrder(params) {
    return request({
        url: "/repair-applies",
        method: 'get',
        params:params
    })
}
//新增必戴装备
export function addWearRates(data) {
    return request({
      url: "/wear-rates",
      method: "POST",
      data
    })
  }
//获取必戴装备
export function getWearRates(params) {
    return request({
      url: "/wear-rates",
      method: "get",
      params:params
    })
  }
  //删除必戴装备
export function deleteWearRates(id) {
    return request({
      url: `/wear-rates/delete/${id}`,
      method: "delete",
    })
  }
  //更新必戴装备
  export function updateWearRates(id,data) {
    return request({
      url: `/wear-rates/update/${id}`,
      method: "put",
      data
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
