import axios from 'axios'
import request from "common/js/request"
import {baseURL} from "./config";

export function temperatureValue(data) {
    return request({
        method: 'post',
        url: '/environment/humitureQuery',
        params: data
    })
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
export function getEquipChargeRecordList(params) {
    return request({
        url: '/equip-charge-records/charging',
        method: 'get',
        params:params
    })
}

