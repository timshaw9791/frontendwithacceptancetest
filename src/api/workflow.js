import request from 'common/js/request'
import {baseBURL} from "./config";
export function scrappedUp(data) {
    return request({
        url: '/equip-scrap/admin-submit',
        params: data
    })
}

export function scrappedApproval(data) {
    return request({
        url: '/equip-scrap/leader-approve',
        params: data
    })
}

export function taskDetail(params) { // 任务详情
    return request({
        url: baseBURL+'/workflow/task-detail',
        method:'GET',
        params
    })
}

export function processesDelete(params) {
return request({
    url: baseBURL+'/workflow/processes/delete',
    method:'DELETE',
    params
})
}


export function completeTask(taskId,params) {
    return request({
        url: baseBURL+`/workflow/v3/tasks/${taskId}/complete`,
        method:'PUT',
        data:params
    })
}





