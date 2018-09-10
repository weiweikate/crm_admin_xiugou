<template>
    <div class="witdrawal-audit">
        <v-breadcrumb :nav="['结算管理','提现审核']"></v-breadcrumb>
        <el-card :body-style="{ padding: '30px' }">
            <el-form :model="form" ref='form' inline>
                <el-form-item prop="applyPeople" label="申请人">
                    <el-input v-model="form.applyPeople" placeholder="请输入申请人"></el-input>
                </el-form-item>
                <el-form-item prop="withdraNo" label="提现编号">
                    <el-input v-model="form.withdraNo" placeholder="请输入申请人"></el-input>
                </el-form-item>
                <el-form-item prop="time" label="发起时间">
                    <el-date-picker v-model="form.time" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                </el-form-item>
                <el-form-item label=" ">
                    <el-button type="primary" @click="getList(1)">查询</el-button>
                    <el-button @click="resetForm('form')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card style='margin-top:20px' :body-style="{ padding: '30px'}">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="全部申请" name="1">
                    <v-tab v-if='activeName == "1"' :tableData='tableData' @updataData='updata'></v-tab>
                </el-tab-pane>
                <el-tab-pane label="待确认" name="2">
                    <v-tab v-if='activeName == "2"' :tableData='tableData' @updataData='updata'></v-tab>
                </el-tab-pane>
                <el-tab-pane label="已确认" name="3">
                    <v-tab v-if='activeName == "3"' :tableData='tableData' @updataData='updata'></v-tab>
                </el-tab-pane>
                <el-tab-pane label="已驳回" name="4">
                    <v-tab v-if='activeName == "4"' :tableData='tableData' @updataData='updata'></v-tab>
                </el-tab-pane>
            </el-tabs>
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
import vBreadcrumb from '@/components/common/Breadcrumb.vue';
import vTab from '@/components/page/SettlementMange/_common/withdrawalTab.vue'
import utils from '@/utils/index.js'
import * as api from '@/api/SettlementMange/index.js';
import * as pApi from '@/privilegeList/SettlementMange/index.js';
import { myMixinTable,queryDictonary } from '@/JS/commom';
export default {
  components: {vBreadcrumb,vTab},

  mixins:[myMixinTable,queryDictonary],

  data () {
    return {
        activeName:'1', // 选项卡当前名称
        // 表单
        form:{
            applyPeople:'', // 申请人
            withdraNo:'', // 提现编号
            time:[], // 发起时间
        },
        tableData:[],
    };
  },

  activated(){
      this.getList(this.page.currentPage);
  },

  methods: {
    //   tab 选项卡切换
    handleClick(tab) {
        this.activeName = tab.name;
        this.getList(1);
    },
    //  查询
    getList(val){
        let data = {};
        data.nickName = this.form.applyPeople;
        data.withdraNo = this.form.withdraNo;
        data.startTime = this.form.time.length == 0?'':utils.formatTime(this.form.time[0],1);
        data.endTime = this.form.time.length == 0?'':utils.formatTime(this.form.time[1],1);
        switch (this.activeName) {
            case '1':
                data.status = '';
                break;
            case '2':
                data.status = '0';
                break;
            case '3':
                data.status = '1';
                break;
            case '4':
                data.status = '2';
                break;
            default:
                break;
        }
        this.page.currentPage = val;
        data.page = val;
        data.url = pApi.queryWithdrawMoneyList;
        this.$axios.post(api.queryWithdrawMoneyList,data).then(res=>{
            this.tableData = [];
            this.page.totalPage = res.data.data.resultCount;
            this.tableData = res.data.data.data;
        })
    },
    // 重置表单
    resetForm(formName){
        this.$refs[formName].resetFields();
        this.getList(1);
    },
    // 获取子组件数据
    updata(val){
        this.getList(this.page.currentPage)
    }
  }
}

</script>
<style lang='less' scoped>
.witdrawal-audit{
    .block{margin: 10px 0 20px 0}
}
</style>
