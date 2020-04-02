import request from 'common/js/request'
import {baseBURL} from "./config";




export function equipMaintainScrapByProcess(rfids) {
    return request({
        url: `/equipMaintain/scrap?category=PROCESS&rfids=${rfids}`,
        method: 'post',
    })
}
export function transferApply(url) {
    return request({
        url: `${baseBURL}${url}`,
        method: 'get',
    })
}
export function historyProcessInstancesById(processInstanceId) {
    return request({
        url: `${baseBURL}/history/process-instances/${processInstanceId}?includeCurrentTask=true&includeProcessVariables=true`,
        method: 'get'
    })
}
export function processInstancesById(processInstanceId) {
    return request({
        url: `${baseBURL}/process-instances/${processInstanceId}?includeCurrentTask=true&includeProcessVariables=true`,
        method: 'get'
    })
}
export function findInHouseNumberLike(params) {
    return request({
        url: `/inouthouse/findInHouseNumberLike?`,
        method: 'get',
        params:params
    })
}
export function findOutHouseNumberLike(params) {
    return request({
        url: `/inouthouse/findOutHouseNumberLike?`,
        method: 'get',
        params:params
    })
}

export function checkUser(params) {
    return request({
        url: `${baseBURL}/workflow/check-user?`,
        method: 'put',
        params:params
    })
}
export function findByRfids(rfids) {
    return request({
        url: `/equip/findByRfids?rfids=${rfids}`,
        method: 'get',
    })
}
export function inHouses(data) {
    return request({
        url: `/equip/inHouses`,
        method: 'post',
        data
    })
}
export function outHouse(rfids) {
    return request({
        url: `/equip/outHouses?rfids=${rfids}`,
        method: 'post',
    })
}
export function equipsOutInbound(url,data) {
    return request({
        url: `${baseBURL}${url}`,
        method: 'put',
        data
    })
}

export function activeTasks(params) {
    return request({
        url: `${baseBURL}/tasks/active`,
        method: "GET",
        params
    })
}
export function workflow(processInstanceId,startUserId) {
    return request({
        url: `${baseBURL}/workflow?processInstanceId=${processInstanceId}&&startUserId=${startUserId}`,
        method: "DELETE"
    })
}
export function historyTasks(params) {
    return request({
        url: `${baseBURL}/history/tasks`,
        method: "GET",
        params
    })
}
export function getAllUnit() {
    return  request({
        url:`${baseBURL}/organ-units/tree`,
        method:'get'
    })
}
export function getUser(organUnitId) {
    return  request({
        url:`${baseBURL}/users/by-organ-unit?organUnitId=${organUnitId}&role=ADMIN`,
        method:'get'
    })
}
export function getPlatformHouse(id) {
    return  request({
        url:`${baseBURL}/houses/by-organ-unit?organUnitId=${id}`,
        method:'get'
    })
}


export function getHouseInfo() {
    return  request({
        url:`/house/info`,
        method:'get'
    })
}

export function getEquipArgs() {
    return  request({
        url:`${baseBURL}/equip-args`,
        method:'get'
    })
}

export function getApplyLeader(params) {
    return  request({
        url:`${baseBURL}/process-configs/by-organ-unit-and-type`,
        method:'get',
        params:params
    })
}

export function directRefill(data,nextAssignee,processConfigId) {
    return  request({
        url:`${baseBURL}/workflow/direct-allot/apply?nextAssignee=${nextAssignee}&&taskId=${processConfigId}`,
        method:'put',
        data
    })
}
export function scrapRefill(data,nextAssignee,processConfigId) {
    return  request({
        url:`${baseBURL}/workflow/scrap/apply?nextAssignee=${nextAssignee}&&taskId=${processConfigId}`,
        method:'put',
        data
    })
}
export function transferRefill(data,nextAssignee,processConfigId) {
    return  request({
        url:`${baseBURL}/workflow/transfer/apply?nextAssignee=${nextAssignee}&&taskId=${processConfigId}`,
        method:'put',
        data
    })
}
export function transferStart(data,nextAssignee,processConfigId) {
    return  request({
        url:`${baseBURL}/workflow/transfer/start?nextAssignee=${nextAssignee}&&processConfigId=${processConfigId}`,
        method:'post',
        data
    })
}
export function directStarts(data,nextAssignee,processConfigId) {
    return  request({
        url:`${baseBURL}/workflow/direct-allot/start?nextAssignee=${nextAssignee}&&processConfigId=${processConfigId}`,
        method:'post',
        data
    })
}

