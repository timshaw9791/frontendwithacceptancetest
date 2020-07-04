import request from 'common/js/request'
import {baseBURL} from "./config";

let scrapUrl = baseBURL + '/workflow/scrap',
    transferUrl = baseBURL + '/workflow/transfer',
    directUrl = baseBURL + '/direct_allot'

// 报废流程
export function scrapStart(params, data) {
    return request({
        url: scrapUrl + '/start',
        method: 'POST',
        params,
        data
    })
}

export function scrapOrders(processInstanceId) {
    return request({
        url: scrapUrl+'/orders',
        method: "GET",
        params: {processInstanceId}
    })
}


export function scrapReapply(taskId, data) {
    return request({
        url: scrapUrl+'/reapply',
        method: "PUT",
        params: {taskId},
        data
    })
}

// 调拨:包含调拨、直调
export function allocateStart(processDefinitionKey, data, allocateCategory) {
    let tempUrl = allocateCategory === 'TRANSFER' ? transferUrl : directUrl
    return request({
        url: tempUrl + '/start',
        method: 'POST',
        params: {
            processDefinitionKey
        },
        data
    })
}

export function allocateReapply(taskId, data, allocateCategory) { // 调拨重填:包含调拨、直调
    let tempUrl = allocateCategory === 'TRANSFER' ? transferUrl : directUrl
    return request({
        url: tempUrl + '/reapply',
        method: 'GET',
        params: {taskId},
        data
    })
}

export function allocateOrders(processInstanceId,allocateCategory) { // 调拨相关的单据
    let tempUrl = allocateCategory === 'TRANSFER' ? transferUrl : directUrl
    return request({
        url: tempUrl + '/orders',
        method: 'GET',
        params: {processInstanceId}
    })
}




export function transferReapply(taskId, data) { // 调拨重填
    return request({
        url: baseBURL + '/workflow/transfer/reapply',
        method: 'GET',
        params: {taskId},
        data
    })
}



export function getHistoryTasks(processInstanceId) { // 历史任务实例
    return request({
        url: baseBURL + '/workflow/history-tasks',
        method: 'GET',
        params: {
            processInstanceId
        }
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

export function activeTask(processInstanceId) { // 流程的当前任务
    return request({
        url: baseBURL + "/workflow/active-task",
        method: "GET",
        params: {processInstanceId}
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

export function processOutbound(taskId, processDto) { // A端流程出库(通过状态判断)
    return request({
        url: `/process/out-houses`,
        method: 'POST',
        params: {
            taskId
        },
        data: processDto
    }, true)
}

export function processInbound(taskId, processDto) { // A端调拨入库
    return request({
        url: '/process/in-house',
        method: 'POST',
        params: {
            taskId
        },
        data: processDto
    }, true)
}

export function processesDelete(processInstanceId) { //作废
    return request({
        url: baseBURL + '/workflow/processes/delete',
        method: 'DELETE',
        params: {
            processInstanceId
        },
    },true)
}


export function processAudit(taskId, data) { //审批
    return request({
        url: baseBURL + `/workflow/audit`,
        method: 'PUT',
        params: {
            taskId
        },
        data
    })
}

export function directStart(processDefinitionKey, data) { // 直调流程申请
    return request({
        url: baseBURL + '/direct_allot/start',
        method: 'POST',
        processDefinitionKey: {
            processDefinitionKey
        },
        data
    })
}


export function transferOrders(processInstanceId) { // 调拨相关的单据
    return request({
        url: baseBURL + '/workflow/transfer/orders',
        method: 'GET',
        params: {processInstanceId}
    })
}


export function transferStart(processDefinitionKey, data) { // 调拨流程申请
    return request({
        url: transferUrl + '/start',
        method: 'POST',
        params: {
            processDefinitionKey
        },
        data
    })
}
