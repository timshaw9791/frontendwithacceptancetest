import request from 'common/js/request';

export function unReturn(data) {
    return request({
        url: '/equip-records/un-return-equips',
        method: 'GET',
        params: data
    })
}