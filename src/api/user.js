import request from 'common/js/request'
import {baseURL} from "./config"

export function getUser(params) {//获取user列表
  return request({
    url: '/users',
    method: 'GET',
    params
  })
}

export function editUser(params,data) {//编辑user
  return request({
    url: `/users/${params}`,
    method: 'PUT',
    data
  })
}

export function addUser(data) {//新增user
  return request({
    url: `/users`,
    method: 'POST',
    data
  })
}

export function deleteUser(param) {//删除user
  return request({
    url: `/users/${param}`,
    method: 'DELETE',
  })
}

export function userInfoById(id) { // 通过id获取人员信息
  return request({
    url: `/identity/user/${id}`,
    method: 'GET'
  })
}