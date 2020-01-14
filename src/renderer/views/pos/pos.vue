<template>
  <div class="Pos">
    <div class="leftarea">
      <div style="display:flex; justify-content:space-between">
        <el-radio-group v-model="selectedMemberType" @change="memberTypeChanged" style="display:flex">
          <el-radio-button label="0">非会员</el-radio-button>
          <div v-for="item in membertypes" :key="item.id">
            <el-radio-button :label="item.id">{{item.name}}</el-radio-button>
          </div>
        </el-radio-group>
      </div>
      <el-card class="orderedlist">
        <ul>
          <li v-for="item in orderedlist" :key="item.id" :class="{active: activeOrderline == item}" @click="orderlineSelected(item)">
            <span>{{item.name}} x{{item.qty}}</span>
            <span>￥{{item.amount}}</span>
          </li>
        </ul>
      </el-card>
      <div style="flex: 0 0 auto; display:flex; flex-direction:column">
        <div style="text-align:right; padding:5px">
          合计金额：<span style="font-size:10px;">￥</span>{{totalamount}}
        </div>
        <div style="text-align:right; padding:5px">
          优惠金额：<span style="font-size:10px;">￥</span>{{discountamount}}
        </div>
        <div style="text-align:right; padding:5px">
          应付金额：<span style="font-size:10px;">￥</span>{{shouldpayamount}}
        </div>
      </div>
      <div class="functions" style="flex: 0 0 auto">
        <ul style="display:flex; justify-content:space-around; margin: 0px">
          <li @click="clearOrdered"><span><i class="el-icon-delete" style="padding: 2px"></i>清空</span></li>
          <li @click="addQty"><span><i class="el-icon-plus" style="padding: 2px"></i>增加</span></li>
          <li @click="minusQty"><span><i class="el-icon-minus" style="padding: 2px"></i>减少</span></li>
          <li @click="removeLine"><span><i class="el-icon-close" style="padding: 2px"></i>删除</span></li>
        </ul>
      </div>
    </div>
    <div :style="{height: myHeight}" class="rightarea">
      <el-card class="producttype">
        <ul>
          <li v-for="item in prodtypes" :key="item.id" :class="{active: activeProductType == item}" @click="productTypeselected(item)">{{ item.typeName }}</li>
        </ul>
      </el-card>
      <el-card class="products">
        <ul>
          <li v-for="item in products" :key="item.id">
            <div @click="productSelected(item)">
              <div class="prodid">{{ item.productId }}</div>
              <div style="padding:10px; font-size:13px; font-weight:600; cursor:-webkit-grab"> {{ item.productName }}</div>
              <div style="width:100%;padding-right:10px;text-align:right; cursor:-webkit-grab"> ￥{{ item.memberprice }}</div>
            </div>
          </li>
        </ul>
      </el-card>
      <el-card class="payfunctions">
        <ul>
          <li @click="showCash">现金收款</li>
          <li @click="showWx">微信收款</li>
          <li class="disable">支付宝</li>
          <li @click="showCardDialog">会员卡</li>
          <!-- <li @>混合支付</li> -->
        </ul>
      </el-card>
    </div>
    <el-dialog
      :visible.sync="dialogCardInputVisible"
      :fullscreen="false"
      :modal="true"
      :show-close="false"
      title="会员卡"
      top="5vh">
      <div>
        <div style="display:flex">
          <div style="flex: 0 0 30%; margin:auto">
            会员卡号
          </div>
          <div style="flex: 1; display:flex;">
            <el-input v-model="inputCardnumber" :focus="true" autofocus @keyup.enter.native="getCardInfo"/>
            <el-button icon="el-icon-search" size="small" @click="searchMember">查找</el-button>
          </div>
        </div>
        <div style="display:flex;margin:10px 0">
          <div style="flex: 0 0 30%; margin:auto">
            会员名称:
          </div>
          <div style="flex: 1">
            <span>{{inputCustomerName}}</span>
          </div>
        </div>
        <div style="color:red">
          {{ carderror}}
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="cancelCardNumber">取 消</el-button>
        <el-button type="primary" @click="confirmCardNumber">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogCashVisible"
      :fullscreen="false"
      :modal="true"
      :show-close = "false"
      :close-on-click-modal	= "false"
      title="现金"
      top="5vh">
      <div style="font-size:18px">
        <div style="display: flex;">
          <div style="flex: 0 0 30%; margin:auto; text-align:right">应付金额: </div>
          <span style="flex: 0 0 70%; padding: 10px">{{shouldpayamount}}</span>
        </div>
        <div style="display: flex; margin: 10px 0">
          <div style="flex: 0 0 30%; margin:auto; text-align:right ">付款金额: </div>
          <el-input v-model = "payedamount" :focus="true" autofocus @keyup.enter.native="recieveCash" style="flex: 0 0 70%; padding:10px; font-size: 18px"/>
        </div>
        <div style="display: flex">
          <div style="flex: 0 0 30%; margin:auto; text-align:right">找零: </div>
          <div style="flex: 0 0 70%; padding: 10px">{{changeamount}}</div>
        </div>
        <div style="color:red">
          {{ casherror}}
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="dialogCashVisible = false">取 消</el-button>
        <el-button type="primary" @click="recieveCash">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogWxVisible"
      :fullscreen="false"
      :modal="true"
      :show-close="false"
      :close-on-click-modal	= "false"
      title="微信支付"
      top="5vh">
      <div style="font-size:18px">
        <div style="display: flex">
          <div style="margin: auto; min-width: 60px">扫码: </div>
          <el-input v-model = "qrcode" :focus="true" autofocus @keyup.enter.native="recieveWx"/>
        </div>
        <div style="color:red; padding-top:20px">
          {{ wxerror}}
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="closeWxDialog">取 消</el-button>
        <el-button v-loading="loadingWxPay" type="primary" @click="recieveWx">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogCardVisible"
      :fullscreen="false"
      :modal="true"
      :show-close="false"
      :close-on-click-modal	= "false"
      title="会员卡支付"
      top="5vh">
      <div style="font-size:18px">
        <div style="display: flex; flex-direction:column">
          <div style="display: flex">
            <div style="margin: auto; min-width: 60px; flex: 50%; padding:3px">会员卡号: </div>
            <div style="margin: auto; min-width: 60px; flex: 50%; padding:3px">{{this.member.cardnumber}}</div>
          </div>
          <div style="display: flex">
            <div style="margin: auto; min-width: 60px; flex: 50%; padding:3px">会员名称: </div>
            <div style="margin: auto; min-width: 60px; flex: 50%; padding:3px">{{this.member.realname}}</div>
          </div>
          <div style="display: flex">
            <div style="margin: auto; min-width: 60px; flex: 50%; padding:3px">卡余额: </div>
            <div style="margin: auto; min-width: 60px; flex: 50%; padding:3px">{{this.member.balance}}</div>
          </div>
          <div style="display: flex">
            <div style="margin: auto; min-width: 60px; flex: 50%; padding:3px">本次支付: </div>
            <div style="margin: auto; min-width: 60px; flex: 50%; padding:3px">{{this.shouldpayamount}}</div>
          </div>
          <div style="display: flex">
            <div style="margin: auto; min-width: 60px; flex: auto; padding:3px">余额: </div>
            <div style="margin: auto; min-width: 60px; flex: auto; padding:3px">{{this.member.balance - this.shouldpayamount}}</div>
          </div>
        </div>
        <div style="color:red">
          {{ cardpayerror }}
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="dialogCardVisible = false">取 消</el-button>
        <el-button type="primary" @click="recieveCard">确定支付</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogMemberSearchVisible"
      :fullscreen="false"
      :modal="true"
      :show-close="false"
      :close-on-click-modal	= "false"
      title="查询会员卡"
      top="5vh">
      <div style="font-size:18px">
        <div style="display: flex; flex-direction:column;">
          <div style="display:flex; align-items: center;margin:10px 10px; font-size:14px">
            <span style="flex:0 0 auto; margin-right:5px;">会员卡号</span>
            <el-input v-model="searchForm.cardnumber" label="会员卡号" size="small" />
            <span style="flex:0 0 auto;margin: 0px 5px; font-size:14px">电话</span>
            <el-input v-model="searchForm.mobile" label="电话" size="small" />
            <span style="flex:0 0 auto;margin: 0px 5px; font-size:14px">姓名</span>
            <el-input v-model="searchForm.name" label="姓名" size="small" />
            <div style="padding-left:5px; display: inherit">
              <el-button plain size="small" type="primary" @click="queryMembers">查询</el-button>
            </div>
          </div>
          <el-table
            v-loading="loadingMemberList"
            ref="refTable"
            :data="memberlist"
            @current-change="handleMemberListCurrentChange"
            highlight-current-row
            border
            size="small"
            height="300px">
            <el-table-column v-model="cardnumber" prop="cardnumber" label="卡号" width="150px" header-align="center" align="left" />
            <el-table-column prop="realname" label="姓名" width="100px" header-align="center" align="left" />
            <el-table-column prop="gender" label="性别" width="80px" header-align="center" align="left">
              <template slot-scope="props">
                <div v-if="props.row.gender === '1'">男</div>
                <div v-else>女</div>
              </template>
            </el-table-column>
            <el-table-column prop="mobile" label="电话" width="" header-align="center" align="left" />
            <el-table-column prop="memberType.name" label="类型" width="100px" header-align="center" align="left" />
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
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="dialogMemberSearchVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmMemberSelect">确定选择</el-button>
      </span>
    </el-dialog>
    <div style="z-index: -1000; position:absolute; top: 9000px">
      <webview ref="frontView" src="../../../static/printFront.html" nodeintegration></webview>
      <webview ref="backView" src="../../../static/print.html" nodeintegration></webview>
      <webview ref="memberPayView" src="../../../static/printCustomerPay.html" nodeintegration></webview>
    </div>
  </div>
