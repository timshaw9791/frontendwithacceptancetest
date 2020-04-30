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
export function addTraining(data) {
    return request({
        url: `/equip-train`,
        method: "POST",
        data
    })
}
// 编辑教学培训
export function editTraining(id,data) {
    return request({
        url: `/equip-train/${id}`,
        method: "PUT",
        data
    })
}
// 删除教学培训
export function deleteTraining(id) {
    return request({
        url: `/equip-train/${id}`,
        method: "DELETE"
    })
}