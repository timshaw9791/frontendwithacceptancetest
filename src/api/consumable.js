import request from 'common/js/request'


export function getConsumableList(data) {
    return request({
        url: '/consumable/findConsumableByName',
        method: 'get',
        params: data
    })
}

export function addConsumable(data) {
    return request({
        url: '/consumable/saveConsumable',
        method: 'post',
        data:data
    })
}

export function updateConsumable(data) {
    return request({
        url: '/consumable/updateConsumable',
        method: 'post',
        data:data
    })
}

export function receiveConsumable(data) {
    return request({
        url: '/consumable/receiveConsumable',
        method: 'post',
        data:data
    })
}

export function updateConsumableName(data) {
    return request({
        url: '/consumable/updateNameAndDescribes',
        method: 'post',
        data:data
    })
}