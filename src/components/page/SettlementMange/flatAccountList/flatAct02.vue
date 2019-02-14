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
        <mr-flying parentClass="content-box">
            <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page.currentPage"
                :page-size="page.pageSize"
                layout="total, prev, pager, next, jumper"
                :total="page.totalPage">
            </el-pagination>
        </mr-flying>
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
          <el-table-column prop='storeName' label="店铺名称" align="center">
              <template slot-scope="scope">
                  {{scope.row.storeName || '/'}}
              </template>
          </el-table-column>
          <el-table-column prop='sourceDesc' label="来源" align="center"></el-table-column>
          <el-table-column prop='userName' label="受益人" align="center"></el-table-column>
        </el-table>
      </el-card>
    </div>
</template>

<script>
import utils from '@/utils/index.js';
import vBreadcrumb from '@/components/common/Breadcrumb.vue';
import request from '@/http/http';
import { myMixinTable } from '@/JS/commom';
export default {
    components: { vBreadcrumb },

    mixins: [myMixinTable],

    data() {
        return {
            title: '',
            loading: false,
            nav: ['结算管理'],
            // 表单
            form: {
                orderNum: '',
                time: []
            },
            flag: '', // 5.店主 6.店员 7.直接上级 9. 间接上级 10.用户账户
            tableData: [] // 表格信息
        };
    },

    activated() {
        this.flag = this.$route.query.accountInfoFlag1 || sessionStorage.getItem('accountInfoFlag1');
        switch (this.flag.toString()) {
            case '5':
                this.title = '店主账户收入明细';
                break;
            case '6':
                this.title = '店员账户收入明细';
                break;
            case '7':
                this.title = '直接上级（销售提成）账户收支明细';
                break;
            case '9':
                this.title = '间接上级（推广提成）账户收支明细';
                break;
            case '10':
                this.title = '用户账户（自己）账户收支明细';
                break;
        }
        this.form.orderNum = '';
        this.form.time = [];
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
            request.queryFlatAccountByType(data).then(res => {
                this.loading = false;
                const resData = res.data || {};
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