</template>

<script>
import store from '@/store'
import { listAllAvaliableProductType, listAllAvaliableProduct } from '@/api/product.js'
import { saveOrder } from '@/api/order.js'
import { listAllUser, queryPerson, listAllMemberType } from '@/api/person.js'
import { getSystemParam } from '@/api/system.js'
import { parseTime } from '@/utils'
import { ipcRenderer } from 'electron'
import { Message } from 'element-ui'
export default {
  name: 'Pos',
  data () {
    return {
      myHeight: 0,
      sysParam: {},
      prodtypes: [], // 产品类型列表
      products: [], // 产品列表，根据类型变化
      orderedlist: [], // 已点订单产品列表
      activeProductType: {}, // 当前产品类型
      activeOrderline: {},
      // 订单
      totalamount: 0, // 总金额
      discountamount: 0,
      shouldpayamount: 0,
      payedamount: '',
      changeamount: 0,
      qrcode: '',
      // 会员部分
      membertypes: {},
      selectedMemberType: 0,
      member: {},
      cardnumber: '', // 会员卡号
      customerName: '',
      // customerTypeId: 0,
      inputCardnumber: '',
      inputCustomerName: '',
      carderror: '',
      // 对话框
      dialogCardInputVisible: false, // card dialog visible
      dialogCashVisible: false,
      dialogWxVisible: false,
      dialogAliVisible: false,
      dialogCardVisible: false,
      dialogMemberSearchVisible: false,
      casherror: '',
      wxerror: '',
      cardpayerror: '',
      searchForm: {
        cardnumber: '',
        mobile: ''
      },
      loadingWxPay: false,
      memberlist: [],
      currentPage: 1,
      limit: 10,
      total: 0,
      currentMemberListRow: null,
      loadingMemberList: false,
    }
  },
  watch: {
    activeProductType (oldvar, newvar) {
      this.listAllAvaliableProduct()
    },
    payedamount (newvar, oldvar) {
      var t = newvar - this.shouldpayamount
      if (t > 0) {
        this.changeamount = t
      }
    },
    selectedMemberType (newvar, oldvar) {
      this.listAllAvaliableProduct()
      // this.recalcuateOrder()
    }
  },
  mounted () {
    const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight // 浏览器高度
    const critheaderheight = 0 // this.$refs.critheader.offsetHeight
    this.myHeight = (h - critheaderheight - 50) + 'px'
    var that = this
    window.onresize = function windowResize () {
      const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight // 浏览器高度
      that.myHeight = (h - critheaderheight - 50) + 'px'
    }
    this.getSystemParam()
  },
  created () {
    this.getMemberTypes()
    this.listAllAvaliableProductType()
  },
  methods: {
    getSystemParam: function () {
      getSystemParam(store.getters.branches).then(res => {
        this.sysParam = res.data
        if (this.sysParam.printFront) {
          this.setPrinter(this.$refs.frontView, this.sysParam.frontPrinter, 2)
        }
        if (this.sysParam.printBack) {
          this.setPrinter(this.$refs.backView, this.sysParam.backPrinter, 1)
        }
        this.setPrinter(this.$refs.memberPayView, this.sysParam.frontPrinter, 1)
      })
    },
    getMemberTypes: function () {
      listAllMemberType().then(res => {
        if (res.code === 20000) {
          this.membertypes = res.data
        }
      })
    },
    listAllAvaliableProductType: function () {
      listAllAvaliableProductType(store.getters.branches).then(res => {
        this.prodtypes = res.data
        if (res.data.length > 0) {
          this.activeProductType = res.data[0]
        }
      })
    },
    listAllAvaliableProduct: function () {
      listAllAvaliableProduct(store.getters.branches, this.selectedMemberType, this.activeProductType.id).then(res => {
        this.products = res.data
        this.recalcuateOrder()
      })
    },
    queryMembers: function() {
      this.memberlist = []
      this.loadingMemberList = true
      listAllUser(this.selectMemberType, this.searchForm.cardnumber, this.searchForm.name, this.searchForm.mobile, this.currentPage, this.limit).then(response => {
        this.memberlist = response.data
        this.total = response.totalnum
        this.loadingMemberList = false
      }).catch(error => {
        console.log(error)
      })
    },
    // 分页处理
    pagechange: function (currentPage) {
      this.currentPage = currentPage
      this.retrieve()
    },
    handleSizeChange: function (currentSize) {
      this.limit = currentSize
      this.retrieve()
    },
    handleMemberListCurrentChange(val) {
      this.currentMemberListRow = val;
    },
    confirmMemberSelect() {
      this.inputCardnumber = this.currentMemberListRow.cardnumber
      this.inputCustomerName = this.currentMemberListRow.realname
      this.dialogMemberSearchVisible = false
    },
    memberTypeChanged: function (item) {
      this.selectMemberType = item
      if (this.selectMemberType !== '0') {
        this.dialogCardInputVisible = true
      }
    },
    productTypeselected: function (item) {
      this.activeProductType = item
    },
    orderlineSelected: function (item) {
      this.activeOrderline = item
    },
    closeWxDialog: function () {
      this.dialogWxVisible = false
      this.wxerror = ''
      this.qrcode = ''
    },
    getCardInfo: function () {
      var that = this
      queryPerson(this.inputCardnumber).then(res => {
        if (res.code === 20000) {
          if (res.appcode === 201) {
            that.carderror = res.data
          } else {
            that.member = res.data
            that.inputCustomerName = res.data.realname
            // that.customerTypeId = res.data.memberType.id
            that.customerName = res.data.realname
            that.cardnumber = res.data.cardNumber
            this.dialogCardInputVisible = false
          }
        }
      })
    },
    confirmCardNumber: function () {
      if (this.inputCardnumber === '') {
        this.selectedMemberType = 0
        this.dialogCardInputVisible = false
      } else {
        this.getCardInfo()
        this.dialogCardInputVisible = false
        this.inputCardnumber = ''
        this.inputCustomerName = ''
      }
    },
    cancelCardNumber: function () {
      this.inputCardnumber = ''
      this.inputCustomerName = ''
      this.carderror = ''
      this.dialogCardInputVisible = false
      this.selectedMemberType = 0
    },
    // function orderline
    clearOrdered: function () {
      this.orderedlist = []
      this.cardnumber = ''
      this.customerName = ''
      // this.customerTypeId = 0
      this.totalamount = 0
      this.shouldpayamount = 0
      this.payedamount = ''
      this.changeamount = 0
      this.discountamount = 0
      this.inputCardnumber = ''
      this.inputCustomerName = ''
      this.carderror = ''
      this.qrcode = ''
      this.member = {}
      this.selectedMemberType = 0
    },
    addQty: function () {
      var arr = Object.keys(this.activeOrderline)
      if (arr.length > null) {
        var item = this.activeOrderline
        this.addOrder(item.productId, item.productName, item.memberprice, 1)
      } else {
        console.log('null')
      }
    },
    minusQty: function () {
      if (this.activeOrderline != null) {
        var item = this.activeOrderline
        this.addOrder(item.productId, item.productName, item.memberprice, -1)
      } else {
        console.log('null')
      }
    },
    removeLine: function () {
      if (this.activeOrderline != null) {
        var item = this.activeOrderline
        this.addOrder(item.productId, item.productName, item.memberprice, this.activeOrderline.qty * (-1))
      } else {
        console.log('null')
      }
    },
    productSelected: function (item) {
      // 计算orderlist 中是否有重复的等等
      // 计算总金额，优惠金额
      this.addOrder(item.productId, item.productName, item.memberprice, 1)
    },
    addOrder: function (productId, name, price, qty) {
      var order = {
        productId: productId,
        name: name,
        price: price,
        qty: qty,
        amount: qty * price
      }
      var found = false
      if (this.orderedlist.length > 0) {
        for (var i = 0; i < this.orderedlist.length; i++) {
          if (this.orderedlist[i].productId === order.productId) {
            this.orderedlist[i].qty += order.qty
            if (this.orderedlist[i].qty > 0) {
              this.orderedlist[i].amount = this.orderedlist[i].qty * this.orderedlist[i].price
            } else {
              this.orderedlist.splice(i, 1)
              this.activeOrderline = {}
            }
            found = true
            break
          }
        }
      }
      if (!found && order.qty > 0) {
        this.orderedlist.push(order)
      }
      var amount = 0
      for (var j = 0; j < this.orderedlist.length; j++) {
        amount += this.orderedlist[j].qty * this.orderedlist[j].price
      }
      this.totalamount = amount
      this.shouldpayamount = amount
    },
    // search
    searchMember: function () {
      this.dialogMemberSearchVisible = true
    },
    // Receieve
    showCash: function () {
      if (this.shouldpayamount === 0) {
        return
      }
      this.dialogCashVisible = true
    },
    showWx: function () {
      if (this.shouldpayamount === 0) {
        return
      }
      this.dialogWxVisible = true
    },
    showAli: function () {
      if (this.shouldpayamount === 0) {
        return
      }
      this.dialogAliVisible = true
    },
    showCardDialog: function () {
      if (this.shouldpayamount === 0) {
        return
      }
      if (this.member === null) {
        return
      }
      if(JSON.stringify(this.member) === '{}') {
        Message({
          message: '请先选择会员',
          type: 'error',
          duration: 5 * 1000
        })
        return
      }
      if (this.member.balance < this.shouldpayamount) {
        Message({
          message: '会员余额不足',
          type: 'error',
          duration: 5 * 1000
        })
        return
      }
      this.dialogCardVisible = true
    },
    recalcuateOrder: function () {
      var amount = 0
      if (this.orderedlist.length > 0) {
        for (var i = 0; i < this.orderedlist.length; i++) {
          for (var j = 0; j < this.products.length; j++) {
            if (this.orderedlist[i].productId === this.products[j].productId) {
              this.orderedlist[i].price = this.products[j].memberprice
              this.orderedlist[i].amount = this.orderedlist[i].qty * this.orderedlist[i].price
            }
          }
          amount += this.orderedlist[i].qty * this.orderedlist[i].price
        }
      }
      this.totalamount = amount
      this.shouldpayamount = amount
    },
    recieveCash: function () {
      if (this.payedamount === '') {
        return
      }
      if (this.payedamount < this.shouldpayamount) {
        return
      }
      var param = {
        shopid: store.getters.branches,
        orderline: this.orderedlist,
        shouldpayamount: this.shouldpayamount,
        payedamount: this.payedamount,
        changeamount: this.changeamount,
        payway: 1,
        qrcode: '',
        cardnumber: this.member.cardnumber
      }
      var that = this
      saveOrder(store.getters.branches, JSON.stringify(this.orderedlist), this.shouldpayamount, 
        this.payedamount, this.changeamount, 1, '', this.member.cardnumber).then(res => {
        var orderdate = parseTime(new Date(), '{y}-{m}-{d} {h}:{i}')
        var param = {
          seq: res.data.seq,
          orderdate: orderdate,
          orderline: this.orderedlist,
          shouldpayamount: this.shouldpayamount,
          payedamount: this.payedamount,
          changeamount: this.changeamount,
          payway: '现金支付',
          qrcode: this.qrcode,
          cardnumber: this.member.cardNumber
        }
        this.print(param)
        this.clearOrdered()
        this.dialogCashVisible = false
      })
    },
    recieveWx: function () {
      if (this.shouldpayedamount === 0) {
        return
      }
      this.payedamount = this.shouldpayamount
      var param = {
        shopid: store.getters.branches,
        orderline: this.orderedlist,
        shouldpayamount: this.shouldpayamount,
        payedamount: this.payedamount,
        changeamount: this.changeamount,
        payway: 2,
        qrcode: this.qrcode,
        cardnumber: this.member.cardNumber
      }
      this.loadingWxPay = true
      saveOrder(store.getters.branches, JSON.stringify(this.orderedlist), this.shouldpayamount, 
        this.payedamount, this.changeamount, 2, this.qrcode, this.member.cardnumber).then(res => {
        if (res.code === 20000) {
          if (res.appcode === 201) {
            this.wxerror = res.data
            this.loadingWxPay = false
            return
          }
        }
        var orderdate = parseTime(new Date(), '{y}-{m}-{d} {h}:{i}')
        var param = {
          seq: res.data.seq,
          orderdate: orderdate,
          orderline: this.orderedlist,
          shouldpayamount: this.shouldpayamount,
          payedamount: this.payedamount,
          changeamount: this.changeamount,
          payway: '微信支付',
          qrcode: this.qrcode,
          cardnumber: this.member.cardNumber
        }
        this.print(param)
        this.clearOrdered()
        this.wxerror = ''
        this.loadingWxPay = false
        this.dialogWxVisible = false
      }).catch(error => {
        console.log(error)
        this.wxerror = '支付错误'
        this.qrcode = ''
      })
    },
    recieveAli: function () {
      var param = {
        shopid: store.getters.branches,
        orderline: this.orderedlist,
        shouldpayamount: this.shouldpayamount,
        payedamount: this.payedamount,
        changeamount: this.changeamount,
        payway: 3,
        qrcode: this.qrcode,
        cardnumber: this.member.cardNumber
      }
      saveOrder(store.getters.branches, JSON.stringify(this.orderedlist), this.shouldpayamount, 
        this.payedamount, this.changeamount, 3, this.qrcode, this.membercardnumber).then(res => {
        var arr = {
          seq: res.data.seq,
          orderdate: res.data.orderdate,
          orderline: this.orderedlist,
          shouldpayamount: this.shouldpayamount,
          payedamount: this.payedamount,
          changeamount: this.changeamount,
          payway: 2,
          qrcode: this.qrcode,
          cardnumber: this.member.cardNumber
        }
        this.print(arr)
        this.clearOrdered()
        this.dialogAliVisible = false
      })
    },
    recieveCard: function () {
      saveOrder(store.getters.branches, JSON.stringify(this.orderedlist), this.shouldpayamount, 
        this.shouldpayamount, this.changeamount, 4, '', this.member.cardnumber).then(res => {
          var param = res.data
          console.log(param)
          var arr = {
            seq: res.data.seq,
            orderdate: res.data.orderdate,
            orderline: this.orderedlist,
            shouldpayamount: this.shouldpayamount,
            payedamount: this.payedamount,
            changeamount: this.changeamount,
            payway: '会员卡支付',
            qrcode: this.qrcode,
            cardnumber: this.member.cardNumber,
            balance: res.data.balance
          }
          this.print(arr)

          // this.printMember(param)
          this.dialogCardVisible = false
          this.clearOrdered()
      })
    },
    setPrinter (webview, printer, printcount) {

      webview.addEventListener('dom-ready', () => {
        console.log('dom-ready')
        // webview.openDevTools() // 这个方法可以打开print.html的控制台
      })
      webview.addEventListener('ipc-message', event => {
        if (event.channel === 'pong') {
            webview.print(
              {
                silent: true,
                printBackground: false,
                deviceName: printer
              },
              data => {
                if (printcount == 2) {
                  webview.print(
                  {
                    silent: true,
                    printBackground: false,
                    deviceName: printer
                  },  
                  data => {
                    console.log('webview success', data)    
                  })
                }
                // console.log('webview success', data)
              }
            )
        }
      })
    },
    print (arr) {
      // const webview = this.$refs.frontView
      // webview.send('ping', arr) // 向webview嵌套的页面响应事件
      if (this.sysParam.printFront) {
        const webview = this.$refs.frontView
        webview.send('ping', arr) // 向webview嵌套的页面响应事件
       // webview.send('ping', arr) // 向webview嵌套的页面响应事件
      }
      if (this.sysParam.printBack) {
        const webview = this.$refs.backView
        webview.send('ping', arr) // 向webview嵌套的页面响应事件
        //  webview.send('ping', arr) // 向webview嵌套的页面响应事件
      }
    }
  }
}
</script>

