import request from '@/utils/request'

// 查询关系图
export function graphlist(query) {
    return request({
        url: '/table/relation/graph',
        method: 'get',
        params: query
    })
}

//关系图高亮
export function highlight(query) {
    return request({
        url: '/table/relation/graph/highlight',
        method: 'get',
        params: query
    })
}
