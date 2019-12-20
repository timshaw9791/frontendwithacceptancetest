import request from 'common/js/request'

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
        url: '/equipmaintain/scrap',
        method: 'post',
        params: {
            category:'MATURITY',
            rfids:data
        }
    })
}
export function scrapByProcess(data) {
    return request({
        url: '/equipmaintain/scrap',
        method: 'post',
        params: {
            category:'PROCESS',
            rfids:data
        }
    })
}