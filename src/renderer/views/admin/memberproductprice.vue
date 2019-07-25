<template>
  <div class="cardlist">
    <div ref="critheader" style="padding:10px 20px">
      <el-menu ref="adminmenu" :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item index="1">设置打印机</el-menu-item>
        <el-menu-item index="2">会员类型</el-menu-item>
        <el-menu-item index="3">产品设置</el-menu-item>
        <el-menu-item index="4">会员价格</el-menu-item>
      </el-menu>
    </div>
    <div :style="{height: myHeight}" style="padding:0 20px 10px 20px;">
      <!-- <div style="text-align:right;margin-bottom:10px">
        <el-button type="primary" plain size="small" style="margin-left:20px" @click="add" >新建</el-button>
      </div> -->
      <el-table
        id="datatable"
        :data="tableData"
        size="small"
        height="100%">
        <!-- <el-table-column v-if="!firstshow" fixed prop="itemname" label="项目" width="200" header-align="center" align="left" /> -->
        <el-table-column prop="productId" label="编码" width="100" header-align="center" align="right" />
        <el-table-column prop="name" label="名称" header-align="center" align="left" />
        <el-table-column prop="type" label="类型" header-align="center" align="right" />
        <el-table-column
          v-for="item in tableConfig"
          :label="item.label"
          :prop="item.prop"
          :key="item.id"
          header-align="center"
          align="right" />
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="edit(scope.$index, scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :visible.sync="dialogFormVisible"
      :fullscreen="false"
      :modal="true"
      :show-close="true"
      title="会员价格"
      top="5vh">
      <div>
        <el-form ref="editForm" :model="editForm" :rules="editFormRules" label-width="80px">
          <el-form-item label="编码" size="small" prop="typeName">
            <span>{{editForm.productId}}</span>
          </el-form-item>
          <el-form-item label="名称" size="small" prop="typeName">
            <span>{{editForm.productName}}</span>
          </el-form-item>
          <el-table
            id="datatable"
            :data="editFrom.priceList"
            size="small"
            height="100%">
            <el-table-column prop="typeName" label="会员类型" header-align="center" align="left" />
            <el-table-column prop="price" label="单价" header-align="center" align="left" >
              <template slot-scope="scope">
                <el-form-item label="单价" size="small" prop="price">
                  <el-input v-model="scope.row.price" maxlength="5"/>
                </el-form-item>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">添加</el-button>
        <el-button v-else type="primary" @click="updateData">修改</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import store from '@/store'
// import { listAllMemberType } from '@/api/person.js'
import { listAllMemberProductPrice, updateMemberPrice, createMemberPrice, deleteMemberPrice } from '@/api/product.js'

export default {
  name: 'MemberProductList',
  data () {
    return {
      activeIndex: '4',
      myHeight: '',
      loading: false,
      // 表格变量
      tableData: [],
      tableConfig: [],
      total: 0,
      // flag: false
      dialogFormVisible: false,
      dialogStatus: '',
      editForm: {
        productId: 0,
        productName: '',
        priceList: []
      },
      editFormRules: {
        userFee: [{ required: true, message: '请输入名称', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 4 到 20 个字符', trigger: 'blur' }]
      }
    }
  },
  watch: {
    //
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
    this.retrieve()
  },
  methods: {
    retrieve: function () {
      this.loading = true
      listAllMemberProductPrice(store.getters.branches).then(response => {
        this.tableConfig = response.data.tableHeader
        this.tableData = response.data.tableData
        // this.total = response.totalnum
        this.loading = false
      }).catch(error => {
        console.log(error)
      })
    },
    tableheader ({ row, index }) {
      return 'background:#DCDFE6;'
    },
    edit: function (index, row) {
      console.log(row)
      var productId = row.productId
      getMemberProductPrice(store.getters.branches, row.productId).then(res => {
        // this.editForm
      })
      this.editForm = {
        id: row.id,
        typeId: row.typeId,
        typeName: row.typeName,
      }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    updateData: function () {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {})
            .then(() => {
              const para = Object.assign({}, this.editForm)
              updateMemberPrice(para).then(res => {
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
    handleSelect (key, keyPath) {
      if (key === '1') {
        this.$router.push('/system/setting')
      } else if (key === '2') {
        this.$router.push('/system/usertype')
      } else if (key === '3') {
        this.$router.push('/system/product')
      } else if (key === '4') {
        this.$router.push('/system/memberproductprice')
      }
    }
  }
}
</script>

<style scoped>
.el-menu--horizontal>.el-menu-item {height:40px; line-height: 40px}
.critheader {padding:10px 20px; display: flex; justify-content: space-between}
</style>
