import request from '@/utils/request'

export function saveOrder (shopid, orderline, shouldpayamount, payedamount, changeamount, payway, qrcode, cardnumber) {
  return request({
    url: '/eldlyrest/saveOrder?t=' + Date.now(),
    method: 'get',
    params: {
      shopid,
      orderline,
      shouldpayamount,
      payedamount,
      changeamount,
      payway,
      qrcode,
      cardnumber
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
