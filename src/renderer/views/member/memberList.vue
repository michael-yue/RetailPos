<template>
  <div class="memberlist">
    <div ref="critheader" class="critheader">
      <el-menu ref="membermenu" :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item index="1">会员列表</el-menu-item>
        <el-menu-item index="2">会员查询</el-menu-item>
      </el-menu>
      <div style="display:flex; align-items: center;margin:10px 10px; font-size:14px">
        <span style="flex:0 0 auto; margin-right:5px;">会员类型</span>
          <MemberTypeSelector :member-type-id="memberTypeId" @MemberTypeChanged="MemberTypeChangedEvent" />
        <span style="flex:0 0 auto; margin-right:5px;">会员卡号</span>
        <el-input v-model="cardnumber" label="会员卡号" size="small" />
        <span style="flex:0 0 auto;margin: 0px 5px;">姓名</span>
        <el-input v-model="name" label="姓名" size="small" />
        <span style="flex:0 0 auto;margin: 0px 5px; font-size:14px">电话</span>
        <el-input v-model="mobile" label="电话" size="small" />
        <div style="padding-left:5px; display: inherit">
        <el-button plain size="small" type="primary" @click="query">查询</el-button>
        <el-button plain size="small" type="primary" @click="createDialog">新建</el-button>
        </div>
      </div>
    </div>
    <div :style="{height: myHeight}" style="padding:0 20px 10px 20px;">
      <el-table
        v-loading="loading"
        ref="refTable"
        :data="tableData"
        :class="{'tablestyle': true}"
        :header-cell-style="tableheader"
        border
        size="small"
        height="100%">
        <el-table-column prop="cardnumber" label="卡号" width="" header-align="center" align="left" />
        <el-table-column prop="realname" label="姓名" width="" header-align="center" align="left" />
        <el-table-column prop="gender" label="性别" width="" header-align="center" align="left">
          <template slot-scope="props">
            <div v-if="props.row.gender === '1'">男</div>
            <div v-else>女</div>
          </template>
        </el-table-column>
        <el-table-column prop="mobile" label="电话" width="" header-align="center" align="left" />
        <el-table-column prop="memberType.name" label="类型" width="" header-align="center" align="left" />
        <el-table-column
          fixed="right"
          align="center"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="edit(scope.$index, scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="showRecharge(scope.$index, scope.row)">充值</el-button>
          </template>
        </el-table-column>
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
    <el-dialog
      :visible.sync="dialogFormVisible"
      :fullscreen="false"
      :modal="true"
      :show-close="true"
      title="会员信息"
      top="5vh">
      <div>
        <el-form ref="editForm" :model="editForm" :rules="editFormRules" label-width="120px">
          <el-form-item label="卡号" prop="cardNumber">
            <el-input v-model="editForm.cardNumber" size="small" maxlength="20"/>
          </el-form-item>
          <el-form-item label="姓名" prop="realName">
            <el-input v-model="editForm.realName" size="small" maxlength="20"/>
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-radio-group v-model="editForm.gender">
              <el-radio label="1">男</el-radio>
              <el-radio label="2">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="电话" prop="mobile">
            <el-input v-model="editForm.mobile" size="small" maxlength="20"/>
          </el-form-item>
          <el-form-item label="微信支付码" prop="authcode">
            <el-input v-model="editForm.authcode" size="small" maxlength="40"/>
          </el-form-item>
          <el-form-item label="会员类型" prop="membertypeId">
            <MemberTypeSelector :member-type-id="editForm.membertypeId" @MemberTypeChanged="FormMemberTypeChangedEvent" />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="closeDialog">取 消</el-button>
        <el-button v-if="formstatus =='create'" v-loading="loadingCreateMember" type="primary" @click="createMember">新建</el-button>
        <el-button v-else type="primary" @click="updateMember">修改保存</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogRechargeFormVisible"
      :fullscreen="false"
      :modal="true"
      :show-close="true"
      title="会员充值"
      top="5vh">
      <div>
        <el-form :model="rechargeForm" label-width="180px">
          <el-form-item label="会员卡号">
            <span> {{rechargeForm.cardnumber}}</span>
          </el-form-item>
          <el-form-item label="充值金额">
            <el-input v-model="rechargeForm.rechargeamount" />
          </el-form-item>
          <el-form-item label="充值方式">
            <el-radio-group v-model="rechargeForm.payway">
              <el-radio-button :label="1">微信</el-radio-button>
              <el-radio-button :label="3">现金</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="closeRechargeDialog">取 消</el-button>
        <el-button type="primary" @click="recharge">充 值</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import store from '@/store'
