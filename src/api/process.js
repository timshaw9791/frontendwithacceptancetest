import request from 'common/js/request'
import {baseBURL} from "./config";

export function getAllProcess() { // 新起流程列表
    return request({
        url: baseBURL + '/process-definitions',
        method: 'GET'
    })
}

export function activeTask(processInstanceId) {
    return request({
        url: baseBURL + "/workflow/active-task",
        method: "GET",
        params:{processInstanceId}
    })
}

export function processStart(params, data) { // 流程启动 通用接口
    return request({
        url: baseBURL + '/workflow/processes/start',
        method: 'POST',
        params,
        data
    })
}

export function transferStart(params, data) { // 调拨流程申请
    return request({
        url: baseBURL + '/workflow/transfer/start',
        method: 'POST',
        params,
        data
    })
}

export function transferOrders(processInstanceId) { // 调拨相关的单据
    return request({
        url: baseBURL + '/workflow/transfer/orders',
        method: 'GET',
        params:{processInstanceId}
    })
}

export function scrapOrders(processInstanceId) { // 报废流程
    return request({
        url: baseBURL + "/workflow/scrap/orders",
        method: "GET",
        params:{processInstanceId}
    })
}

export function SAODetail(params) { // 报废申请单详情
    return request({
        url: baseBURL + '/equip-order/process_id',
        method: 'GET',
        params
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

export function getHistoryTasks(processInstanceId) { // 历史任务实例
    return request({
        url: baseBURL + '/workflow/history-tasks',
        method: 'GET',
        params:{
            processInstanceId
        }
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

export function processOutbound(processDto){ // A端调拨出库
    return request({
        url:'/process/out-house',
        method:'POST',
        data: processDto
    },true)
}

export function processInbound(processDto){ // A端调拨入库
    return request({
        url:'/process/in-house',
        method:'POST',
        data: processDto
    },true)
}
