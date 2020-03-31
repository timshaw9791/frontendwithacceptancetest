import request from 'common/js/request'
import {baseBURL} from "./config"

export function getUser(params) {
  return request({
    url: baseBURL+'/users/page',
    method: 'GET',
    params
  })
}