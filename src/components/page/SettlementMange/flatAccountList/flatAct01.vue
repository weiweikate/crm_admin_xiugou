<template>
    <div class="flat-act-01">
      <v-breadcrumb :nav="nav"></v-breadcrumb>
      <el-card :body-style="{ padding: '30px' }">
        <el-form :model="form" ref='form' @submit.native.prevent inline>
          <el-form-item prop="orderNum" label="订单号">
              <el-input v-model="form.orderNum" placeholder="请输入订单号"></el-input>
          </el-form-item>
          <el-form-item prop="time" label="时间周期">
              <el-date-picker v-model="form.time" type="datetimerange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>
          <el-form-item label=" ">
              <el-button native-type="submit" type="primary" @click="getList(1)">查询</el-button>
              <el-button @click="resetForm('form')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <el-card style='margin-top:20px' :body-style="{ padding: '30px' }">
        <el-table v-loading="loading" :data="tableData" border stripe>
          <el-table-column type="index" :index='handleIndex' label="编号" align="center"></el-table-column>
          <el-table-column prop='orderNum' label="订单号" align="center"></el-table-column>
          <el-table-column prop='settleTime' label="时间" align="center">
              <template slot-scope="scope" v-if='scope.row.settleTime'>
                  {{scope.row.settleTime | formatDateAll}}
              </template>
          </el-table-column>
          <el-table-column prop='amount' label="金额" align="center">
              <template slot-scope="scope">
                  <span style="color:red">{{scope.row.amount | handleMoney}}</span>
              </template>
          </el-table-column>
          <el-table-column prop='sourceDesc' label="来源" align="center"></el-table-column>
        </el-table>
        <div class="block">
          <el-pagination
                  background
                  :page-size="page.pageSize"
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
import utils from '@/utils/index.js';
import vBreadcrumb from '@/components/common/Breadcrumb.vue';
import { myMixinTable } from '@/JS/commom';
import request from '@/http/http';
export default {
    components: { vBreadcrumb },

    mixins: [myMixinTable],

    data() {
        return {
            title: '',
            nav: ['结算管理'],
            // 表单
            form: {
                orderNum: '',
                time: []
            },
            loading: false,
            flag: '', // 1.无主 2.助业金 8.其他1 3. 其他2 4.其他3
            tableData: [] // 表格信息
        };
    },

    activated() {
        this.flag = this.$route.query.accountInfoFlag || sessionStorage.getItem('accountInfoFlag');
        // 置空
        this.form.orderNum = '';
        this.form.time = [];
        this.status = '';
        switch (this.flag.toString()) {
            case '1':
                this.title = '无主账户资金收入明细';
                break;
            case '2':
                this.title = '助业金账户资金收入明细';
                break;
            case '8':
                this.title = '其他1账户收入明细';
                break;
            case '3':
                this.title = '其他2账户收入明细';
                break;
            case '4':
                this.title = '其他3账户收入明细';
                break;
        }
        this.nav = ['结算管理'];
        this.nav.push(this.title);
        this.getList(1);
    },

    methods: {
        // 查询表单
        getList(val) {
            const data = {
                ...this.form,
                beginTime: this.form.time.length === 0 ? '' : utils.formatTime(this.form.time[0]),
                endTime: this.form.time.length === 0 ? '' : utils.formatTime(this.form.time[1]),
                type: this.flag,
                page: val,
                pageSize: this.page.pageSize
            };
            this.loading = true;
            request.queryFlatAccountByType(this.$utils.trimForm(data)).then(res => {
                const resData = res.data || {};
                this.loading = false;
                this.tableData = resData.data || [];
                this.page.totalPage = resData.totalNum || 0;
                this.page.currentPage = resData.currentPage || 0;
            }).catch(err => {
                this.loading = false;
                console.log(err);
            });
        },
        // 编号
        handleIndex(index) {
            return index + 1;
        },
        // 重置表单
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.getList(1);
        }
    }
};

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
