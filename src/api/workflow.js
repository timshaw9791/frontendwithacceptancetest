import request from 'common/js/request'

export function scrappedUp(data) {
    return request({
        url: '/equip-scrap/admin-submit',
        params: data
    })
}

export function scrappedApproval(data) {
    return request({
        url: '/equip-scrap/leader-approve',
        params: data
    })
}
