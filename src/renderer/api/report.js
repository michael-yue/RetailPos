import request from '@/utils/request'

export function getSalesReport (branchid, startdate, enddate) {
  return request({
    url: '/eldlyrest/getSalesReport',
    method: 'get',
    params: {
      branchid,
      startdate,
      enddate
    }
  })
}

export function getSalesGroupByDate (branchid, startdate, enddate) {
  return request({
    url: '/eldlyrest/getSalesGroupByDate',
    method: 'get',
    params: {
      branchid,
      startdate,
      enddate
    }
  })
}

export function getIncomeGroupByDate (branchid, startdate, enddate) {
  return request({
    url: '/eldlyrest/getIncomeGroupByDate',
    method: 'get',
    params: {
      branchid,
      startdate,
      enddate
    }
  })
}

export function getSalesByUserType (branchid, startdate, enddate) {
  return request({
    url: '/eldlyrest/getSalesByUserType',
    method: 'get',
    params: {
      branchid,
      startdate,
      enddate
    }
  })
}

export function getTransList (branchid, startdate, enddate, pagenum, pagesize) {
  return request({
    url: '/eldlyrest/getTransList',
    method: 'get',
    params: {
      branchid,
      startdate,
      enddate,
      pagenum,
      pagesize
    }
  })
}

export function deleteTrans (param) {
  return request({
    url: '/eldlyrest/deleteTrans',
    method: 'post',
    data: {
      param
    }
  })
}

export function getSalesToday (shopid) {
  return request({
    url: '/eldlyrest/getSalesToday',
    method: 'get',
    params: {
      shopid
    }
  })
}
