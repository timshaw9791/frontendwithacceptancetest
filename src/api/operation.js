import request from 'common/js/request'
var qs = require('qs')
export function retirementApplication(data, state) {
    return request({
        url: '/equip-scrap/equip-scrap-start',
        method: 'post',
        params: data
    }, state)
}
//正在保养
export function inKeepEquips() {
    return request({
        url: '/remind/in-upkeep',
        method: 'get',
    }, false)
}
//正在保养
export function needKeepEquips() {
    return request({
        url: '/remind/need-upkeep',
        method: 'get',
    }, false)
}
//结束保养
export function endKeepEquips(state,list) {
    return request({
        url: `/equip-maintain/upkeep?${qs.stringify({rfids:list},{indices:false})}&state=${state}`,
        method: 'post',
    }, false)
}

//获取需要报废的装备
export function maturityScrap(params, state) {
    return request({
        url:"/remind/need-scrap",
        method: 'get',
        params
    }, state)
}

export function findkeepingequips() {
    return request({
        url: '/remind/findkeepingequips',
        method: 'get',
    }, false)
}

export function repairEquipMaintain(rfids,state) {
    return request({
        url: `/equip-maintain/repair?${qs.stringify({rfids:rfids},{indices:false})}&state=${state}`,
        method: 'post',
    }, false)
}
//维修单
export function getRepairOrder(params, state) {
    return request({
        url: "/repair-orders",
        method: 'get',
        params:params
    }, state)
}
export function rightRepairOrder(params, state) {
    return request({
        url: "/remind/in-repair",
        method: 'get',
        params:params
    }, state)
}
//装备报废 
export function equipScrap(category,remark,list, state) {
    return request({
        url: `/equip-maintain/scrap?category=${category}&remark=${remark}&rfids=${list}`,
        method: 'post',
    }, state)
}

//保养单列表
export function keepOrders(params, state) {
    return request({
        url: "/keep-orders",
        method: 'get',
        params:params
    }, state)
}
//维修单列表
export function serviceOrders(params, state) {
    return request({
        url:  "/repair-orders",
        method: 'get',
        params:params
    }, state)
}
//报废单列表
export function scarpsOrders(params, state) {
    return request({
        url:  "/scarp-orders",
        method: 'get',
        params:params
    }, state)
}
//维修申请列表
export function RepairOrder(params, state) {
    return request({
        url: "/repair-applies",
        method: 'get',
        params:params
    }, state)
}
//新增必戴装备
export function addWearRates(data, state) {
    return request({
      url: "/wear-rates",
      method: "POST",
      data
    }, state)
  }
//获取必戴装备
export function getWearRates(params, state) {
    return request({
      url: "/wear-rates",
      method: "get",
      params:params
    }, state)
  }
  //删除必戴装备
export function deleteWearRates(id, state) {
    return request({
      url: `/wear-rates/delete/${id}`,
      method: "delete",
    }, state)
  }
  //更新必戴装备
  export function updateWearRates(id,data, state) {
    return request({
      url: `/wear-rates/update/${id}`,
      method: "put",
      data
    }, state)
  }

export function upkeep(rfids,state, tipState) {
    return request({
        url: `/equipMaintain/upkeep?rfids=${rfids}&&state=${state}`,
        method: 'post',
    }, tipState)
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
export function equipsReturn(data, tipState) {
    return request({
        url: "/equips/return",
        method: "PUT",
        data: data
    }, tipState)
}

/* 批量保养 */
export function equipsUpkeep(data, tipState) {
    return request({
        url: "/equips/upkeep",
        method: "PUT",
        data
    }, tipState)
}
