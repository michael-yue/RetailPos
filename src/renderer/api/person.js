import request from '@/utils/request'

export function listAllUser (membertypeid, cardnumber, name, mobile, pagenum, pagesize) {
  return request({
    url: '/eldlyrest/listAllUser?t=' + Date.now(),
    method: 'get',
    params: {
      membertypeid,
      cardnumber,
      name,
      mobile,
      pagenum,
      pagesize
    }
  })
}
export function queryUsers (usertype, currentPage, limit) {
  return request({
    url: '/eldlyrest/queryUsers?t=' + Date.now(),
    method: 'get',
    params: {
      usertype,
      currentPage,
      limit
    }
  })
}

export function createCard (shopid, cardNumber, realName, authcode, gender, mobile, idcardno, membertypeId) {
  return request({
    url: '/eldlyrest/createCard?t=' + Date.now(),
    method: 'get',
    params: {
      shopid,
      cardNumber,
      realName,
      authcode,
      gender,
      mobile,
      idcardno,
      membertypeId
    }
  })
}

export function updateCard (id, shopid, cardNumber, realName, authcode, gender, mobile, idcardno, membertypeId) {
  return request({
    url: '/eldlyrest/updateCard?t=' + Date.now(),
    method: 'get',
    params: {
      id,
      shopid,
      cardNumber,
      realName,
      authcode,
      gender,
      mobile,
      idcardno,
      membertypeId
    }
  })
}

// export function deleteUser (param) {
//   return request({
//     url: '/eldlyrest/deleteUser?t=' + Date.now(),
//     method: 'post',
//     data: {
//       param
//     }
//   })
// }

export function queryPerson (cardnumber) {
  return request({
    url: '/eldlyrest/queryPersonByCardnumber?t=' + Date.now(),
    method: 'get',
    params: {
      cardnumber
    }
  })
}
// UserType
export function addUserType (param) {
  return request({
    url: '/eldlyrest/addUserLevel?t=' + Date.now(),
    method: 'get',
    params: {
      param
    }
  })
}
export function updateUserType (param) {
  return request({
    url: '/eldlyrest/updateUserLevel?t=' + Date.now(),
    method: 'post',
    data: {
      param
    }
  })
}
export function deleteUserType (param) {
  return request({
    url: '/eldlyrest/deleteUserLevel?t=' + Date.now(),
    method: 'post',
    data: {
      param
    }
  })
}

export function listAllMemberType () {
  return request({
    url: '/eldlyrest/listAllMemberType?t=' + Date.now(),
    method: 'get'
  })
}

export function queryMemberInfoByCardnumber (memberNumber) {
  return request({
    url: '/eldlyrest/queryMemberInfoByCardnumber?t=' + Date.now(),
    method: 'get',
    params: {
      memberNumber
    }
  })
}

export function queryMemberByCardnumber (memberNumber) {
  return request({
    url: '/eldlyrest/queryMemberByCardnumber?t=' + Date.now(),
    method: 'get',
    params: {
      memberNumber
    }
  })
}

export function queryMemberInfoByAuthcode (shopid, authcode) {
  return request({
    url: '/eldlyrest/queryMemberInfoByAuthcode?t=' + Date.now(),
    method: 'get',
    params: {
      shopid,
      authcode
    }
  })
}

export function recharge (shopid, cardnumber, payway, amount, authcode) {
  return request({
    url: '/eldlyrest/recharge?t=' + Date.now(),
    method: 'get',
    params: {
      shopid,
      cardnumber,
      payway,
      amount,
      authcode
    }
  })
}
