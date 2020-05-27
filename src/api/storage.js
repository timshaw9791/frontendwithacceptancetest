import request from 'common/js/request'
var qs = require('qs')


export function getCategoryAndGenre() {
    return request({
        url: '/equip-args/contain-category-and-genre',
        method: 'get'
    })
}

export function getInhouseNumber(params) {
    return request({
        url: "/in-house-orders",
        method: 'get',
        params:params
    })
}


export function deleteInhouseNumber(id, tipState) {
    return request({
        url: `/in-house-orders/${id}`,
        method: 'delete',
    }, tipState)
}
//装备位置批量变更
export function locationChangeOrders(data, tipState) {
    return request({
        url:`/location-change-orders?`,
        method: 'post',
        data
    }, tipState)
}
//获取需要报废的装备
export function maturityScrap(params) {
    return request({
        url:"/equips/need-scrap",
        method: 'get',
        params
    })
}
//获取货架列表信息
export function getLocation() {
    return request({
        url:"locations",
        method: 'get',
    })
}

export function getPoliceCabniet() {
    return request({
        url:"/police-cabinets",
        method: 'get',
    })
}
export function saveEquipInfo(categoryId,data, tipState) {
    return request({
        url: `/equip-args/${categoryId}`,
        method: 'put',
        data:data
    }, tipState)
}

export function getSuppliers() {
    return request({
        url: '/suppliers/list',
        method: 'get',
    })
}



export function delectPlan(data, tipState) {
    return request({
        url: `/plan-manage/${data}`,
        method: 'delete',
    }, tipState)
}

/* 查询装备参数  通过名称*/
export function equipArgsByName(params) {
    return request({
        url: "/equip/equipArgsByName",
        method: "GET",
        params
    })
}
/* 装备实体信息 */
export function equipsAll(params) {
    return request({
        url: '/equips',
        method: 'GET',
        params
    })
}
// 更新装备实体信息
export function equipsToNew(id,data, tipState) {
    return request({
        url: `/equips/${id}`,
        method: 'put',
        data
    }, tipState)
}
/* 查询装备参数 通过名称和型号 */
export function equipArgsByNameModel(params) {
    return request({
        url: '/equip/findByNameOrModelLike',
        method: 'GET',
        params
    })
}

/* 入库装备 */
export function inHouse(data, tipState) {
    return request({
        url: "/in-house",
        method: "POST",
        data
    }, tipState)
}
//入库单outHouseOrder
export function inOutHouseOrder() {
    return request({
        url: "/in-house-orders",
        method: "get",
    })
}
//出库单
export function getOutHouseOrder() {
    return request({
        url: "/out-house-orders",
        method: "get",
    })
}
/* 入库单删除 */
export function inHouseOrder(id, tipState) {
    return request({
        url: `/inouthouse/inHouseOrder/${id}`,
        method: "DELETE"
    }, tipState)
}

/* 出库装备 */
export function outHouse(list, tipState) {
    return request({
        url: `/out-house?${qs.stringify({rfids:list},{indices:false})}`,
        method: "POST"
    }, tipState)
}

/* 通过id找实体装备 */
export function findEquip(id) {
    return request({
        url: `/equip/equipById?id=${id}`,
        method: "GET"
    })
}

/* 通过rfid找实体装备 */
export function findByRfids(params) {
    return request({
        // url: `/equips/findByRfids?${qs.stringify(params, { indices: false })}`,
        url:`/equips/by-rfids?rfids=${params}`,
        method: "GET"
    })
}

/* 新增装备信息 */
export function saveEquipArg(data, tipState) {
    return request({
        url: "/equip-args",
        method: "POST",
        data
    }, tipState)
}

/* 更新装备参数 */
export function updateEquipArg(data, tipState) {
    return request({
        url: "/equip/updateEquipArg",
        method: "POST",
        data
    }, tipState)
}

/* 更新装备信息 */
export function updateEquip(data, tipState) {
    return request({
        url: "/equip/updateEquip",
        method: "POST",
        data
    }, tipState)
}

/* 获取所有供应商 */
export function getAllSupplier() {
    return request({
        url: "/supplier/findByName",
        method: "GET"
    })
}

/* 装备历史记录 */
export function findEquipHistory(params) {
    return request({
        url: "/equip/findEquipHistory",
        method: "GET",
        params
    })
}