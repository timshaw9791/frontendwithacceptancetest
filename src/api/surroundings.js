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

export function getChangeStationStatus(params) {
    return request({
        url: '/environment/chargeQuery',
        method: 'POST',
        params:params
    })
}

export function getEquipChargeRecordList(params) {
    return request({
        url: '/environment/chargeInfo',
        method: 'POST',
        params:params
    })
}

export function HunSwitch(params) {
    return request({
        url: '/environment/dehumidifierSwitch',
        method: 'POST',
        params:params
    })
}

export function Salutatory(data) {
    return request({
        url: '/exhibition/salutatory',
        method: 'POST',
        data:data
    })
}

export function getDehumidifierStatus() {
    return request({
        url: '/environment/allDehumidifierStatus',
        method: 'POST'
    })
}

