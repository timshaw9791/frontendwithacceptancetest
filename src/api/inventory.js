/*盘点接口*/
import request from 'common/js/request'

function getInventoryOrderList(pagination) {
    return request({
        url: '/inventory-orders',
        method: 'GET',
        params: pagination
    })
}

function addInventoryOrder(inventoryOrder) {
    return request({
        url: `/inventory-orders`,
        method: 'POST',
        data: inventoryOrder
    })
}

function currentInventory(rfids,startTime) {
    return request({
        url:`/inventory-orders/current?rfids=${rfids}&startTime=${startTime}`,
        method: 'POST'
    })
}

export {getInventoryOrderList, addInventoryOrder, currentInventory}