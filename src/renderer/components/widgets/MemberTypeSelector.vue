<template>
  <div class="membertypeselect">
    <el-select v-model="selectedMemberTypeId" size="small" class="text-left">
      <el-option v-if="type == 'all'" :value="0" :key="0" label="全部">全部</el-option>
      <el-option v-for="item in membertypes" :value="item.id" :label="item.name" :key="item.id" name="usertype" placeholder="请选择人员类型">
        {{ item.name }}
      </el-option>
    </el-select>
  </div>
</template>

<script>
import { listAllMemberType } from '@/api/person'
export default {
  name: 'SelectMemberType',
  props: {
    MemberTypeId: {
      default: 0,
      type: Number
    },
    type: {
      default: 'select',
      type: String
    }
  },
  data () {
    return {
      selectedMemberTypeId: '',
      membertypes: []
    }
  },
  watch: {
    selectedMemberTypeId (val, oldval) {
      this.$emit('MemberTypeChanged', { MemberTypeId: this.selectedMemberTypeId })
    },
    MemberTypeId (val, oldval) {
      this.selectedMemberTypeId = this.MemberTypeId
    }
  },
  created: function () {
    if (this.MemberTypeId !== 0) {
      this.selectedMemberTypeId = this.MemberTypeId
    }
    this.retrieve()
  },
  methods: {
    retrieve: function () {
      var that = this
      listAllMemberType().then(response => {
        that.membertypes = response.data
        console.log(this.membertypes)
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>

<style scope>
.membertypeselect{display:inline-block;margin:0px; width:100%; min-width:200px}
</style>
