<template>
  <div class="orderlist" :style="{height: myHeight}" style="padding:0 20px 10px 20px;">
    <el-table :data="orders" :header-cell-style="tableheader" border size="small" height="100%">
      <el-table-column prop="usertype" label="类型" />
      <el-table-column prop="transdate" label="时间" />
      <el-table-column prop="count" label="人数" align="right"/>
      <el-table-column prop="amount" label="金额" align="right"/>
    </el-table>
    <div style="margin-top:10px; text-align: right">
      <el-pagination
        :current-page="currentPage"
        :page-size="limit"
        :total="total"
        layout="total, sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="pagechange" />
    </div>
  </div>
</template>

<script>
// import store from '@/store'
import { getSalesByUserType } from '@/api/report'
import { parseTime } from '@/utils'
export default {
  name: 'CashReport',
  filters: {
    formatDate (time) {
      const date = new Date(time)
      return parseTime(date, '{h}:{i}:{s}')
    }
  },
  data () {
    return {
      selectedUserType: '',
      orders: [],
      myHeight: '',
      total: 0,
      limit: 10,
      currentPage: 1,
      repdate: '',
      dateRange: ''
    }
  },
  watch: {
    dateRange: function (val, oldval) {
      console.log(val)
      this.retrieveData()
    }
  },
  mounted () {
    const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight // 浏览器高度
    const critheaderheight = this.$refs.critheader.offsetHeight
    this.myHeight = (h - critheaderheight - 100) + 'px'
    var that = this
    window.onresize = function windowResize () {
      const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight // 浏览器高度
      that.myHeight = (h - critheaderheight - 100) + 'px'
    }
  },
  created: function () {
    //
  },
  methods: {
    branchChangedEvent (event) {
      this.selectedBranch = event.branchId
      this.retrieveData()
    },
    retrieveData () {
      this.orders = []
      this.loading = true
      var repdatefrom = parseTime(new Date(this.dateRange[0]), '{y}-{m}-{d}')
      var repdateto = parseTime(new Date(this.dateRange[1]), '{y}-{m}-{d}')
      // this.repdate = parseTime(new Date(this.dateRange[0]), '{y}年{m}月{d}日') +
      // '到' + parseTime(new Date(this.dateRange[1]), '{y}年{m}月{d}日')
      getSalesByUserType('001', repdatefrom, repdateto).then(response => {
        console.log(response)
        this.orders = response.data
      }).catch(error => {
        console.log(error)
      })
    },
    // 分页处理
    pagechange: function (currentPage) {
      console.log('pagechange')
      this.currentPage = currentPage
      this.retrieveData()
    },
    handleSizeChange: function (currentSize) {
      this.limit = currentSize
      this.retrieveData()
    },
    /*
    * 以下设置class
    */
    tableheader ({ row, index }) {
      return 'background:#DCDFE6;'
    }
  }
}
</script>

<style scoped>
.critheader { padding:10px 20px; display:flex; justify-content: flex-end}
.orderlist{display: flex; flex-direction: column;flex-flow: column;align-items: stretch;height:100%}
.el-card >>> .el-card__body {height:100%}
.el-card{height:100%}
.ordercontents {display:flex; padding:5px; font-size:14px}
.billtype {flex:1 1 200px}
.amount{flex:1 1 200px; text-align: right}
</style>
