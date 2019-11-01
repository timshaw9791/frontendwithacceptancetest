import request from 'common/js/request'
import { baseURL } from 'api/config'

export function readMsg(id) {
    return request({
        url: `${baseURL}/messages/${id}/read`,
        method: "PUT"
    })
}

export function getMsgList(data) {
    return request({
        url: `${baseURL}/messages/by-user`,
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