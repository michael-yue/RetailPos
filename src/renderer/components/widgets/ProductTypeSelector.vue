<template>
  <div class="producttypeselect">
    <el-select v-model="selectedProductTypeId" size="small" class="text-left">
      <el-option v-if="type == 'all'" :value="0" :key="0" label="全部">全部</el-option>
      <el-option v-for="item in producttypes" :value="item.id" :label="item.typeName" :key="item.id" name="usertype" placeholder="请选择人员类型">
        {{ item.typeName }}
      </el-option>
    </el-select>
  </div>
</template>

<script>
import { listAllProductType } from '@/api/product'
export default {
  name: 'SelectProductType',
  props: {
    productTypeId: {
      default: 0,
      type: Number
    },
    type: {
      default: 'select',
      type: String
    },
    shopId: {
      default: 0,
      type: Number
    }
  },
  data () {
    return {
      selectedProductTypeId: '',
      producttypes: []
    }
  },
  watch: {
    selectedProductTypeId (val, oldval) {
      this.$emit('productTypeChanged', { productTypeId: this.selectedProductTypeId })
    },
    productTypeId (val, oldval) {
      this.selectedProductTypeId = this.productTypeId
    }
  },
  created: function () {
    if (this.productTypeId !== 0) {
      this.selectedProductTypeId = this.productTypeId
    }
    this.retrieve()
  },
  methods: {
    retrieve: function () {
      var that = this
      console.log('this.shopId = ' + this.shopId)
      listAllProductType(this.shopId).then(response => {
        that.producttypes = response.data
        console.log(this.producttypes)
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>

<style scope>
.producttypeselect{display:inline-block;margin:0px}
</style>
