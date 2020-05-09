import request from 'common/js/request'
var qs = require('qs')

export function readMsg(data) {
    return request({
        url: `/messages/mark-reads?${qs.stringify(data,{indices:false})}`,
        method: "post",
    })
}
export function getMsgList(params) {
    return request({
        url: `/messages/title?${qs.stringify(params, {indices:false})}`,
        method: "GET",
        // params
    })
}