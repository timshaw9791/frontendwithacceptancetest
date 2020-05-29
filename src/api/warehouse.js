import request from "common/js/request"


export function inHouse(rfids,serials,data, tipState) {
    return request({
        url: `/equip/inHouse?rfids=${rfids}&&serials=${serials}`,
        method: "POST",
        data
    }, tipState)
}
//单警柜金额统计all/statistic/cabinet-money
export function allPoliceStatistic() {
    return request({
        url: "/statistic/cabinet-money",
        method: "get",
        
    })
}
//单警柜金额统计all/statistic/cabinet-money
export function allPoliceStatisticCategories(id,search='') {
    return request({
        url: `/statistic/cabinet-money-categories?categories=${id}&search=${search}`,
        method: "get",
        
    })
}

//单警柜使用频次全部
export function allPoliceFrequency() {
    return request({
        url: "/statistic/cabinet-frequency",
        method: "get",
        
    })
}
//单警下三类柜子的统计
export function allPoliceFrequencyCategories(id,search='') {
    return request({
        url: `/statistic/cabinet-frequency-categories?categories=${id}&search=${search}`,
        method: "get",
        
    })
}

//单警报废件数
export function allPoliceScrap() {
    return request({
        url: "/statistic/cabinet-scrap",
        method: "get",
        
    })
}

//单警下三类柜子的统计
export function allPoliceScrapCategories(id,search='') {
    return request({
        url: `/statistic/cabinet-scrap-categories?categories=${id}&search=${search}`,
        method: "get",
        
    })
}
//单警维修件数
export function allPoliceRepair() {
    return request({
        url: "/statistic/cabinet-repair",
        method: "get",
        
    })
}

//单警下三类柜子的统计
export function allPoliceRepairCategories(id,search='') {
    return request({
        url: `/statistic/cabinet-repair-categories?categories=${id}&search=${search}`,
        method: "get",
        
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

export function safetyStock(data, tipState) {
    return request({
        url: `/category/safetyStock`,
        method: "POST",
        data
    }, tipState)
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

export function deleteGenreById(genreId, tipState) {
    return request({
        url: `/category/deleteGenre?genreId=${genreId}`,
        method: "DELETE",
    }, tipState)
}
export function deleteCategory(categoryId, tipState) {
    return request({
        url: `/category/deleteCategory?categoryId=${categoryId}`,
        method: "DELETE",
    }, tipState)
}
export function updateGenre(data, tipState) {
    return request({
        url: "/category/updateGenre",
        method: "POST",
        data
    }, tipState)
}

export function updateCategory(data, tipState) {
    return request({
        url: "/category/updateCategory",
        method: "POST",
        data
    }, tipState)
}

export function modifySupplier(data, tipState) {
    return request({
        url: "/suppliers",
        method: "POST",
        data
    }, tipState)
}

export function deleteSupplier(id, tipState) {
    return request({
        url: `/suppliers/${id}`,
        method: "DELETE"
    }, tipState)
}

/* 库房信息 */
export function getHouse(params) {
    return request({
        url: "/equip-args",
        method: "GET",
        params
    })
}


export function getHouseInfo() {
    return request({
        url: "/house/info",
        method: "GET",
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

export function setSafeStock(params, tipState) {
    return request({
        url: "/house-stocks/set-safe-stock",
        method: "PUT",
        params
    }, tipState)

}
