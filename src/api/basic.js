import request from 'common/js/request';

export function delFile(data) {
    return request({
        url: '/upload/deleteFile',
        method: 'post',
        params: data
    })
}


export function getBosEntity(data) {
    return request({
        url: `/bos/bos-entities/${data}`,
        method: 'GET',
    })
}

