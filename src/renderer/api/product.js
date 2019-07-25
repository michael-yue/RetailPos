import request from '@/utils/request'

export function listAllProductType (shopid) {
  return request({
    url: '/eldlyrest/listAllProductType?t=' + Date.now(),
    method: 'get',
    params: {
      shopid
    }
  })
}
export function listAllAvaliableProductType (shopid) {
  return request({
    url: '/eldlyrest/listAllAvaliableProductType?t=' + Date.now(),
    method: 'get',
    params: {
      shopid
    }
  })
}
export function listAllProduct (shopid) {
  return request({
    url: '/eldlyrest/listAllProduct?t=' + Date.now(),
    method: 'get',
    params: {
      shopid
    }
  })
}
export function listAllAvaliableProduct (shopid, membertypeid, typeid) {
  return request({
    url: '/eldlyrest/listAllAvaliableProduct?t=' + Date.now(),
    method: 'get',
    params: {
      shopid,
      membertypeid,
      typeid
    }
  })
}

export function listAllAvaliableProductPrice (shopid, cusrtomertypeid) {
  return request({
    url: '/eldlyrest/listAllAvaliableProductPrice?t=' + Date.now(),
    method: 'get',
    params: {
      shopid,
      cusrtomertypeid
    }
  })
}

export function updateProductType (param) {
  return request({
    url: '/eldlyrest/updateProductType?t=' + Date.now(),
    method: 'post',
    data: {
      param
    }
  })
}

export function updateProduct (param) {
  return request({
    url: '/eldlyrest/updateProduct?t=' + Date.now(),
    method: 'post',
    data: {
      param
    }
  })
}

export function createProductType (param) {
  return request({
    url: '/eldlyrest/createProductType?t=' + Date.now(),
    method: 'post',
    data: {
      param
    }
  })
}

export function createProduct (param) {
  return request({
    url: '/eldlyrest/createProduct?t=' + Date.now(),
    method: 'post',
    data: {
      param
    }
  })
}

export function listAllMemberProduct (shopid, membertypeid) {
  return request({
    url: '/eldlyrest/listAllMemberProduct?t=' + Date.now(),
    method: 'post',
    params: {
      shopid,
      membertypeid
    }
  })
}

export function updateMemberPrice (param) {
  return request({
    url: '/eldlyrest/updateMemberPrice?t=' + Date.now(),
    method: 'post',
    data: {
      param
    }
  })
}

export function listAllMemberProductPrice (shopid) {
  return request({
    url: '/eldlyrest/listAllMemberProductPrice?t=' + Date.now(),
    method: 'get',
    params: {
      shopid
    }
  })
}

export function getMemberProductPrice (shopid, productId) {
  return request({
    url: '/eldlyrest/getMemberProductPrice?t=' + Date.now(),
    method: 'get',
    params: {
      shopid,
      productId
    }
  })
}