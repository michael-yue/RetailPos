<template>
  <div class="cardlist">
    <div ref="critheader" class="critheader">
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item index="1">会员列表</el-menu-item>
        <el-menu-item index="2">会员查询</el-menu-item>
      </el-menu>
      <div style="display: flex; margin: 10px">
        <div style="flex: 0 0 auto; margin-left:5px; display: flex;">
          <span style="font-size:14px; flex: 0 0 auto; margin:auto;padding:0 5px" >会员卡号</span>
          <el-input size="small" v-model="membernumber" @keyup.enter.native="retrieveByNumber"/>
        </div>
        <div style="flex: 0 0 auto; margin-left:5px; display: flex;">
          <span style="font-size:14px; flex: 0 0 auto; margin:auto;padding:0 5px" >微信支付码</span>
          <el-input size="small" v-model="authcode" />
        </div>
      </div>
    </div>
    <div :style="{height: myHeight}" style="padding:0 20px 10px 20px;">
      <el-tabs type="border-card" style="height:100%">
        <el-tab-pane label="用户资料">
          用户资料
        </el-tab-pane>
        <el-tab-pane label="充值记录">充值历史</el-tab-pane>
        <el-tab-pane label="消费记录">消费历史</el-tab-pane>
      </el-tabs>
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
    tableheader ({ row, index }) {
      return 'background:#E4E7ED;'
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
    UserTypeChangedEvent: function (event) {
      // this.usertypeid = event.usertypeId
      this.editForm.usertypeId = event.userTypeId
    },
    closeDialog: function () {
      this.$refs['editForm'].resetFields()
      this.dialogFormVisible = false
    },
    edit: function (index, row) {
      // this.editForm = Object.assign({}, row)
      console.log(row)
      this.editForm.id = row.id
      this.editForm.openid = row.openid
      this.editForm.realName = row.realname
      if (row.userType !== null) {
        this.editForm.usertypeId = row.userType.id
      } else {
        this.editForm.usertypeId = ''
      }
      console.log(this.editForm)
      this.dialogFormVisible = true
    },
    handleSelect (key, keyPath) {
      if (key === '1') {
        this.$router.push('/member/memberList')
      } else if (key === '2') {
        this.$router.push('/member/memberQuery')
      }
    }
    // deleterow: function (index, row) {
    //   this.$confirm('确认删除吗？', '提示', {})
    //     .then(() => {
    //       const para = Object.assign({}, row)
    //       deleteUser(para).then(res => {
    //         if (res.code === 20000) {
    //           this.$message({
    //             message: '提交成功',
    //             type: 'success'
    //           })
    //         }
    //         this.dialogFormVisible = false
    //         this.retrieve()
    //       })
    //     })
    //     .catch(e => {
    //       console.log(e)
    //     })
    // },
    // updateData: function () {
    //   this.$refs.editForm.validate(valid => {
    //     if (valid) {
    //       this.$confirm('确认提交吗？', '提示', {})
    //         .then(() => {
    //           const para = Object.assign({}, this.editForm)
    //           approveUser(para).then(res => {
    //             if (res.code === 20000) {
    //               this.$message({
    //                 message: '提交成功',
    //                 type: 'success'
    //               })
    //             }
    //             this.$refs['editForm'].resetFields()
    //             this.dialogFormVisible = false
    //             this.retrieve()
    //           })
    //         })
    //         .catch(e => {
    //           console.log(e)
    //         })
    //     }
    //   })
    // }
  }
}
</script>
<style scoped>
.critheader {padding:10px 20px}
.el-card >>> .el-card__body {width: 100%; display: flex;}
.el-menu--horizontal>.el-menu-item {height:40px; line-height: 40px}
</style>
