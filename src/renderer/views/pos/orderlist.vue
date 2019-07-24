<template>
  <div class="orderlist">
    <div ref="critheader" style="padding:10px 20px">
      <el-card>
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
      </el-card>
    </div>
    <div :style="{height: myHeight}" style="padding:0 20px 10px 20px;">
      <el-table :data="orders" height="100%">
        <el-table-column prop="transDate" label="日期" align="right" :class-name="h">
          <template slot-scope="props">
            <div>{{ props.row.transDate.time | formatDate }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="seq" label="序号" align="center" />
        <el-table-column prop="lines" label="产品" align="left" :class-name="w100">
          <template slot-scope="scope">
            <div v-for="line in scope.row.lines" :key="line.prodid">
              {{line.prodname}} x {{line.qty}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="payWay" label="支付方式" align="right" :class-name="h">
          <template slot-scope="scope">
            <div v-if="scope.row.payWay === '2'">微信支付</div>
            <div v-else-if="scope.row.payWay == '1'">现金支付</div>
            <div v-else-if="scope.row.payWay == '3'">会员卡支付</div>
          </template>
        </el-table-column>
        <el-table-column prop="shouldPayAmount" label="应付金额" align="right" />
        <el-table-column prop="shouldPayAmount" label="实付金额" align="right" />
        <el-table-column prop="cardId" label="卡号" align="right" />
      </el-table>
    </div>
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
import store from '@/store'
import { listOrders } from '@/api/order'
import { parseTime, getYesterday, getThisPeriodStart, getThisPeriodEnd,
  getLastPeriodStart, getLastPeriodEnd, getThisMonthStart, getThisMonthEnd,
  getLastMonthStart, getLastMonthEnd } from '@/utils'
export default {
  name: 'OrderList',
  data () {
    return {
      orders: [],
      dateRange: [],
      myHeight: 0,
      currentPage: 1,
      limit: 10,
      total: 0,
      payway: 0,
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
      },
      h: 'h',
      w100: 'w100'
    }
  },
  filters: {
    formatDate (time) {
      const date = new Date(time)
      return parseTime(date, '{y}-{m}-{d} {h}:{i}:{s}')
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
    this.myHeight = (h - critheaderheight - 100) + 'px'
    var that = this
    window.onresize = function windowResize () {
      const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight // 浏览器高度
      that.myHeight = (h - critheaderheight - 100) + 'px'
    }
  },
  methods: {
    retrieveData () {
      var that = this
      this.orders = []
      this.loading = true
      var repdatefrom = parseTime(new Date(this.dateRange[0]), '{y}-{m}-{d}')
      var repdateto = parseTime(new Date(this.dateRange[1]), '{y}-{m}-{d}')
      listOrders(store.getters.branches, repdatefrom, repdateto, this.payway, this.currentPage, this.limit).then(response => {
        console.log(response)
        that.total = response.total
        that.orders = response.data
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
.h { width: 20%}
.w100 { width: 100%}
.el-table >>> td{vertical-align:text-top}
</style>
