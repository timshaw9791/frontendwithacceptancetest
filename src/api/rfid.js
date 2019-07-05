import request from 'common/js/request'


export function getRfid() {
    return request({
        url: '/other/rfid-generic',
        method: 'get',
    })
}


export function saveRfid(data) {
    return request({
        url: '/other/rfid-generic',
        method: 'put',
        params: data
    })
}


export function getRfidinfo(data) {
    return request({
        url: '/equips/by-rfidlist',
        method: 'put',
        data
    })
}
