<template>
  <div class="app-wrapper">
    <sidebar class="sidebar-container"/>
    <div class="main-container">
      <div v-if="!anonymous && !normal"><navbar/></div>
      <el-menu ref="adminmenu" :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item index="1">设置打印机</el-menu-item>
        <el-menu-item index="2">会员类型</el-menu-item>
        <el-menu-item index="3">产品设置</el-menu-item>
        <el-menu-item index="4">会员价格</el-menu-item>
      </el-menu>
      <app-main class="content"/>
    </div>
    
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  data() {
    return {
      activeIndex: '1'
    }
  },
  mixins: [ResizeMixin],
  computed: {
    anonymous () {
      return this.$store.getters.roles.includes('anonymous')
    },
    normal () {
      return this.$store.getters.roles.includes('normal')
    },
    sidebar () {
      return this.$store.state.app.sidebar
    },
    classObj () {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside () {
      this.$store.dispatch('CloseSideBar', { withoutAnimation: false })
    },
    handleSelect (key, keyPath) {
      if (key === '1') {
        this.$router.push('/system/setting')
      } else if (key === '2') {
        this.$router.push('/system/usertype')
      } else if (key === '3') {
        this.$router.push('/system/product')
      } else if (key === '4') {
        this.$router.push('/system/memberproductprice')
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "@/styles/mixin.scss";
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  // .drawer-bg {
  //   background: #000;
  //   opacity: 0.3;
  //   width: 100%;
  //   top: 0;
  //   height: 100%;
  //   position: absolute;
  //   z-index: 999;
  // }
</style>
<style scoped>
.content {
  min-height: calc(100vh - 101px);
}
.el-menu.el-menu--horizontal {padding: 0 10px}
.el-menu--horizontal>.el-menu-item {height:50px; line-height:50px}
</style>
