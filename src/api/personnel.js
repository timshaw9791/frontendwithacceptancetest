import request from 'common/js/request'
import axios from 'axios'
import { baseURL } from 'api/config'


export function saveUser(data, tipState) {
    return request({
        url: '/identity/user',
        method: 'put',
        data
    }, tipState)
}

export function addUser(data, tipState) {
    return request({
        url: `${baseURL}/identity/user`,
        method: "POST",
        data
    }, tipState)
}

export function delectUser(id, tipState) {
    return request({
        url: `${baseURL}/identity/user/${id}`,
        method: "delete",
    }, tipState)
}

export function modifyUser(data, tipState) {
    return request({
        url: `${baseURL}/identity/user`,
        method: "PUT",
        data
    }, tipState)
}

export function getUserList(data, tipState) {
    return axios({
        url: `${baseURL}/identity/users`,
        method: "GET",
        params: data
    }, tipState)
}