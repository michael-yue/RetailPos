import request from '@/utils/request'

export function saveSystemParam (shopId, backPrinter, frontPrinter, frontPrintCount, printBack, printFront) {
  return request({
    url: '/eldlyrest/saveSystemParam?t=' + Date.now(),
    method: 'get',
    params: {
      shopId, backPrinter, frontPrinter, frontPrintCount, printBack, printFront
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
