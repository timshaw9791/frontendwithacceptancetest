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

/* 库房信息 */
export function getHouse() {
    return request({
        url: "/house",
        method: "GET"
    })
}

/* 标准库存 */
export function getHouseStocks(params) {
    return request({
        url: "/house-stocks",
        method: "GET",
        params
    })
}

export function setSafeStock(params) {
    return request({
        url: "/house-stocks/set-safe-stock",
        method: "PUT",
        params
    })

}
