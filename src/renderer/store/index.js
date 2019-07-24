import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import permission from './modules/permission'
import getters from './getters'

// import { createPersistedState, createSharedMutations } from 'vuex-electron'

// import modules from './modules'

Vue.use(Vuex)

// export default new Vuex.Store({
//   // modules: {
//   //   app,
//   //   user,
//   //   permission
//   // },
//   // modules,
//   getters,
//   plugins: [
//     createPersistedState(),
//     createSharedMutations()
//   ],
//   strict: process.env.NODE_ENV !== 'production',
//   // actions: {
//   //   updateUserInfo (context) {
//   //     console.log('sdsds')
//   //     context.commit('updateUserInfo')
//   //   }
//   // }
// })

const store = new Vuex.Store({
  modules: {
    app,
    user,
    permission
  },
  getters
})

export default store
