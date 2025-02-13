import request from '@/utils/request'

// 查询数据源列表
export function listSource(query) {
    return request({
        url: '/dataSourceBasic/lists',
        method: 'get',
        params: query
    })
}

// 查询数据模型列表
export function dataModelList(query) {
    return request({
        url: '/dataModel/lists',
        method: 'get',
        params: query
    })
}

// 查询数据表列表
export function dataTableList(query) {
    return request({
        url: '/dataTable/lists',
        method: 'get',
        params: query
    })
}

// 查询数据项列表
export function dataColumnList(query) {
    return request({
        url: '/dataColumn/lists',
        method: 'get',
        params: query
    })
}

// 查询系统数据列表
export function systemBasicList(query) {
    return request({
        url: '/systemBasic/lists',
        method: 'get',
        params: query
    })
}

// 查询全部模型下拉列表
export function dataModelSelectAll(query) {
    return request({
        url: '/dataModel/selectAll',
        method: 'get',
        params: query
    })
}

// 查询全部数据源下拉列表
export function dataSourceBasicSelectAll(query) {
    return request({
        url: '/dataSourceBasic/selectAll',
        method: 'get',
        params: query
    })
}

// 根据id查询全部数据表下拉列表
export function selectAllByModelId(ModelId) {
    return request({
        url: '/dataTable/selectAllByModelId/' + ModelId,
        method: 'get',
    })
}

// 新增数据模型
export function insertDataModelList(data) {
    return request({
        url: '/dataModel/insertOrUpdate',
        method: 'post',
        data: data
    })
}

// 新增数据源
export function insertSourceBasicList(data) {
    return request({
        url: '/dataSourceBasic/insertOrUpdate',
        method: 'post',
        data: data
    })
}

// 新增数据表
export function insertDataTableList(data) {
    return request({
        url: '/dataTable/insertOrUpdate',
        method: 'post',
        data: data
    })
}


// 新增数据项
export function insertDataColumnList(data) {
    return request({
        url: '/dataColumn/insertOrUpdate',
        method: 'post',
        data: data
    })
}

// 新增系统数据
export function insertSystemBasicList(data) {
    return request({
        url: '/systemBasic/insertOrUpdate',
        method: 'post',
        data: data
    })
}


// 删除数据模型
export function deleteDataModel(Ids) {
    return request({
        url: '/dataModel/' + Ids,
        method: 'delete'
    })
}

// 删除数据源
export function deleteSourceBasic(Ids) {
    return request({
        url: '/dataSourceBasic/' + Ids,
        method: 'delete'
    })
}

// 删除数据表
export function deleteDataTable(Ids) {
    return request({
        url: '/dataTable/' + Ids,
        method: 'delete'
    })
}

// 删除数据项
export function deleteDataColumn(Ids) {
    return request({
        url: '/dataColumn/' + Ids,
        method: 'delete'
    })
}

// 删除系统数据
export function deleteSystemBasic(Ids) {
    return request({
        url: '/systemBasic/' + Ids,
        method: 'delete'
    })
}

// 根据id或许模型绑定信息
export function selectDataModelById(Ids) {
    return request({
        url: '/dataModel/selectDataModelById/' + Ids,
        method: 'delete'
    })
}

// 获取数据源数量
export function sourceBasicCount() {
    return request({
        url: '/dataSourceBasic/count',
        method: 'get',
    })
}

// 获取系统数量
export function systemBasicCount() {
    return request({
        url: '/systemBasic/count',
        method: 'get',
    })
}

// 获取模型数量
export function dataModelCount() {
    return request({
        url: '/dataModel/count',
        method: 'get',
    })
}

// 获取模型数量
export function dataTableCount() {
    return request({
        url: '/dataTable/count',
        method: 'get',
    })
}
// 查询数据表列表
export function getDataModelById(query) {
    return request({
        url: '/dataSourceBasic/getDataModelById',
        method: 'get',
        params: query
    })
}
