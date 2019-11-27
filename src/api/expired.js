import request from 'common/js/request'

// 根据名字查询
export function findScarEquipByNameLike(data) {
    return request({
        url: '/equip/findScarEquipByNameLike',
        method: 'get',
        params: data
    })
}