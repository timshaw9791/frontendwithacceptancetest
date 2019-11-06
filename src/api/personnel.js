import request from 'common/js/request'
import axios from 'axios'
import { baseURL } from 'api/config'


export function getRolesList() {
    return axios({
        url: `${baseURL}/identity/roles`,
        method: 'GET'
    })
}
export function saveUser(data) {
    return request({
        url: '/identity/user',
        method: 'put',
        data
    })
}

export function getIdentityUserById(id) {
    return axios({
        url: `${baseURL}/identity/user/${id}`,
        method: 'GET'
    })
}
export function getOrganUnitById(id) {
    return axios({
        url: `${baseURL}/architecture/organUnit/${id}`,
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

export function getUserList(data) {
    return axios({
        url: `${baseURL}/identity/users`,
        method: "GET",
        params: data
    })
}