import request from 'common/js/request';

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
