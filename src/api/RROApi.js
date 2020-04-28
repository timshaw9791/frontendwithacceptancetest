// receiveReturnOrder Api
// 领取归还单API

import request from "../common/js/request";

export function getReceiveOrderList() {
    return request({
        url: "/receive-return-orders",
        method: "GET",
    })
}


