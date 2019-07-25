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
          <el-button icon="el-icon-search" size="small" @click="searchMember"></el-button>
        </div>
        <div style="flex: 0 0 auto; margin-left:5px; display: flex;">
          <span style="font-size:14px; flex: 0 0 auto; margin:auto;padding:0 5px" >微信支付码</span>
          <el-input size="small" v-model="authcode" />
        </div>
      </div>
    </div>
    <div :style="{height: myHeight}" style="padding:0 20px 10px 20px;">
      
    </div>
  </div>
</template>

<script>
import { queryMemberInfoByCardnumber } from '@/api/person.js'
import MemberTypeSelector from '@/components/widgets/MemberTypeSelector'

export default {
  name: 'PersonArpproveList',
  components: {
    MemberTypeSelector
  },
  data () {
    return {
      activeIndex: '2',
      myHeight: '',
      loading: false,
      critStatus: 1,
      dialogMemberSearchVisible: false,
      // edit dialog
      membernumber: '',
      authcode: '',
      form: {
        id: '',
        openid: '',
        realName: '',
        usertypeId: '',
        payway: 1
      },
      editFormRules: {
        realname: [{ required: true, message: '请输入顺序号', trigger: 'blur' }],
        usertypeId: [{ required: true, message: '请输入代码', trigger: 'blur' }]
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
    this.myHeight = (h - critheaderheight - 50) + 'px'
    var that = this
    window.onresize = function windowResize () {
      const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight // 浏览器高度
      that.myHeight = (h - critheaderheight - 50) + 'px'
    }
  },
  created: function () {
    // this.retrieve()
  },
  methods: {
    retrieveByNumber: function () {
      this.loading = true
      queryMemberInfoByCardnumber(this.membernumber).then(res => {
        this.loading = false
        console.log(res)
      }).catch(error => {
        console.log(error)
      })
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
