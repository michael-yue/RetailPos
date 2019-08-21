<template>
  <div class="orderlist">
    <div ref="critheader" style="padding:10px 20px">
      <el-menu ref="reportmenu" :default-active="activeIndex" class="el-menu" mode="horizontal" @select="handleSelect">
        <el-menu-item index="1">收入报表</el-menu-item>
        <el-menu-item index="2">产品销售报表</el-menu-item>
        <el-menu-item index="3">就餐人员统计</el-menu-item>
      </el-menu>
      <div style="margin:10px">
        <span style="font-size:14px">选择日期：</span>
        <el-date-picker
          v-model="dateRange"
          :default-time="['00:00:00', '23:59:59']"
          :picker-options="pickerOptions"
          type="daterange"
          format="yyyy 年 MM 月 dd 日"
          size="small"
          start-placeholder="开始日期"
          end-placeholder="结束日期" />
      </div>
    </div>
    <div :style="{height: myHeight}" style="padding:0 20px 10px 20px;">
      <el-table :data="orders" :header-cell-style="tableheader" size="small" height="100%" :key="tablekey">
        <el-table-column prop="productid" label="产品代码" align="left"/>
        <el-table-column prop="productname" label="名称" align="left" />
        <el-table-column prop="qty" label="数量" align="right"/>
        <el-table-column prop="amount" label="金额" align="right"/>
        <el-table-column prop="refundqty" label="退单数量" align="right"/>
        <el-table-column prop="refundamount" label="退单金额" align="right"/>
      </el-table>
    </div>
  </div>
</template>

<script>
import store from '@/store'
import { parseTime, getYesterday, getThisPeriodStart, getThisPeriodEnd,
  getLastPeriodStart, getLastPeriodEnd, getThisMonthStart, getThisMonthEnd,
  getLastMonthStart, getLastMonthEnd } from '@/utils'
import { getSalesGroupByDate } from '@/api/report'
export default {
  name: 'ScheduleReport',
  data () {
    return {
      activeIndex: '2',
      orders: [],
      tablekey: 1,
      myHeight: '',
      repdate: '',
      selectedDate: '',
      downloading: false,
      dateRange: [],
      pickerOptions: {
        shortcuts: [
          {
            text: '昨日',
            onClick (picker) {
              picker.$emit('pick', [getYesterday(), getYesterday()])
            }
          }, {
            text: '本期',
            onClick (picker) {
              picker.$emit('pick', [getThisPeriodStart(), getThisPeriodEnd()])
            }
          }, {
            text: '上期',
            onClick (picker) {
              picker.$emit('pick', [getLastPeriodStart(), getLastPeriodEnd()])
            }
          }, {
            text: '本月',
            onClick (picker) {
              picker.$emit('pick', [getThisMonthStart(), getThisMonthEnd()])
            }
          }, {
            text: '上月',
            onClick (picker) {
              picker.$emit('pick', [getLastMonthStart(), getLastMonthEnd()])
            }
          }
        ]
      }
    }
  },
  watch: {
    dateRange: function (val, oldval) {
      this.retrieveData()
    }
  },
  mounted () {
    const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight // 浏览器高度
    const critheaderheight = this.$refs.critheader.offsetHeight
    this.myHeight = (h - critheaderheight - 50) + 'px'
    var that = this
    window.onresize = function windowResize () {
      const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight // 浏览器高度
      that.myHeight = (h - critheaderheight - 50) + 'px'
    }
  },
  created: function () {
    //
  },
  methods: {
    retrieveData () {
      var repdatefrom = parseTime(new Date(this.dateRange[0]), '{y}-{m}-{d}')
      var repdateto = parseTime(new Date(this.dateRange[1]), '{y}-{m}-{d}')
      // this.repdate = parseTime(new Date(this.dateRange[0]), '{y}年{m}月{d}日') +
      // '到' + parseTime(new Date(this.dateRange[1]), '{y}年{m}月{d}日')
      getSalesGroupByDate(store.getters.branches, repdatefrom, repdateto).then(response => {
        console.log(response)
        this.orders = response.data
        this.tablekey ++
      }).catch(error => {
        console.log(error)
      })
    },
    /*
    * 以下设置class
    */
    tableheader ({ row, index }) {
      return 'background:#DCDFE6;'
    },
    handleSelect (key, keyPath) {
      if (key === '1') {
        this.$router.push('/report/reportIncome')
      } else if (key === '2') {
        this.$router.push('/report/reportSales')
      } else if (key === '3') {
        this.$router.push('/report/reportByMember')
      }
    }
  }
}
</script>

<style scoped>
.orderlist{display: flex; flex-direction: column;flex-flow: column;align-items: stretch;height:100%}
.el-menu--horizontal>.el-menu-item {height:40px; line-height: 40px}
.el-card >>> .el-card__body {height:100%}
.el-card{height:100%}
.ordercontents {display:flex; padding:5px; font-size:14px}
.billtype {flex:1 1 200px}
.amount{flex:1 1 200px; text-align: right}
</style>
