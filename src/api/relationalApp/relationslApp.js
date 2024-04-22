import request from '@/utils/request'

// 查询部门下拉树结构
export function getModelTreeApi(query) {
  return request({
    url: '/dataTableRelation/selectModel',
    method: 'get',
    params: query,
  })
}
// 根据数据模型查询数据表
export function getSheetTreeApi(query) {
  return request({
    url: '/dataTableRelation/selectTable',
    method: 'get',
    params: query,
  })
}
// 根据数据表查询数据项
export function getItemTreeApi(query) {
  return request({
    url: '/dataTableRelation/selectColumn',
    method: 'get',
    params: query,
  })
}