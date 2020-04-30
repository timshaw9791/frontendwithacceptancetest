// receiveReturnOrder Api
// 领取归还单API

import request from "../common/js/request";

export function getReceiveOrderList(data) {
    return request({
        url: "/receive-return-orders",
        method: "GET",
        params:data
    })
}


