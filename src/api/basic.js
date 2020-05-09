import request from 'common/js/request';

export function delFile(data) {
    return request({
        url: '/upload/deleteFile',
        method: 'post',
        params: data
    })
}

export function getBosEntity(id,data=[]) {
    return request({
        url: `/bos/bos-entities/${id}`,
        method: 'GET',
        params:{
            details:data
        }
    })
}

export function jsqlPage(data) { // 根据jsql返回分页数据
    return request({
        url: '/bos/jsql/page',
        method: 'POST',
        data
    })
}

