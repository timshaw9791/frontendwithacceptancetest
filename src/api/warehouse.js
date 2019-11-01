import request from "common/js/request"

/* 供应商 */
export function getSuppliers(params) {
    return request({
        url: "/suppliers",
        method: "GET",
        params
    })
}

export function modifySupplier(data) {
    return request({
        url: "/suppliers",
        method: "POST",
        data
    })
}

export function deleteSupplier(id) {
    return request({
        url: `/suppliers/${id}`,
        method: "DELETE"
    })
}

