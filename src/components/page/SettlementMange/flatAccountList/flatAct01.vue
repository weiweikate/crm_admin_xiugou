<template>
    <div class="flat-act-01">
      <v-breadcrumb :nav="nav"></v-breadcrumb>
      <el-card :body-style="{ padding: '30px' }">
        <el-form :model="form" ref='form' inline>
          <el-form-item prop="no" label="订单号">
              <el-input v-model="form.no" placeholder="请输入订单号"></el-input>
          </el-form-item>
          <el-form-item prop="time" label="时间周期">
              <el-date-picker v-model="form.time" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>
          <el-form-item label=" ">
              <el-button type="primary" @click="getList(1)">查询</el-button>
              <el-button @click="resetForm('form')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <el-card style='margin-top:20px' :body-style="{ padding: '30px' }">
        <el-table v-loading="tableLoading" :data="table" border>
          <el-table-column type="index" :index='handleIndex' label="编号" align="center"></el-table-column>
          <el-table-column prop='order_num' label="订单号" align="center"></el-table-column>
          <el-table-column prop='calc_time' label="时间" align="center">
              <template slot-scope="scope">
                  {{scope.row.create_time | formatDate}}
              </template>
          </el-table-column>
          <el-table-column prop='balance' label="金额" align="center">
              <template slot-scope="scope">
                  <span style="color:red">{{scope.row.balance | handleMoney}}</span>
              </template>
          </el-table-column>
          <el-table-column prop='calc_type' label="来源" align="center">
              <template slot-scope="scope">
                <template v-if='scope.row.calc_type == 1'>店主</template>
                <template v-else-if='scope.row.calc_type == 2'>店员</template>
                <template v-else-if='scope.row.calc_type == 4'>直接</template>
                <template v-else-if='scope.row.calc_type == 8'>间接</template>
                <template v-else-if='scope.row.calc_type == 16'>助业金</template>
                <template v-else-if='scope.row.calc_type == 32'>自己</template>
                <template v-else>其他</template>
              </template>
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination
                  background
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="page.currentPage"
                  layout="total, prev, pager, next, jumper"
                  :total="page.totalPage">
          </el-pagination>
        </div>
      </el-card>
    </div>
</template>

<script>
import utils from '@/utils/index.js'
import * as api from '@/api/SettlementMange/index.js';
import * as pApi from '@/privilegeList/SettlementMange/index.js';
import vBreadcrumb from '@/components/common/Breadcrumb.vue';
import { myMixinTable } from '@/JS/commom';
export default {
  components: {vBreadcrumb},

  mixins:[myMixinTable],

  data () {
    return {
      title:'',
      tableLoading:false,
      nav:['结算管理'],
      // 表单
      form:{
        no:'',
        time:[]
      },
      url:'', // 请求地址
      status:'', // 16:助业金 64、128、256其他
      flag:'', // 1.无主 2.助业金 3.其他1 4. 其他2 5.其他3
      table:[], // 表格信息
    };
  },

  activated(){
    this.flag = this.$route.query.flag || sessionStorage.getItem('flag');
    // 置空
    this.form.no = '';
    this.form.time = [];
    this.status = '';
    switch (this.flag.toString()) {
      case '1':
          this.title = '无主账户资金收入明细';
          this.url = api.querySettlementRecordList;
          this.status = '';
          break;
      case '2':
          this.title = '助业金账户资金收入明细';
          this.url = api.querySettlementTotalList;
          this.status = '16';
          break;
      case '3':
          this.title = '其他1账户收入明细';
          this.url = api.querySettlementTotalList;
          this.status = '64';
          break;
      case '4':
          this.title = '其他2账户收入明细';
          this.url = api.querySettlementTotalList;
          this.status = '128';
          break;
      case '5':
          this.title = '其他3账户收入明细';
          this.url = api.querySettlementTotalList;
          this.status = '256';
          break;
    }
    this.nav = ['结算管理'];
    this.nav.push(this.title);
    this.getList(1);
  },

  methods: {
    // 查询表单
    getList(val){
        let data = {};
        data.orderNum = this.form.no;
        data.startTime = this.form.time.length == 0?'':utils.formatTime(this.form.time[0],1);
        data.createEndTime = this.form.time.length == 0?'':utils.formatTime(this.form.time[1],1);
        data.calcType = this.status;
        data.page = val;
        data.url = pApi.querySettlementRecordListByCalcType;
        this.page.currentPage = val;
        this.tableLoading = true;
        this.$axios.post(this.url,data).then(res=>{
            this.tableLoading = false;
            this.table = res.data.data.data;
            this.page.totalPage = res.data.data.resultCount;
        })
    },
    // 编号
    handleIndex(index){
        return index+1;
    },
    // 重置表单
    resetForm(formName){
        this.$refs[formName].resetFields();
        this.getList(1);
    },
  }
}

</script>
<style lang='less' scoped>
.flat-act-01{
  .block{margin: 10px 0 20px 0}
  .deposit-payment{
      text-align: center;
      font-size: 16px;
      line-height: 35px;
  }
}
</style>