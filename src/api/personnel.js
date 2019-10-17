import request from 'common/js/request'
import axios from 'axios'
import { baseURL } from 'api/config'


export function getRolesList() {
    return axios({
        url: `${baseURL}/identity/roles`,
        method: 'GET'
    })
}

export function syncFaceInfo() {
    return request({
        url: `${baseURL}/identity/syncFaceInfo`,
        method: "POST",
        data: {}
    })
}

export function syncUser() {
    return request({
        url: `${baseURL}/identity/syncUser`,
        method: 'POST'
    })
}

export function addUser(data) {
    return request({
        url: `${baseURL}/identity/user`,
        method: "POST",
        data
    })
}

export function modifyUser(data) {
    return request({
        url: `${baseURL}/identity/user`,
        method: "PUT",
        data
    })
}