import request from '@/utils/request'

export function saveOrder (param) {
  return request({
    url: '/eldlyrest/saveOrder?t=' + Date.now(),
    method: 'post',
    data: {
      param
    }
  })
}

export function listOrders (shopid, datestart, dateend, payway, pagenum, pagesize) {
  return request({
    url: '/eldlyrest/listOrder?t=' + Date.now(),
    method: 'get',
    params: {
      shopid,
      datestart,
      dateend,
      payway,
      pagenum,
      pagesize
    }
  })
}
