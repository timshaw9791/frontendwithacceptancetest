import request from 'common/js/request'
import {baseURL} from "./config"

export function getUser(params) {//获取user列表
  return request({
    url: baseURL+'/users',
    method: 'GET',
    params
  })
}

export function editUser(params,data) {//编辑user
  return request({
    url: baseURL+`/users/${params}`,
    method: 'PUT',
    data
  })
}

export function addUser(data) {//新增user
  return request({
    url: baseURL+`/users`,
    method: 'POST',
    data
  })
}

export function deleteUser(param) {//删除user
  return request({
    url: baseURL+`/users/${param}`,
    method: 'DELETE',
  })
}