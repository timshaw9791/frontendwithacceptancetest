import request from 'common/js/request'

/* 供应商管理 */
export function getSupplier(params) {
    return request({
        url: "/suppliers",
        method: "GET",
        params
    })
}

export function addSupplier(data, tipState) {
    return request({
        url: "/suppliers",
        method: "POST",
        data
    }, tipState)
}

export function updateSupplier(data, tipState) {
    return request({
        url: `/suppliers/${data.id}`,
        method: "PUT",
        data
    }, tipState)
}