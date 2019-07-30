<template>
  <div class="setting">
    <div ref="critheader" style="padding:10px 20px">
      <el-menu ref="adminmenu" :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item index="1">设置打印机</el-menu-item>
        <el-menu-item index="2">会员类型</el-menu-item>
        <el-menu-item index="3">产品设置</el-menu-item>
        <el-menu-item index="4">会员价格</el-menu-item>
      </el-menu>
    </div>
    <el-card>
      <span class="subtitle">打印相关</span>
      <div style="display:flex; padding: 20px; flex-direction: column">
        <div style="margin: 10px 0"><el-checkbox v-model="systemParam.printBack">打印后厨单据</el-checkbox></div>
        <div style="margin: 10px 0"><el-checkbox v-model="systemParam.printFront">打印前台单据</el-checkbox></div>
        <!-- <div style="display:flex; flex-direction:row; margin: 10px 0; font-size:14px">
          <span style="flex: 0 0 auto; margin: auto 10px; max-width:120px; min-width:80px">打印份数: </span>
          <el-input size="small" v-model="systemParam.frontPrintCount"/>
        </div> -->
        <div style="display: flex; margin-bottom:10px; align-items:center; font-size:14px">
          <span style="max-width:120px; min-width:80px; margin: 0 10px">前台打印机:</span>
          <el-select v-model="systemParam.frontPrinter" size="small" placeholder="请选择">
            <el-option
              v-for="item in printList"
              :key="item.name"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
        </div>
        <div style="display: flex; align-items:center; font-size:14px">
          <span style="min-width:80px; margin: 0 10px">后厨打印机:</span>
          <el-select v-model="systemParam.backPrinter" size="small" placeholder="请选择">
            <el-option
              v-for="item in printList"
              :key="item.name"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
        </div>
        <div style="text-align:right">
          <el-button size="small" type="primary" @click="saveParam">保存</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>


<script>
  import store from '@/store'
  import { getSystemParam, saveSystemParam } from '@/api/system'
  const ipcRenderer = require('electron').ipcRenderer
  export default {
    name: 'setting',
    data () {
      return {
        printList: [],
        systemParam: {
          // printBack: false,
          // printFront: true,
          // frontPrinter: '',
          // backPrinter: '',
          // frontPrintCount: 2
        },
        activeIndex: '1'
      }
    },
    created () {
      this.getPrinters()
      this.getSystemParam()
    },
    methods: {
      getPrinters: function () {
        // 渲染线程主动发送getPrinterList事件到主线程请求打印机列表
        ipcRenderer.send('getPrinterList')
        // 监听主线程获取到打印机列表后的回调
        ipcRenderer.on('getPrinterList', (event, data) => {
          // data就是打印机列表
          this.printList = data
          // console.log(this.printList)
        })
      },
      getSystemParam: function () {
        getSystemParam(store.getters.branches).then(res => {
          // console.log(res.data)
          this.systemParam = res.data
        })
      },
      saveParam: function () {
        saveSystemParam(this.systemParam.shopId, this.systemParam.backPrinter, this.systemParam.frontPrinter, 
          this.systemParam.frontPrintCount, this.systemParam.printBack, this.systemParam.printFront).then(res => {
          // console.log(res.data)
        })
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
    },
    mounted () {
      // this.getPrinters()
    }
  }
</script>

<style scoped>
.el-menu--horizontal>.el-menu-item {height:40px; line-height: 40px}
.subtitle { padding: 10px; border-bottom: 1px solid #e0e0e0}
.el-card { margin: 10px}
.el-card >>> .el-card__body {display: flex; flex-direction: column}
.el-input {width: auto}
</style>
