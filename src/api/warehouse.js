import request from "common/js/request"






export function inHouse(rfids,serials,data) {
    return request({
        url: `/equip/inHouse?rfids=${rfids}&&serials=${serials}`,
        method: "POST",
        data
    })
}
//jbql查询该警柜下的装备列表
export function cabinetEquip(data) {
    return request({
        url: `/bos/jsql/list`,
        method: "POST",
        data
    })
}

export function safetyStock(data) {
    return request({
        url: `/category/safetyStock`,
        method: "POST",
        data
    })
}
export function relateCategory(data) {
    return request({
        url: `/category/relateCategory`,
        method: "POST",
        params:data
    })
}
//获得柜子列表
export function getPoliceCabinets() {
    return request({
        url: "/police-cabinets",
        method: "get",
    })
}

export function assignPeople(params) {
    return request({
        url: "/police-cabinets/assign",
        method: "put",
        params:params
    })
}

export function relateCategories(categoryId,equipArgs ) {
    return request({
        url: `/category/relateCategories?categoryId=${categoryId}&equipArgs=${equipArgs}`,
        method: "POST",
    })
}
export function categorySaveCategory(data,genreId) {
    return request({
        url: `/category/saveCategory?genreId=${genreId}`,
        method: "POST",
        data
    })
}
export function categorySaveGenre(params) {
    return request({
        url: "/category/saveGenre",
        method: "POST",
        data:params
    })
}

export function categoryFindAll() {
    return request({
        url: "/category/findAll",
        method: "GET",
    })
}
export function findAllCategoryById(genreId) {
    return request({
        url: `/category/findAllCategory?genreId=${genreId}`,
        method: "GET",
    })
}
export function findAllEquipArgs(categoryId) {
    return request({
        url: `/category/findAllEquipArgs?categoryId=${categoryId}`,
        method: "GET",
    })
}

export function deleteGenreById(genreId) {
    return request({
        url: `/category/deleteGenre?genreId=${genreId}`,
        method: "DELETE",
    })
}
export function deleteCategory(categoryId) {
    return request({
        url: `/category/deleteCategory?categoryId=${categoryId}`,
        method: "DELETE",
    })
}
export function updateGenre(data) {
    return request({
        url: "/category/updateGenre",
        method: "POST",
        data
    })
}

export function updateCategory(data) {
    return request({
        url: "/category/updateCategory",
        method: "POST",
        data
    })
}
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
export function getHouse(params) {
    return request({
        url: "/equip-args",
        method: "GET",
        params
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
