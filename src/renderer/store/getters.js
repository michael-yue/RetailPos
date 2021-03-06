const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  shopId: state => state.user.shopId,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  branches: state => state.user.branches,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters
}
export default getters
