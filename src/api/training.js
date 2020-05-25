import request from "common/js/request"

// 获取教学培训列表
export function getTraining(data) {
    return request({
        url: `/equip-train`,
        method: "GET",
        params:data
    })
}
// 新增教学培训
export function addTraining(data, tipState) {
    return request({
        url: `/equip-train`,
        method: "POST",
        data
    }, tipState)
}
// 编辑教学培训
export function editTraining(id,data, tipState) {
    return request({
        url: `/equip-train/${id}`,
        method: "PUT",
        data
    }, tipState)
}
// 删除教学培训
export function deleteTraining(id, tipState) {
    return request({
        url: `/equip-train/${id}`,
        method: "DELETE"
    }, tipState)
}