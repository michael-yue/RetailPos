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
      <el-table v-loading="loading" :data="orders" height="100%">
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
    <el-dialog
      :visible.sync="dialogDetail"
      :fullscreen="false"
      :modal="true"
      :show-close="false"
      :loading="refundloading"
      title="订单详细信息"
      width="80%"
      top="5vh">
      <div v-modal="order">
        <el-main>
          <div class="lineinfo">
            <div class="label">订单编号：</div>
            <div class="value">{{ order.billid }}</div>
          </div>
          <div class="lineinfo">
            <div class="label">点餐时间：</div>
            <div class="value">{{ order.orderdatetime.time | formatDate }}</div>
          </div>
          <div class="lineinfo">
            <div class="label">桌台：</div>
            <div class="value">第{{ order.tableid }}台</div>
          </div>
          <div class="lineinfo">
            <div class="label">总金额：</div>
            <div class="value">{{ order.totalamount }}</div>
          </div>
          <div class="lineinfo">
            <div class="label">收款金额：</div>
            <div class="value">{{ order.payedamount }}</div>
          </div>
          <div class="lineinfo">
            <div class="label">微信支付号：</div>
            <div class="value">{{ order.wxTransactionId }}</div>
          </div>
        </el-main>
        <el-table
          v-loading="loading"
          ref="refTable"
          :data="order.lines"
          :class="{'tablestyle': true}"
          size="small"
          height="100%">
          <el-table-column prop="prodid" label="代码" width="80" header-align="left" align="left" />
          <el-table-column prop="prodname" label="产品" width="" header-align="left" align="left" />
          <el-table-column prop="zf" label="做法要求" width="" header-align="left" label-class-name	="header" align="left" />
          <el-table-column prop="qty" label="数量" width="80" header-align="right" align="right" />
          <el-table-column prop="refundQty" label="已退数量" width="100" header-align="right" align="right" />
          <el-table-column prop="refundqty" label="退单数量" width="" header-align="right" align="right">
            <template slot-scope="props">
              <div style="display:flex;justify-content:flex-end">
                <el-input-number v-model="props.row.refundnum" :min="0" :max="props.row.qty - props.row.refundQty" size="small" label="退单数量" @change="handleRefundQtyChange" />
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="prodid" label="操作" width="" header-align="right" align="right" >
            <template slot-scope="props">
              <div style="display:flex;justify-content:flex-end">
                <el-button type="danger" size="small" @click="refund(order.id, props.row)">退单</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="dialogDetail = false">关  闭</el-button>
      </span>
    </el-dialog>
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
      order: {
        billid: '',
        orderdatetime: {
          time: ''
        },
        tableid: '',
        totalamount: 0
      },
      dateRange: [],
      myHeight: 0,
      loading: false,
      currentPage: 1,
      limit: 10,
      total: 0,
      payway: 0,
      dialogDetail: false,
      refundloading: false,
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
        that.total = response.total
        that.orders = response.data
        console.log(response)
        this.loading = false
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
