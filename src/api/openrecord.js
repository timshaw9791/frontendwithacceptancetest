import request from 'common/js/request'

export function findByOperatorName(data) {
    return request({
        url: '/gateOpenRecord/findByOperatorName',
        method: 'get',
        params: data
    })
}