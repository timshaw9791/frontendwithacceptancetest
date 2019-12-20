import request from 'common/js/request'
var qs = require('qs')

// 根据名字查询
export function findScarEquipByNameLike(data) {
    return request({
        url: '/equip/findScarEquipByNameLike',
        method: 'get',
        params: data
    })
}

export function scrap(data) {
    return request({
        url: `/equipMaintain/scrap?category=MATURITY&${qs.stringify(data,{indices:false})}`,
        method: 'post',
    })
}
export function scrapByProcess(data) {
    return request({
        url: '/equipMaintain/scrap',
        method: 'post',
        params: {
            category:'PROCESS',
            rfids:data
        }
    })
}