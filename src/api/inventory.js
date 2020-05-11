/*盘点接口*/
import request from 'common/js/request'
// data 里面需要 inventoryOrder 和 rfids 列表
function inventoryOrder(method, data) {
    let requestObj = {
        url: '/inventory-orders',
        method: method
    }
    switch (method) {
        case 'get':{
            requestObj.params = data
            break
        }
        case 'post':{
            requestObj.data = data.inventoryOrder
            requestObj.url = `/inventory-orders?rfids=${data.rfids}`
            break
        }
    }
    return request(requestObj)
}

export { inventoryOrder }