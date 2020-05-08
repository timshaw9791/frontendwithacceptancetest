/*盘点接口*/
import request from 'common/js/request'

function inventoryOrder(method, data) {
    let requestObj = {
        url: '/inventory-order',
        method: method
    }
    switch (method) {
        case 'get':{
            requestObj.params = data
            break
        }
        case 'post':{
            requestObj.params = data
            break
        }
    }
    return request(requestObj)
}

export { inventoryOrder }