<template>
  <div class="cardlist">
    <div ref="critheader" class="critheader">
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item index="1">会员列表</el-menu-item>
        <el-menu-item index="2">会员查询</el-menu-item>
      </el-menu>
      <div style="display: flex; margin: 10px">
        <div style="flex: 0 0 auto; margin-left:5px; display: flex;">
          <span style="font-size:14px; flex: 0 0 auto; margin:auto;padding:0 5px" >会员卡号:</span>
          <el-input size="small" v-model="membernumber" @keyup.enter.native="retrieveByNumber"/>
          <!-- <el-button icon="el-icon-search" size="small" @click="searchMember"></el-button> -->
        </div>
        <div style="flex: 0 0 auto; margin-left:5px; display: flex;">
          <span style="font-size:14px; flex: 0 0 auto; margin:auto;padding:0 5px" >微信支付码</span>
          <el-input size="small" v-model="authcode" @keyup.enter.native="retrieveByAuthcode"/>
        </div>
      </div>
    </div>
    <div :style="{height: myHeight}" style="padding:0 20px 10px 20px;">
      <div v-show="contentVisible" style="font-size:14px">
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
      <div v-show="contentVisible" style="font-size:14px">
        <el-table :data="memberInfo.transList" size="small" height="100%">
          <el-table-column prop="transDate" label="产品代码" align="left"/>
          <el-table-column prop="productname" label="名称" align="left" />
          <el-table-column prop="qty" label="数量" align="right"/>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { queryMemberInfoByCardnumber, queryMemberInfoByAuthcode } from '@/api/person.js'

export default {
  name: 'PersonArpproveList',
  data () {
    return {
      activeIndex: '2',
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
  watch: {
    critStatus (oldval, newval) {
      this.retrieve()
    }
  },
  mounted () {
    const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight // 浏览器高度
    const critheaderheight = this.$refs.critheader.offsetHeight
    this.myHeight = (h - critheaderheight - 60) + 'px'
    var that = this
    window.onresize = function windowResize () {
      const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight // 浏览器高度
      that.myHeight = (h - critheaderheight - 60) + 'px'
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
        console.log(this.memberInfo)
      }).catch(error => {
        console.log(error)
      })
    },
    retrieveByAuthcode: function () {
      this.loading = true
      queryMemberInfoByAuthcode(this.authcode).then(res => {
        this.contentVisible = true
        this.memberInfo = res.data
        this.loading = false
        console.log(this.memberInfo)
      }).catch(error => {
        console.log(error)
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
