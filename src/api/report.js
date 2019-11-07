import request from 'common/js/request'


export function getGenreList() {
    return request({
        url: '/genres/list',
        method: 'get'
    })
}
export function getCategoryList(params) {
    return request({
        url: '/categories/by-genreId',
        method: 'get',
        params:params
    })
}
export function getSafeStockList() {
    return request({
        url: '/house-stocks',
        method: 'get'
    })
}


