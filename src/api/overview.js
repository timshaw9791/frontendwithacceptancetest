import request from 'common/js/request'


export function getReceiveList() {
    return request({
        url: '/equips/need-return',
        method: 'get'
    })
}

/* 工作概况 */
export function findAllData() {
    return request({
        url: "/equip/findAllData",
        method: "GET"
    })
}

/* 同步到手持机 */
export function findEquipsNeedChange() {
    return request({
        url: "/equip/findEquipsNeedChange",
        method: "GET"
    })
}


