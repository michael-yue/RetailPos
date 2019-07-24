import request from '@/utils/request'

export function saveSystemParam (param) {
  return request({
    url: '/eldlyrest/saveSystemParam?t=' + Date.now(),
    method: 'post',
    data: {
      param
    }
  })
}

export function getSystemParam (shopid) {
  return request({
    url: '/eldlyrest/getSystemParam?t=' + Date.now(),
    method: 'get',
    params: {
      shopid
    }
  })
}
