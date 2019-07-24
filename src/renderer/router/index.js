import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/views/login/index.vue'

Vue.use(Router)

export const constantRouterMap = [
  {
    path: '/login',
    component: Login,
    name: 'login',
    meta: { title: '登录', icon: 'example', roles: ['admin'] },
    hidden: true
  },
  {
    path: '/',
    component: require('@/views/layout/layout').default,
    meta: { title: '首页', icon: 'example', roles: ['admin'] },
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        component: require('@/views/dashboard/index').default,
        meta: { title: '首页', icon: 'table', roles: ['admin'] },
        breadcrumb: false
      }
    ]
  }
  // { path: '/updatepassword', component: () => import('@/views/login/updatepassword'), hidden: true },
  // { path: '/404', component: () => import('@/views/404'), hidden: true },
  // {
  //   path: '/',
  //   // component: Layout,
  //   redirect: '/dashboard',
  //   name: 'Dashboard',
  //   hidden: true,
  //   meta: { title: '首页', icon: 'example' },
  //   children: [{
  //     path: 'dashboard',
  //     component: () => import('@/views/dashboard/index'),
  //   }]
  // }
]
export const asyncRouterMap = [
  // 管理员
  {
    path: '/pos',
    component: require('@/views/layout/layout').default,
    meta: { title: '收银', icon: 'example', roles: ['admin'], breadcrumb: false },
    children: [
      {
        path: '/posindex',
        name: 'posindex',
        component: require('@/views/pos/pos').default,
        meta: { title: '收银', icon: 'table', roles: ['admin'] }
      }
    ]
  },
  {
    path: '/order',
    component: require('@/views/layout/layout').default,
    name: 'order',
    meta: { title: '订单', icon: 'example', roles: ['admin', 'pos'] },
    children: [
      {
        path: '/orderlist',
        name: 'orderlist',
        component: require('@/views/pos/orderlist').default,
        meta: { title: '订单', icon: 'table', roles: ['admin', 'pos'] }
      }
    ]
  },
  {
    path: '/report',
    component: require('@/views/layout/layout').default,
    meta: { title: '报表', icon: 'example', roles: ['admin', 'pos'] },
    breadcrumb: false,
    children: [
      {
        path: '/report/reportIncome',
        name: 'reportIncome',
        component: require('@/views/report/reportIncome').default,
        meta: { title: '报表', icon: 'table', roles: ['admin', 'pos'] }
      },
      {
        path: '/report/reportSales',
        name: 'reportSales',
        hidden: true,
        component: require('@/views/report/reportSales').default,
        meta: { title: '报表', icon: 'table', roles: ['admin', 'pos'] }
      }
    ]
  },
  {
    path: '/member',
    component: require('@/views/layout/layout').default,
    meta: { title: '会员', icon: 'example', roles: ['admin', 'pos'] },
    children: [
      {
        path: '/member/memberList',
        name: 'memberList',
        component: require('@/views/member/memberList').default,
        meta: { title: '会员', icon: 'table', roles: ['admin', 'pos'] }
      },
      {
        path: '/member/memberQuery',
        name: 'memberQuery',
        component: require('@/views/member/memberQuery').default,
        hidden: true,
        meta: { title: '会员查询', icon: 'table', roles: ['admin', 'pos'] }
      }
    ]
  },
  {
    path: '/system',
    component: require('@/views/layout/layout').default,
    meta: { title: '设置', icon: 'example', roles: ['admin', 'pos'] },
    children: [
      {
        path: '/system/setting',
        name: 'setting',
        component: require('@/views/admin/setting').default,
        meta: { title: '设置', icon: 'table', roles: ['admin', 'pos'] }
      },
      {
        path: '/system/usertype',
        name: 'usertype',
        component: require('@/views/admin/usertypeList').default,
        hidden: true,
        meta: { title: '会员卡类型设置', icon: 'table', roles: ['admin', 'pos'] }
      },
      {
        path: '/system/product',
        name: 'product',
        component: require('@/views/admin/product').default,
        hidden: true,
        meta: { title: '产品设置', icon: 'table', roles: ['admin', 'pos'] }
      },
      {
        path: '/system/memberproductprice',
        name: 'memberproductprice',
        component: require('@/views/admin/memberproductprice').default,
        hidden: true,
        meta: { title: '会员价格设置', icon: 'table', roles: ['admin', 'pos'] }
      }
    ]
  }
]
// const routes = [
//   {
//     path: '/',
//     name: 'landing-page',
//     component: LandingPage,
//     meta: {
//       requiresAuth: true // 表示进入这个路由需要认证
//     }
//   },
//   {
//     path: '*',
//     redirect: '/'
//   },
//   { path: '/login', component: Login, hidden: true }
//   // { path: '/404', component: () => import('@/views/404'), hidden: true }
// ]

export default new Router({
  // mode: 'history', // 后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
