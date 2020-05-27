import request from 'common/js/request'
import { baseBURL } from 'api/config'


export function getReceiveList() {
    return request({
        url: '/equips/need-return',
        method: 'get'
    })
}

/* 工作概况 */
export function findAllData(state) {
    return request({
        url: "/equips/equips-situation",
        method: "GET"
    }, state)
}

/* 同步到手持机 */
export function findEquipsNeedChange() {
    return request({
        url: "/equips/hand-set",
        method: "GET"
    })
}

export function findByOneLine() {
    return request({
        url: "/equips/findByOneLine",
        method: "GET"
    })
}

export function policeEquipSituation() { // 公共柜+备用柜 统计
    return request({
        url: '/police-cabinets/equip-situation',
        method: 'GET'
    }, false)
}