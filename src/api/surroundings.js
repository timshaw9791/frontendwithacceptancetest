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