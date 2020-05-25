import request from 'common/js/request'
var qs = require('qs')

// 根据名字查询
export function findScarEquipByNameLike(data, state) {
    return request({
        url: '/equip/findScarEquipByNameLike',
        method: 'get',
        params: data
    }, state)
}

export function scrap(data) {
    return request({
        url: `/equipMaintain/scrap?category=MATURITY&${qs.stringify(data,{indices:false})}`,
        method: 'post',
    }, false)
}
export function scrapByProcess(data, state) {
    return request({
        url: '/equipMaintain/scrap',
        method: 'post',
        params: {
            category:'PROCESS',
            rfids:data
        }
    }, state)
}