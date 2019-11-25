import request from 'common/js/request'
var qs = require('qs')


export function getCategoryAndGenre() {
    return request({
        url: '/equip-args/contain-category-and-genre',
        method: 'get'
    })
}

export function saveEquipInfo(categoryId,data) {
    return request({
        url: `/equip-args/${categoryId}`,
        method: 'put',
        data:data
    })
}

export function getSuppliers() {
    return request({
        url: '/suppliers/list',
        method: 'get',
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
export function getGenreList() {
    return request({
        url: '/equip-args/contain-category-and-genre',
        method: 'get',
    })
}

export function addEquipInfo(params,data) {
    return request({
        url: '/equip-args',
        method: 'post',
        params:params,
        data:data
    })
}

export function getEquipById(id) {
    return request({
        url: `/equips/${id}`,
        method: 'get',
    })
}


/* 查询装备参数 */
export function equipArgsByName(params) {
    return request({
        url: "/equip/equipArgsByName",
        method: "GET",
        params
    })
}

/* 入库装备 */
export function inHouse(params ,data) {
    return request({
        url: `/equip/inHouse?${qs.stringify(params, { indices: false })}`,
        method: "POST",
        data
    })
}

/* 入库单删除 */
export function inHouseOrder(id) {
    return request({
        url: `/inouthouse/inHouseOrder/${id}`,
        method: "DELETE"
    })
}

/* 通过id找实体装备 */
export function findEquip(id) {
    return request({
        url: `/equip/equipById?id=${id}`,
        method: "GET"
    })
}

/* 新增装备信息 */
export function saveEquipArg(data) {
    return request({
        url: "/equip/saveEquipArg",
        method: "POST",
        data
    })
}

/* 更新装备参数 */
export function updateEquipArg(data) {
    return request({
        url: "/equip/updateEquipArg",
        method: "POST",
        data
    })
}

/* 更新装备信息 */
export function updateEquip(data) {
    return request({
        url: "/equip/updateEquip",
        method: "POST",
        data
    })
}

/* 获取所有供应商 */
export function getAllSupplier() {
    return request({
        url: "/supplier/findByName",
        method: "GET"
    })
}