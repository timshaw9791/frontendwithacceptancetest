import request from 'common/js/request'

/* 供应商管理 */
export function supplierFindByName(params) {
  return request({
    url: "/supplier/findByName",
    method: "GET",
    params
  })
}

export function saveSupplier(data) {
  return request({
    url: "/supplier/saveSupplier",
    method: "POST",
    data
  })
}

export function updateSupplier(data) {
  return request({
    url: "/supplier/updateSupplier",
    method: "POST",
    data
  })
}