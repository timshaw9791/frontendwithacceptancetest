import request from 'common/js/request'


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