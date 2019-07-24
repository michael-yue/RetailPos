<template>
  <div class="mainreport">
    <el-card class="summary" style="display:flex;margin:10px">
      <div class="statitem">
        <span class="number">{{todayamount}}</span>
        <span class="desc">今日销售金额</span>
      </div>
      <div class="statitem">
        <span class="number">{{thismonthamount}}</span>
        <span class="desc">本月销售金额</span>
      </div>
      <div class="statitem">
        <span class="number">{{todaypersoncount}}</span>
        <span class="desc">今日就餐人数</span>
      </div>
      <div class="statitem">
        <span class="number">{{thismonthcount}}</span>
        <span class="desc">本月就餐人数</span>
      </div>
    </el-card>
    <div class="report">
      <div class="item" @click="reportPerson">
        <span style="margin:auto">就餐人员统计</span>
      </div>
      <div class="item" @click="reportSales">
        <span style="margin:auto">产品销售报表</span>
      </div>
    </div>
  </div>
</template>

<script>
import store from '@/store'
import { getSalesToday } from '@/api/report'
export default {
  name: 'report',
  data () {
    return {
      activeName: 'first',
      current: 0,
      dateRange: '',
      todayamount: 0,
      thismonthamount: 0,
      todaypersoncount: 0,
      thismonthcount: 0
    }
  },
  created () {
    this.getSalesToday()
  },
  methods: {
    // t
    reportPerson () {
      this.$router.push('/report/reportByPerson')
    },
    reportSales () {
      this.$router.push('/report/reportSales')
    },
    getSalesToday () {
      getSalesToday(store.getters.branches).then(res => {
        if (res.code === 20000) {
          this.todayamount = res.data.todayamount
          this.todaypersoncount = res.data.todaycount
          this.thismonthamount = res.data.monthamount
          this.thismonthcount = res.data.monthcount
        }
      })
    }
  }
}
</script>

<style scoped>
/* .mainreport {padding:10px} */
.summary >>>.el-card__body { display: flex; width:100%; justify-content:space-between}
.summary .statitem {display: flex; flex-direction:column; border:1px solid #f3f3f3; flex: 0 0 auto; 
margin:10px; background: rgb(217, 236, 255); padding:10px; min-width:150px; min-height: 70px}
.summary .statitem .number{font-size:36px; text-align:right}
.summary .statitem .desc{font-size:14px; color: #333}
.report {padding: 10px; display: flex; justify-content: space-around}
.report .item { height: 80px; margin: auto; flex: 0 0 25%; border: 1px solid #f3f3f3; display:flex; background: lightcyan}
</style>
