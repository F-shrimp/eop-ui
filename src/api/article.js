import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'http://127.0.0.1:5050/show_apinfo',
    method: 'get',
    params: query
  })
}

export function fetchArticle(id) {
  return request({
    url: '/vue-element-admin/article/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createrespecInfo(data) {
  return request({
    url: 'http://127.0.0.1:5050/insert_info',
    method: 'get',
    params: data
  })
}

export function updaterespecInfo(data) {
  return request({
    url: 'http://127.0.0.1:5050/update_info',
    method: 'get',
    params: data
  })
}

export function findrespecInfo(data) {
  return request({
    url: 'http://127.0.0.1:5050/show_other_re',
    method: 'get',
    params: data
  })
}

export function deleterespecInfo(data) {
  return request({
    url: 'http://127.0.0.1:5050/del_info',
    method: 'get',
    params: data
  })
}

export function ips_getinfo(data) {
  return request({
    url: 'http://127.0.0.1:5050/ips_getinfo',
    method: 'get',
    params: data
  })
}