<style scoped>
.el-card {height:auto}
.el-card ul {margin: 0}
.Pos {display:flex; background: #f3f3f3}
.leftarea {flex: 0 0 30%; margin:10px 0 10px 10px ; display:flex; flex-direction:column;}
.orderedlist {flex-grow: 1; margin:5px 0px}
.orderedlist >>> .el-card__body {padding: 10px}
.orderedlist ul li {display:flex; justify-content:space-between;padding:10px}
.orderedlist ul li.active {background: lightblue; color:white}

.functions {flex: 0 0 auto; padding: 10px 0}
.functions ul {display:flex; flex-wrap: wrap}
.functions ul li {height:50px; border:1px solid #f0f0f0; line-height:50px; text-align:center; flex: 1;
  display:flex; font-size:12px; background: #d9ecff; color: #333; flex-direction: column; border-radius: 5px; margin:0 3px; cursor:-webkit-grab}
.functions ul li:hover{color: rgb(143, 34, 34) }

.rightarea{display:flex; flex-direction:column; padding:10px; flex: 1}
.producttype {height: auto; flex: 0 0 auto; margin-bottom: 10px}
.producttype >>> .el-card__body { padding:10px}
.producttype ul { display:flex; flex-wrap: wrap}
.producttype ul li {height:50px; width:100px;border:1px solid #f0f0f0; line-height:50px; text-align:center; 
  margin:2px;background:#fde2e2;border-radius: 5px; ; cursor:-webkit-grab}
.producttype ul li.active{background: lightgreen; color:#333}

.products {height: auto; flex: 1 0 auto; margin-bottom: 10px}
.products >>> .el-card__body{padding:10px}
.products ul {display:flex; flex-wrap: wrap}
.products ul li {height:80px; border:1px solid #f0f0f0; flex: 0 0 20%;
  font-size:12px; background: lightcyan; color: #333;
  display:flex; flex-direction: column; border-radius: 5px; cursor:-webkit-grab}
.products ul li:hover{color:rgb(143, 34, 34); border-bottom:1px solid #aaa; border-right:1px solid #aaa}

.products .prodid {padding:5px 0 0 10px; cursor:-webkit-grab}

.payfunctions {flex: 0 0 auto}
.payfunctions >>> .el-card__body { padding: 10px}
.payfunctions ul {display:flex; flex-wrap: wrap}
.payfunctions ul li {height:50px; border:1px solid #f0f0f0; line-height:50px; text-align:center; flex: 0 0 100px;
  display:flex; font-size:13px; background:#409EFF; color: #fff; flex-direction: column; border-radius: 5px; cursor:-webkit-grab}

.disable{color:#f0f0f0}
</style>
