import request from '@/utils/request'

export function getList(params) {
  return request({
    url: 'http://127.0.0.1:5050/show_apinfo',
    // url: '/vue-admin-template/table/list',
    method: 'get',
    params
  })
}

