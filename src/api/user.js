import request from 'common/js/request'
import {baseURL} from "./config"

export function getUser(params) {//获取user列表
  return request({
    url: '/users',
    method: 'GET',
    params
  })
}

export function editUser(params,data, tipState) {//编辑user
  return request({
    url: `/users/${params}`,
    method: 'PUT',
    data
  }, tipState)
}

export function addUser(data, tipState) {//新增user
  return request({
    url: `/users`,
    method: 'POST',
    data
  }, tipState)
}

export function deleteUser(param, tipState) {//删除user
  return request({
    url: `/users/${param}`,
    method: 'DELETE',
  }, tipState)
}

export function userInfoById(id) { // 通过id获取人员信息
  return request({
    url: `/identity/user/${id}`,
    method: 'GET'
  })
}