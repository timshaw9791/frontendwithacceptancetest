import request from 'common/js/request'
import {baseURL} from "./config"

export function getUser(params) {//获取user列表
  return request({
    url: baseURL+'/identity/users',
    method: 'GET',
    params
  })
}

export function editUser(params,data) {//编辑user
  return request({
    url: baseURL+`/identity/users/${params}`,
    method: 'PUT',
    data
  })
}

export function addUser(data) {//新增user
  return request({
    url: baseURL+`/identity/users`,
    method: 'POST',
    data
  })
}

export function deleteUser(param) {//删除user
  return request({
    url: baseURL+`/identity/users/${param}`,
    method: 'DELETE',
  })
}