import { listAllUser, createCard, updateCard } from '@/api/person.js'
import MemberTypeSelector from '@/components/widgets/MemberTypeSelector'

export default {
  name: 'MemberList',
  components: {
    MemberTypeSelector
  },
  data () {
    return {
      activeIndex: '1',
      myHeight: '',
      loading: false,
      tableData: [],
      total: 0,
      limit: 10,
      currentPage: 1,
      critUserType: 0,
      cardnumber: '',
      name: '',
      mobile: '',
      memberTypeId: 0,
      // edit dialog
      dialogFormVisible: false,
      dialogRechargeFormVisible: false,
      formstatus: '',
      editForm: {
        id: 0,
        openid: '',
        realName: '',
        gender: 0,
        authcode: '',
        idcardno: '',
        membertypeId: 0,
        cardNumber: '',
        mobile: ''
      },
      editFormRules: {
        realName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        cardNumber: [{ required: true, message: '请输入卡号', trigger: 'blur' }],
        // membertypeId: [{ required: true, message: '请输入代码', trigger: 'blur' }]
        mobile: [{ required: true, message: '请输入电话', trigger: 'blur' }]
      },
      rechargeForm: {
        cardnumber: '',
        payway: 1,
        rechargeamount: ''
      },
      loadingCreateMember: false
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
    // this.retrieve()
  },
  methods: {
    query: function () {
      this.retrieve()
    },
    retrieve: function () {
      this.loading = true
      listAllUser(this.membertypeId, this.cardnumber, this.name, this.mobile, this.currentPage, this.limit).then(response => {
        this.tableData = response.data
        this.total = response.totalnum
        this.loading = false
      }).catch(error => {
        console.log(error)
      })
    },
    createDialog: function () {
      this.editForm = {
        id: 0,
        openid: '',
        realName: '',
        gender: 0,
        authcode: '',
        idcardno: '',
        membertypeId: 0,
        cardNumber: '',
        mobile: ''
      }
      // this.$refs['editForm'].resetFields()
      this.dialogFormVisible = true
      this.formstatus = 'create'
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
    MemberTypeChangedEvent: function (event) {
      this.membertypeId = event.MemberTypeId
    },
    FormMemberTypeChangedEvent: function (event) {
      console.log(event)
      this.editForm.membertypeId = event.MemberTypeId
    },
    closeDialog: function () {
      this.$refs['editForm'].resetFields()
      this.dialogFormVisible = false
    },
    edit: function (index, row) {
      this.editForm.id = row.id
      this.editForm.realName = row.realname
      this.editForm.cardNumber = row.cardnumber
      this.editForm.gender = row.gender
      this.editForm.mobile = row.mobile
      if (row.memberType !== null) {
        this.editForm.membertypeId = row.memberType.id
      } else {
        this.editForm.membertypeId = 0
      }
      this.formstatus = 'update'
      this.dialogFormVisible = true
    },
    createMember: function () {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {})
            .then(() => {
              console.log('this.edifrom')
              console.log(this.editForm)
              const para = Object.assign({}, this.editForm)
              para.shopid = store.getters.branches
              console.log(para)
              this.loadingCreateMember = true
              createCard(para).then(res => {
                if (res.code === 20000) {
                  this.$message({
                    message: '提交成功',
                    type: 'success'
                  })
                }
                this.$refs['editForm'].resetFields()
                this.loadingCreateMember = false
                this.retrieve()
              })
            })
            .catch(e => {
              console.log(e)
            })
        }
      })
    },
    updateMember: function () {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {})
            .then(() => {
              const para = Object.assign({}, this.editForm)
              console.log(para)
              para.shopid = store.getters.branches
              updateCard(para).then(res => {
                if (res.code === 20000) {
                  this.$message({
                    message: '提交成功',
                    type: 'success'
                  })
                }
                this.$refs['editForm'].resetFields()
                this.dialogFormVisible = false
                this.retrieve()
              })
            })
            .catch(e => {
              console.log(e)
            })
        }
      })
    },
    showRecharge: function (index, row) {
      console.log(index)
      this.dialogRechargeFormVisible = true
    },
    recharge: function () {
      console.log('recharge')
      this.dialogRechargeFormVisible = true
    },
    closeRechargeDialog: function () {
      this.dialogRechargeFormVisible = false
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
.el-card >>> .el-card__body {padding: 10px}
.el-menu--horizontal>.el-menu-item {height:40px; line-height: 40px}
</style>
