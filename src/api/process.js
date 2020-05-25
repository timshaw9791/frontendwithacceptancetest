import request from 'common/js/request'
import {baseBURL} from "./config";

/***********  工作流接口 ************/
export function getAllProcess() { // 获取所有流程定义
    return request({
        url: baseBURL + '/process-definitions',
        method: 'GET'
    })
}

export function processStart(params, data, tipState) { // 流程启动
    return request({
        url: baseBURL + '/workflow/processes/start',
        method: 'POST',
        params,
        data
    }, tipState)
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

export function processDelete(params, tipState) { // 删除流程
    return request({
        url: baseBURL + '/workflow/processes/delete',
        method: 'DELETE',
        params
    }, tipState)
}

export function complete(taskId, params, data, tipState) { // 流程操作(审核、驳回、重填后发起)
    return request({
        url: baseBURL + `/workflow/tasks/${taskId}/complete`,
        method: 'PUT',
        params,
        data
    }, tipState)
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

export function todoProcess(params) { // 查询待办任务
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