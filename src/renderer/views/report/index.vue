<template>
  <div class="mainreport">
    <el-card class="summary" style="display:flex">
      <div style="display: flex; flex-direction:column; border:1px solid #f3f3f3; flex: 0 0 auto">
        <span style="font-size:24px; text-align:right">{{todayamount}}</span>
        <span>今日销售金额</span>
      </div>
      <div style="display: flex; flex-direction:column; border:1px solid #f3f3f3; flex: 0 0 auto">
        <span style="font-size:24px; text-align:right">{{thismonthamount}}</span>
        <span>本月销售金额</span>
      </div>
      今日就餐人数: {{todaypersoncount}}
      本月就餐人数: {{thismonthpersoncount}}
    </el-card>
    <div class="report">
      <div class="item" @click="reportPerson">
        <span style="margin:auto">就餐人员统计</span>
      </div>
      <div class="item" @click="reportPerson">
        <span style="margin:auto">产品销售报表</span>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'report',
  data () {
    return {
      activeName: 'first',
      current: 0,
      dateRange: '',
      todayamount: 0,
      thismonthamount: 0
    }
  },
  methods: {
    // t
    reportPerson () {
      console.log('ss')
      this.$router.push('/reportByPerson')
    }
  }
}
</script>

<style scoped>
/* .mainreport {padding:10px} */
.report {padding: 10px; display: flex; justify-content: space-around}
.report .item { height: 80px; margin: auto; flex: 0 0 25%; border: 1px solid #f3f3f3; display:flex}
</style>
