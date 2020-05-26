import request from "common/js/request"

export function getDeviceConfig() { // 获取设备配置信息
    return request({
        url: '/environment/device-config',
        method: 'GET'
    }, false)
}

export function humitureQuery() { // 温湿度查询
    return request({
        method: 'GET',
        url: '/environment/humiture-query',
    }, false)
}

/* 充电 */
export function chargeStatus(params) { // 充电台状态查询
    return request({
        url: '/charge/status',
        method: 'GET',
        params
    }, false)
}
export function chargeInfo(params) {
    return request({
        url: '/charge/info',
        method: 'GET',
        params
    }, false)
}
export function chargeSwitch(params, tipState) {
    return request({
        url: '/charge/switch',
        method: 'POST',
        params
    }, tipState)
}

/* 除湿机 */
export function allDehumidifierStatus() {
    return request({
        url: '/dehumidifier/status-all',
        method: 'GET'
    }, false)
}
export function dehumidifierSwitch(params, tipState) {
    return request({
        url: '/dehumidifier/switch',
        method: 'GET',
        params
    }, tipState)
}


/* 烟雾 */
export function smokeThreshold() {
    return request({
        url: "/environment/smokeThreshold",
        method: "POST"
    })
}

export function setSmokeThreshold(params) {
    return request({
        url: "/environment/smokeThresholdSet",
        method: "POST",
        params
    })
}

export function Salutatory(data) {
    return request({
        url: '/exhibition/salutatory',
        method: 'POST',
        data:data
    })
}

export function dehumidifierStatus(params) { // 除湿机状态查询(单个)
    return request({
        url: '/environment/dehumidifierStatus',
        method: 'POST',
        params
    })
}

export function smokeQuery() { // 查询烟雾状态
    return request({
        url: '/environment/smokeQuery',
        method: 'POST'
    })
}

export function allAirConditionerStatus() { // 查询所有空调状态
    return request({
        url: '/environment/allAirConditionerStatus',
        method: 'POST'
    })
}

export function temperatureThreshold() { // 获取温度阈值信息
    return request({
        url: '/environment/temperatureThreshold',
        method: 'POST'
    })
}

export function temperatureThresholdSet(params) { // 设置温度阈值
    return request({
        url: '/environment/temperatureThresholdSet',
        method: 'POST',
        params
    })
}

export function airConditionerSwitch(params) { // 空调开关
    return request({
        url: '/environment/airConditionerSwitch',
        method: 'POST',
        params
    })
}

export function airConditionerStatus(params) { // 查询状态查询
    return request({
        url: '/environment/airConditionerStatus',
        method: 'POST',
        params
    })
}