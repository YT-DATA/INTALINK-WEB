import request from '@/utils/request'

// 查询关联管理列表
export function dataRelationshiplists(query,data) {
    return request({
        url: '/dataTableRelation/lists?' + data,
        method: 'post',
        data: query
    })
}

// 查询主模型下拉列表
export function selectModelAll(query) {
    return request({
        url: '/dataTableRelation/selectModel',
        method: 'get',
        params: query
    })
}

// 根据模型id查询主数据表下拉列表
export function selectAllByModelId(dataModelId) {
    return request({
        url: '/dataTableRelation/selectTable?' + dataModelId,
        method: 'get',
    })
}

// 根据表id查询主数据项下拉列表
export function selectAllByTableId(dataTableId) {
    return request({
        url: '/dataTableRelation/selectColumn?' + dataTableId,
        method: 'get',
    })
}

// 查询关联关系下拉列表
export function selectTableRelation(query) {
    return request({
        url: '/dataTableRelation/selectTableRelation',
        method: 'get',
        params: query
    })
}

// 批量删除关联关系
export function deleteTableRelation(Ids) {
    return request({
        url: '/dataTableRelation/' + Ids,
        method: 'delete'
    })
}

// 新增或者保存
export function insertOrUpdateF(query,data) {
    return request({
        url: '/dataTableRelation/insertOrUpdate?' + data,
        method: 'post',
        data: query
    })
}


// 查询方法列表
export function methodsLists(query) {
    return request({
        url: '/evaluationMethod/lists',
        method: 'get',
        params: query
    })
}


// 新增或修改方法
export function insertOrUpdateMethods(query,data) {
    return request({
        url: '/evaluationMethod/insertOrUpdate?' + data,
        method: 'post',
        data: query
    })
}

// 方法批量删除
export function deleteTableRelationMethod(Ids) {
    return request({
        url: '/evaluationMethod/' + Ids,
        method: 'delete'
    })
}

// 查询方案列表
export function schemeLists(query) {
    return request({
        url: '/scoringScheme/lists',
        method: 'get',
        params: query
    })
}

// 新增或修改方案
export function insertOrUpdateScheme(query,data) {
    return request({
        url: '/scoringScheme/insertOrUpdate?' + data,
        method: 'post',
        data: query
    })
}

// 方案批量删除
export function deleteTableRelationScheme(data) {
    return request({
        url: '/scoringScheme/remove?'+data,
        method: 'post',
        // data: params
    })
}

// 获取方案详情
export function scoringSchemeById(scoringSchemeId) {
    return request({
        url: '/scoringScheme/scoringSchemeById?' + scoringSchemeId,
        method: 'get',
    })
}

// 查询方法下拉列表
export function selectMethodAll() {
    return request({
        url: '/evaluationMethod/selectAll',
        method: 'get',
    })
}

// 新增或修改配置方案
export function insertOrUpdateSchemeMethod(query,data) {
    return request({
        url: '/scoringScheme/insert?' + data,
        method: 'post',
        data: query
    })
}

// 数据探查启动
export function relationshipAnalysisStart() {
    return request({
        url: '/relationshipAnalysis/start',
        method: 'get',
    })
}


// 数据探查状态获取
export function getRelationshipAnalysisStatus() {
    return request({
        url: '/relationshipAnalysis/getRelationshipAnalysisStatus',
        method: 'get',
    })
}


