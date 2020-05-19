import request from 'common/js/request'

export function getHouseInfo() {
    return request({
        url:'/house/info',
        method:'get'
    })
}