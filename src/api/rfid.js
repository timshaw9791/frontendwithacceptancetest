import request from 'common/js/request'


export function getRfid() {
    return request({
        url: '/other/rfid-generic',
        method: 'get',
    })
}


export function saveRfid(data, tipState) {
    return request({
        url: '/other/rfid-generic',
        method: 'put',
        params: data
    }, tipState)
}


export function getRfidinfo(data, tipState) {
    return request({
        url: '/equips/by-rfidlist',
        method: 'put',
        data
    }, tipState)
}