export function equipById(id) {
    return  request({
        url:`/equip/findEquipsByRfidAndNameAndModel?search=${id}`,
        method:'get',
    })
}
export function scrapStarts(data,nextAssignee,processConfigId) {
    return  request({
        url:`${baseBURL}/workflow/scrap/start?nextAssignee=${nextAssignee}&&processConfigId=${processConfigId}`,
        method:'post',
        data
    })
}

/***********  工作流接口 ************/
export function getAllProcess() { // 获取所有流程定义
    return request({
        url: baseBURL+'/process-definitions',
        method: 'GET'
    })
}

export function getOrder(params) { // 申请单号
    return request({
        url: baseBURL+"/workflow/order",
        method: 'GET',
        params
    })
}

export function processStart(params, data) { // 流程启动
    return request({
        url: baseBURL+'/workflow/processes/start',
        method: 'POST',
        params,
        data
    })
}

export function processDetail(params) { // 流程内容
    return request({
      url: baseBURL+"/workflow/process-instance-detail",
      method: "GET",
      params
    })
  }

export function getHistoryTasks(params) { // 历史任务实例
    return request({
      url: baseBURL+'/workflow/history-tasks',
      method: 'GET',
      params
    })
  }

export function processDelete(params) { // 删除流程
    return request({
        url: baseBURL+'/workflow/processes/delete',
        method: 'DELETE',
        params
    })
}

export function complete(taskId, params, data) { // 流程操作(审核、驳回、重填后发起)
    return request({
      url: baseBURL+`/workflow/tasks/${taskId}/complete`,
      method: 'PUT',
      params,
      data
    })
  }

export function processDefinitions(params) { // 查询流程定义
    return request({
        url: baseBURL+'/process-definitions',
        method: 'GET',
        params
    })
}

export function myProcess(params) { // 查询我的流程
    return request({
        url: baseBURL+'/workflow/my-process',
        method: "GET",
        params
    })
}
































export function getMyhouse() {
    return  request({
        url:'/house',
        method:'get'
    })
}
export function getOrganUnitById(params) {
    return request({
        url: `${baseBURL}/architecture/findById`,
        method: 'get',
        params:params
    })
}
export function findHouseByOrganUnitId(organUnitId) {
    return  request({
        method:'get',
        url:`${baseBURL}/architecture/findHouseByOrganUnitId`,
        params:{organUnitId:organUnitId}
    })
}
export function equipArgListByHouseIds(houseId) {
    return  request({
        method: 'get',
        url: `${baseBURL}/equip-arg/by-houseIds/list`,
        params: {houseIds:houseId}
    })
}
export function findByUnitAdmin(unitId) {
    return  request({
        method: 'get',
        url: `${baseBURL}/identity/findByUnitAdmin`,
        params: {unitId: unitId}
    })
}
export function byOrganUnitAndTransferType(organUnitId,transferType) {
    return  request({
        method: 'get',
        url: `${baseBURL}/process-level/by-organ-unit-and-transfer-type`,
        params: {
            organUnitId: organUnitId,
            transferType: transferType
        }
    })
}


export function organUnitInfo() {
    return  request({
        method: 'get',
        url: `${baseBURL}/architecture/organUnitInfo`,
    })
}
export function equipsByRfidList(data) {
    return  request({
        method: 'PUT',
        url: '/equips/by-rfidlist',
        data: data
    })
}
export function tagNeedScrap(equipList) {
    return  request({
        method: 'put',
        url: '/equips/tag-need-scrap',
        data: equipList
    })
}


