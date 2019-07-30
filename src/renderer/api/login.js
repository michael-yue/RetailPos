import request from '@/utils/request'
import qs from 'qs'

export function login (username, password) {
  return request({
    url: '/eldlyrest/login',
    method: 'get',
    params: {
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
    method: 'get',
    data: { 
      userid,
      password,
      newpassword      
    }
  })
}
