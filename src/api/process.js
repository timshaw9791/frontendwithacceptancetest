import request from 'common/js/request'
import {baseBURL} from "./config";

/***********  工作流接口 ************/
export function getAllProcess() { // 获取所有流程定义
    return request({
        url: baseBURL + '/process-definitions',
        method: 'GET'
    })
}

export function SAODetail(params) { // 报废申请单详情
    return request({
        url: baseBURL + '/equip-order/process_id',
        method: 'GET',
        params
    })
}

export function processStart(params, data) { // 流程启动
    return request({
        url: baseBURL + '/workflow/processes/start',
        method: 'POST',
        params,
        data
    })
}

export function processDetail(params) { // 流程内容
    return request({
        url: baseBURL + "/workflow/process-instance-detail",
        method: "GET",
        params
    })
}

export function processwarehouseDetail(params) { // 流程内容
    return request({
        url: baseBURL + "/equip-order/process-instance-id",
        method: "GET",
        params
    })
}

export function getHistoryTasks(params) { // 历史任务实例
    return request({
        url: baseBURL + '/workflow/history-tasks',
        method: 'GET',
        params
    })
}

export function processDelete(params) { // 删除流程
    return request({
        url: baseBURL + '/workflow/processes/delete',
        method: 'DELETE',
        params
    })
}

export function complete(taskId, params, data) { // 流程操作(审核、驳回、重填后发起)
    return request({
        url: baseBURL + `/workflow/tasks/${taskId}/complete`,
        method: 'PUT',
        params,
        data
    })
}

export function processDefinitions(params) { // 查询流程定义
    return request({
        url: baseBURL + '/process-definitions',
        method: 'GET',
        params
    })
}

export function myProcess(params) { // 查询我的流程
    return request({
        url: baseBURL + '/workflow/my-process',
        method: "GET",
        params
    })
}

export function todoTask(params) { // 查询待办任务
    return request({
        url: baseBURL + '/workflow/todo-task',
        method: 'GET',
        params
    })
}

export function doneTask(params) { // 查询已办任务
    return request({
        url: baseBURL + '/workflow/done-task',
        method: 'GET',
        params
    })
}

export function doneProcess(params) { // 查询办结任务
    return request({
        url: baseBURL + '/workflow/done-process',
        method: 'GET',
        params
    })
}


export function getMyhouse() {
    return request({
        url: '/house',
        method: 'get'
    })
}

export function getOrganUnitById(params) {
    return request({
        url: `${baseBURL}/architecture/findById`,
        method: 'get',
        params: params
    })
}

export function findHouseByOrganUnitId(organUnitId) {
    return request({
        method: 'get',
        url: `${baseBURL}/architecture/findHouseByOrganUnitId`,
        params: {organUnitId: organUnitId}
    })
}

export function equipArgListByHouseIds(houseId) {
    return request({
        method: 'get',
        url: `${baseBURL}/equip-arg/by-houseIds/list`,
        params: {houseIds: houseId}
    })
}

export function findByUnitAdmin(unitId) {
    return request({
        method: 'get',
        url: `${baseBURL}/identity/findByUnitAdmin`,
        params: {unitId: unitId}
    })
}

export function byOrganUnitAndTransferType(organUnitId, transferType) {
    return request({
        method: 'get',
        url: `${baseBURL}/process-level/by-organ-unit-and-transfer-type`,
        params: {
            organUnitId: organUnitId,
            transferType: transferType
        }
    })
}


export function organUnitInfo() {
    return request({
        method: 'get',
        url: `${baseBURL}/architecture/organUnitInfo`,
    })
}

export function equipsByRfidList(data) {
    return request({
        method: 'PUT',
        url: '/equips/by-rfidlist',
        data: data
    })
}

export function tagNeedScrap(equipList) {
    return request({
        method: 'put',
        url: '/equips/tag-need-scrap',
        data: equipList
    })
}


