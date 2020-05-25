import request from 'common/js/request'
var qs = require('qs')
// 获取所有大类
export function getgenresList() {
    return request({
        url: '/genres',
        method: 'get',
    })
}

// 获取所有小类
export function getcategoriesList() {
    return request({
        url: '/categories',
        method: 'get',
    })
}

// 新增大类
export function addgenre(data, tipState) {
    return request({
        url: '/genres',
        method: 'POST',
        data
    }, tipState)
}

// 通过大类id编辑大类
export function editgenre(id,data, tipState) {
    return request({
        url: `/genres/${id}`,
        method: 'PUT',
        data
    }, tipState)
}

// 通过大类id删除大类
export function deletegenre(id, tipState) {
    return request({
        url: `/genres/${id}`,
        method: 'DELETE',
    }, tipState)
}

// 新增小类
export function addcategories(id,data, tipState) {
    return request({
        url: `/categories?genreId=${id}`,
        method: 'POST',
        data
    }, tipState)
}

// 通过小类id编辑小类
export function editcategories(id,data, tipState) {
    return request({
        url: `/categories/${id}`,
        method: 'PUT',
        data
    }, tipState)
}

// 通过小类id删除小类
export function deletecategories(id, tipState) {
    return request({
        url: `/categories/${id}`,
        method: 'DELETE',
    }, tipState)
}

// 小类设置安全库存
export function setsafety(data, tipState) {
    return request({
        url: '/categories/safety-stock',
        method: 'PUT',
        data
    }, tipState)
}

// 通过大类id获取该大类下的所有小类
export function getcategories(id) {
    return request({
        url: `/genres/${id}/categories`,
        method: 'GET',
    })
}

// 通过小类ID查找装备装备信息 （默认为未分配的装备信息）
export function getequipArg(params) {
    return request({
        url: `/equipArgs`,
        method: 'GET',
        params
    })
}
// 将未分配装备分配到小类下
export function distribution(id,params, tipState) {
    return request({
        url: `/relate/categories/${id}?${qs.stringify(params,{indices:false})}`,
        method: 'POST',
    }, tipState)
}
// 将装备参数从小类下删除
export function noAssigned(id,params, tipState) {
    return request({
        url: `/relate/category/${id}`,
        method: 'POST',
        params
    }, tipState)
}
// 通过大类id查找所有小类的安全库存和装备数量
export function getcategoriesSafety(id,params, tipState) {
    return request({
        url: `/genres/${id}`,
        method: 'GET',
        params
    }, tipState)
}