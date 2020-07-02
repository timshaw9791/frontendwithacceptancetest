/*盘点接口*/
import request from 'common/js/request'

function getInventoryOrderList(pagination) {
    return request({
        url: '/inventory-orders',
        method: 'GET',
        params: data
    })
}

function addInventoryOrder(inventoryOrder) {
    return request({
        url: `/inventory-orders`,
        method: 'POST',
        data: inventoryOrder
    })
}

function currentInventory(rfids) {
    return request({
        url:`/inventory-orders/current?rfids=${rfids}`,
        method: 'POST'
    })
}

export {getInventoryOrderList, addInventoryOrder, currentInventory}