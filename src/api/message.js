import request from 'common/js/request'
var qs = require('qs')

export function readMsg(data) { // 消息标记为已读
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

export function markStar(params) { // 消息标星
    return request({
        url: '/messages/mark-star',
        method: 'POST',
        params
    })
}

export function allRead(params) { // 消息一键已读
    return request({
        url: '/messages/to-reads',
        method: 'POST',
        params
    })
}