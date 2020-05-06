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

