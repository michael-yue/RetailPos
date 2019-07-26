import request from '@/utils/request'

export function login (username, password) {
  return request({
    url: '/eldlyrest/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}
export function getInfo (token) {
  return request({
    url: '/eldlyrest/userinfo',
    method: 'get',
    params: { token }
  })
}

export function logout () {
  return request({
    url: '/api/logout',
    method: 'post',
    data: { }
  })
}

export function updateNormalPassword (userid, password, newpassword) {
  return request({
    url: '/eldlyrest/updateNormalPassword',
    method: 'post',
    data: { 
      userid,
      password,
      newpassword      
    }
  })
}
