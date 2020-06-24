import request from 'common/js/request';
import {baseBURL} from "@/api/config";

export function delFile(data, state) {
    return request({
        url: '/upload/deleteFile',
        method: 'post',
        params: data
    }, state)
}

export function getBosEntity(id,data=[], state) {
    return request({
        url: `/bos/bos-entities/${id}`,
        method: 'GET',
        params:{
            details:data
        }
    }, state)
}

export function jsqlPage(data, state) { // 根据jsql返回分页数据
    return request({
        url: '/bos/jsql/page',
        method: 'POST',
        data
    }, state)
}

export function bosEnums(params, state) { // 根据枚举分类获取常量值
    return request({
        url: '/bos/bos-enums/by-category',
        method: 'GET',
        params
    }, state)
}

export function bosEnumsPlatform() { // 获取平台端的枚举数据
    return request({
        url: baseBURL + '/bos/bos-enums',
        method: 'GET'
    })
}

export function getAllUnit() {
    return  request({
        url:baseBURL+'/organ-units/tree',
        method:'get'
    })
}