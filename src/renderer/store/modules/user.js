import { login, logout, getInfo } from '@/api/login'
import { setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    // token: getToken(),
    token: '',
    name: '',
    avatar: '',
    roles: [],
    branches: [],
    shopId: 0,
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_BRANCHES: (state, branches) => {
      state.branches = branches
    },
    SET_SHOPID: (state, shopId) => {
      state.shopId = shopId
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      const username = userInfo.username.trim()
      if (username !== '') {
        return new Promise((resolve, reject) => {
          login(username, userInfo.password).then(response => {
            const data = response.data
            setToken(data.token)
            const t = localStorage.getItem('Admin-Token')
            commit('SET_TOKEN', data.token)
            commit('SET_ROLES', [])
            resolve()
          }).catch(error => {
            reject(error)
          })
        })
      }
    },

    // 获取用户信息
    GetInfo ({ commit, state }) {
      if (state.token !== ''){
        return new Promise((resolve, reject) => {
          getInfo(state.token).then(response => {
            const data = response.data
            if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
              commit('SET_ROLES', data.roles)
            } else {
              reject(new Error('getInfo: roles must be a non-null array !'))
            }
            commit('SET_NAME', data.name)
            commit('SET_AVATAR', data.avatar)
            commit('SET_BRANCHES', data.branch)
            commit('SET_SHOPID', data.shopId)
            resolve(response)
          }).catch(error => {
            reject(error)
          })
        })
      }
    },

    // 登出
    LogOut ({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_BRANCHES', [])
          commit('SET_SHOPID', 0)
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut ({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
