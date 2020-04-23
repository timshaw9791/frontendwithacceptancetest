import request from 'common/js/request'

/* 供应商管理 */
export function getSupplier(params) {
    return request({
        url: "/suppliers",
        method: "GET",
        params
    })
}

export function addSupplier(data) {
    return request({
        url: "/suppliers",
        method: "POST",
        data
    })
}

export function updateSupplier(data) {
    return request({
        url: "/suppliers/",
        method: "PUT",
        data
    })
}