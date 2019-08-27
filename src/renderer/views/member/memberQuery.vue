<template>
  <div class="cardlist">
    <div ref="critheader" class="critheader">
      <!-- <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item index="1">会员列表</el-menu-item>
        <el-menu-item index="2">会员查询</el-menu-item>
      </el-menu> -->
      <div style="display: flex; margin: 10px">
        <div style="flex: 0 0 auto; margin-left:5px; display: flex;">
          <span style="font-size:14px; flex: 0 0 auto; margin:auto;padding:0 5px" >会员卡号:</span>
          <el-input size="small" v-model="membernumber" @keyup.enter.native="retrieveByNumber"/>
        </div>
        <div style="flex: 0 0 auto; margin-left:5px; display: flex;">
          <span style="font-size:14px; flex: 0 0 auto; margin:auto;padding:0 5px" >微信支付码</span>
          <el-input size="small" v-model="authcode" @keyup.enter.native="retrieveByAuthcode"/>
        </div>
      </div>
    </div>
    <div :style="{height: myHeight}" style="padding:0 20px 10px 20px; display:flex; flex-direction:column;">
      <div v-show="contentVisible" style="font-size:14px; coloe: #606266; flex: 0 0 auto; padding: 0 20px">
        <div style="display:flex;margin:10px 0px">
          <div>卡号：{{memberInfo.member.cardnumber}}</div>
        </div>
        <div style="display:flex;margin:10px 0px">
          <div style="min-width:200px">姓名：{{memberInfo.member.realname}}</div>
          <div>电话：{{memberInfo.member.mobile}}</div>
        </div>
        <div style="display:flex;margin:10px 0px">
          <div style="min-width:200px">余额：{{memberInfo.member.balance}}</div>
        </div>
        <el-row style="display:flex;margin:10px 0px">
          <div style="min-width:200px">总充值次数：{{memberInfo.member.totalrechargecount}}</div>
          <div>总充值金额：{{memberInfo.member.totalrechargeamount}}</div>
        </el-row>
        <el-row style="display:flex;margin:10px 0px">
          <div style="display:flex">
            <div style="min-width:200px">总消费次数：{{memberInfo.member.totalconsumcount}}</div>
            <div>总消费金额：{{memberInfo.member.totalconsumamount}}</div>
          </div>
        </el-row>
      </div>
      <el-table :data="memberInfo.transList" size="small" height="300px" v-show="contentVisible" style="font-size:13px;flex: 1 0 auto">
        <el-table-column prop="transDate" label="日期" align="center">
          <template slot-scope="props">
            <div>{{ props.row.transDate.time | formatDate }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="lines" label="产品" align="left">
        <template slot-scope="scope">
          <div v-for="line in scope.row.lines" :key="line.prodid">
            {{line.prodname}} x {{line.qty}}
          </div>
        </template>
      </el-table-column>
        <el-table-column prop="shouldPayAmount" label="金额" align="left" />
        <el-table-column prop="payWay" label="支付方式" align="right">
          <template slot-scope="scope">
            <div v-if="scope.row.payWay === '2'">微信支付</div>
            <div v-else-if="scope.row.payWay == '1'">现金支付</div>
            <div v-else-if="scope.row.payWay == '4'">会员卡支付</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import store from '@/store'
import { queryMemberInfoByCardnumber, queryMemberInfoByAuthcode } from '@/api/person.js'
import { parseTime } from '@/utils'
export default {
  name: 'PersonArpproveList',
  data () {
    return {
      // activeIndex: '2',
      myHeight: '',
      loading: false,
      contentVisible: false,
      // edit dialog
      membernumber: '',
      authcode: '',
      memberInfo: {
        member: {
          realname: '',
          cardnumber: ''
        }
      }
    }
  },
  filters: {
    formatDate (time) {
      const date = new Date(time)
      return parseTime(date, '{y}-{m}-{d} {h}:{i}:{s}')
    }
  },
  watch: {
    critStatus (oldval, newval) {
      this.retrieve()
    }
  },
  mounted () {
    const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight // 浏览器高度
    const critheaderheight = this.$refs.critheader.offsetHeight
    this.myHeight = (h - critheaderheight - 120) + 'px'
    var that = this
    window.onresize = function windowResize () {
      const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight // 浏览器高度
      that.myHeight = (h - critheaderheight - 120) + 'px'
    }
  },
  created: function () {
    // this.retrieve()
  },
  methods: {
    retrieveByNumber: function () {
      this.loading = true
      queryMemberInfoByCardnumber(this.membernumber).then(res => {
        this.contentVisible = true
        this.memberInfo = res.data
        this.loading = false
      }).catch(error => {
        console.log(error)
      })
      this.authcode = ''
      this.membernumber = ''
    },
    retrieveByAuthcode: function () {
      this.loading = true
      queryMemberInfoByAuthcode(store.getters.branches, this.authcode).then(res => {
        this.contentVisible = true
        this.memberInfo = res.data
        this.loading = false
      }).catch(error => {
        console.log(error)
        this.authcode = ''
      })
      this.authcode = ''
      this.membernumber = ''
    },
    searchMember: function () {
      this.dialogMemberSearchVisible = true
    },
    tableheader ({ row, index }) {
      return 'background:#E4E7ED;'
    },
    // 分页处理
    closeDialog: function () {
      this.$refs['editForm'].resetFields()
      this.dialogFormVisible = false
    },
    handleSelect (key, keyPath) {
      if (key === '1') {
        this.$router.push('/member/memberList')
      } else if (key === '2') {
        this.$router.push('/member/memberQuery')
      }
    }
  }
}
</script>
<style scoped>
.critheader {padding:10px 20px}
.el-card >>> .el-card__body {width: 100%; display: flex;}
.el-menu--horizontal>.el-menu-item {height:40px; line-height: 40px}
</style>
