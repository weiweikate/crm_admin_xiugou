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
              <template slot-scope="scope" v-if='scope.row.calc_time'>
                  {{scope.row.calc_time | formatDate}}
              </template>
          </el-table-column>
          <el-table-column prop='balance' label="金额" align="center">
              <template slot-scope="scope">
                  <span style="color:red">{{scope.row.balance | handleMoney}}</span>
              </template>
          </el-table-column>
          <el-table-column prop='name' label="店铺名称" align="center">
              <template slot-scope="scope">
                  {{scope.row.name || '/'}}
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
          <el-table-column prop='nickname' label="受益人" align="center"></el-table-column>
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
import vBreadcrumb from '@/components/common/Breadcrumb.vue';
import * as pApi from '@/privilegeList/SettlementMange/index.js';
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
      status:'', // 1.店主 2.店员 4.直接 8.间接 32.自己
      flag:'', // 1.店主 2.店员 3.直接上级 4. 间接上级 5.用户账户
      table:[], // 表格信息
    };
  },

  activated(){
    this.flag = this.$route.query.flag1 || sessionStorage.getItem('flag1');
    switch (this.flag.toString()) {
      case '1':
          this.title = '店主账户收入明细';
          this.url = api.querySettlementRecordListByCalcType;
          this.status = '1';
          break;
      case '2':
          this.title = '店员账户收入明细';
          this.url = api.querySettlementRecordListByCalcType;
          this.status = '2';
          break;
      case '3':
          this.title = '直接上级（销售提成）账户收支明细';
          this.url = api.querySettlementRecordListByCalcType;
          this.status = '4';
          break;
      case '4':
          this.title = '间接上级（推广提成）账户收支明细';
          this.url = api.querySettlementRecordListByCalcType;
          this.status = '8';
          break;
      case '5':
          this.title = '用户账户（自己）账户收支明细';
          this.url = api.querySettlementRecordListByCalcType;
          this.status = '32';
          break;
    }
    this.form.no = '';
    this.form.time = [];
    this.nav = ['结算管理'];
    this.nav.push(this.title);
    this.getList(1);
  },

  methods: {
    // 查询表单
    getList(val){
        this.tableLoading = true;
        let data = {};
        data.orderNum = this.form.no;
        data.startTime = this.form.time.length == 0?'':utils.formatTime(this.form.time[0],1);
        data.createEndTime = this.form.time.length == 0?'':utils.formatTime(this.form.time[1],1);
        data.calcType = this.status;
        data.page = val;
        data.url = pApi.querySettlementRecordListByCalcType;
        this.page.currentPage = val;
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