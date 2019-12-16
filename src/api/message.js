import request from 'common/js/request'
import { baseURL } from 'api/config'

export function readMsg(data) {
    return request({
        url: '/message/markReads',
        method: "post",
        params:data
    })
}

export function getMsgList(data) {
    return request({
        url: '/message/findByIdAndTitleLike',
        method: "GET",
        params: data
    })
}

export function getMsgListWithType(data) {
    return request({
        url: `${baseURL}/messages/by-user-and-type`,
        method: "GET",
        params: data
    })
}