<template>
  <div class="reportIncome">
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
        <!-- <el-button :loading="downloading" type="primary" plain size="small" icon="document" @click="handleDownload">导出excel</el-button> -->
      </div>
    </div>
    <div :style="{height: myHeight}" style="padding:0 20px 10px 20px;">
      <el-table v-loading="loading" :data="tableData" :header-cell-style="tableheader" size="small" height="100%">
        <el-table-column prop="transDate" label="时间" />
        <el-table-column
          v-for="item in tableConfig"
          :label="item.label"
          :prop="item.prop"
          :key="item.id"
          header-align="center"
          align="right" >
          <el-table-column
            v-for="item1 in item.children"
            :label="item1.label"
            :prop="item1.prop"
            :key="item1.id"
            header-align="center"
            align="right" />
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import store from '@/store'
import { getMemberIncomeByDate } from '@/api/report'
import { parseTime, getYesterday, getThisPeriodStart, getThisPeriodEnd,
  getLastPeriodStart, getLastPeriodEnd, getThisMonthStart, getThisMonthEnd,
  getLastMonthStart, getLastMonthEnd } from '@/utils'
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
      activeIndex: '3',
      selectedUserType: '',
      tableConfig: [],
      tableData: [],
      myHeight: '',
      total: 0,
      limit: 10,
      currentPage: 1,
      repdate: '',
      dateRange: '',
      loading: false,
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
    branchChangedEvent (event) {
      this.selectedBranch = event.branchId
      this.retrieveData()
    },
    retrieveData () {
      this.tableData = []
      this.loading = true
      var repdatefrom = parseTime(new Date(this.dateRange[0]), '{y}-{m}-{d}')
      var repdateto = parseTime(new Date(this.dateRange[1]), '{y}-{m}-{d}')
      getMemberIncomeByDate(store.getters.branches, repdatefrom, repdateto).then(response => {
        console.log(response)
        this.tableConfig = response.data.tableHeader
        this.tableData = response.data.tableData
        this.loading = false
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
.critheader { padding:10px 20px; display:flex; justify-content: flex-end}
.el-menu--horizontal>.el-menu-item {height:40px; line-height: 40px}
.orderlist{display: flex; flex-direction: column;flex-flow: column;align-items: stretch;height:100%}
.el-card >>> .el-card__body {height:100%}
.el-card{height:100%}
.ordercontents {display:flex; padding:5px; font-size:14px}
.billtype {flex:1 1 200px}
.amount{flex:1 1 200px; text-align: right}
</style>
