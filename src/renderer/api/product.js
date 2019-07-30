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

export function updateProductType (id, typeid, typename, orderseq, status) {
  return request({
    url: '/eldlyrest/updateProductType?t=' + Date.now(),
    method: 'get',
    params: {
      id,
      typeid,
      typename,
      orderseq,
      status
    }
  })
}

export function updateProduct (id, shopid, productId, productName, orderSeq, price, productTypeId, status) {
  return request({
    url: '/eldlyrest/updateProduct?t=' + Date.now(),
    method: 'get',
    params: {
      id, shopid, productId, productName, orderSeq, price, productTypeId, status
    }
  })
}

export function createProductType (shopid, typeid, typename, orderseq, status) {
  return request({
    url: '/eldlyrest/createProductType?t=' + Date.now(),
    method: 'get',
    param: {
      shopid, typeid, typename, orderseq, status
    }
  })
}

export function createProduct (shopid, productId, productName, orderSeq, price, productTypeId, status) {
  return request({
    url: '/eldlyrest/createProduct?t=' + Date.now(),
    method: 'get',
    params: {
      shopid, productId, productName, orderSeq, price, productTypeId, status
    }
  })
}

export function listAllMemberProduct (shopid, membertypeid) {
  return request({
    url: '/eldlyrest/listAllMemberProduct?t=' + Date.now(),
    method: 'get',
    params: {
      shopid,
      membertypeid
    }
  })
}

export function updateMemberPrice (shopid, product, priceList) {
  return request({
    url: '/eldlyrest/updateMemberPrice?t=' + Date.now(),
    method: 'get',
    params: {
      shopid, product, priceList
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