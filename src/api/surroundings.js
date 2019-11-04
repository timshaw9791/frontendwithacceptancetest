import request from 'common/js/request'
export function temperatureValue(data) {
    return request({
        method: 'post',
        url: '/environment/humitureQuery',
        params: data
    })
}

export function getEquipChargeRecordList(params) {
    return request({
        url: '/equip-charge-records/charging',
        method: 'get',
        params:params
    })
}

