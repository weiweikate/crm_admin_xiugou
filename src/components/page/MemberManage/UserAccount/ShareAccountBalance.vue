<template>
    <div class="shareboun-account">
        <breadcrumb :nav='["经销商会员管理","会员管理","会员详情","TA的账户","收益账户支出明细"]'></breadcrumb>
        <el-card :body-style="{ padding: '30px' }">
            <el-form :model="form" ref='form' inline>
                <el-form-item prop="no" label="编号">
                    <el-input v-model="form.no" placeholder="请输入编号"></el-input>
                </el-form-item>
                <el-form-item prop="orderNum" label="订单号">
                    <el-input v-model="form.orderNum" placeholder="请输入订单号"></el-input>
                </el-form-item>
                <el-form-item prop="finishTime" label="完成时间">
                    <el-date-picker v-model="form.finishTime" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                </el-form-item>
                <el-form-item prop="no" label=" ">
                    <el-button @click="getList(1)" type="primary">提交</el-button>
                    <el-button @click="resetForm('form')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card :body-style="{ padding: '30px' }" style='margin-top:10px'>
            <p style="font-size:14px;color:#ff6868">{{name}}的待提现账户</p>
            <el-button @click="toggleStatus(1)" style="margin:10px 0" :type="status==1?'primary':''">收入</el-button>
            <el-button @click="toggleStatus(2)" style="margin:10px 0" :type="status==2 || status==3?'primary':''">支出</el-button><br/>
            <el-button v-show='status != 1' @click="toggleStatus(2)" style="margin:10px 0" :type="status==2?'success':''">交易提成</el-button>
            <el-button v-show='status != 1' @click="toggleStatus(3)" style="margin:10px 0" :type="status==3?'success':''">店铺提成</el-button>
            <!-- 收入 -->
            <el-table v-show='status == 1' :data="tableData" border v-loading="tableLoading">
                <el-table-column prop="id" label="编号" align="center"></el-table-column>
                <el-table-column prop="order_num" label="订单编号" align="center"></el-table-column>
                <el-table-column prop="balance" label="收入金额" align="center">
                    <template slot-scope="scope" v-if='scope.row.balance'>
                        {{`+${scope.row.balance}`}}
                    </template>
                </el-table-column>
                <el-table-column prop="token_coin" label="收入代币（枚）" align="center">
                    <template slot-scope="scope" v-if='scope.row.token_coin'>
                        {{`+${scope.row.token_coin}`}}
                    </template>
                </el-table-column>
                <el-table-column prop="calc_type" label="交易方式" align="center">
                    <template slot-scope="scope">
                        <template v-if='scope.row.calc_type == 1'>店主分红</template>
                        <template v-else-if='scope.row.calc_type == 2'>店铺分红</template>
                        <template v-else-if='scope.row.calc_type == 4'>销售提成</template>
                        <template v-else-if='scope.row.calc_type == 8'>推广提成</template>
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="时间" align="center">
                    <template slot-scope="scope" v-id='scope.row.create_time'>
                        {{scope.row.create_time | formatDate}}
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="备注" align="center"></el-table-column>
            </el-table>
            <!-- 支出交易提成 -->
            <el-table v-show='status == 2' :data="tableData" border v-loading="tableLoading">
                <el-table-column prop="id" label="编号" align="center"></el-table-column>
                <el-table-column prop="order_num" label="订单编号" align="center"></el-table-column>
                <el-table-column prop="balance" label="收入金额" align="center">
                    <template slot-scope="scope" v-if='scope.row.balance'>
                        {{`-${scope.row.balance}`}}
                    </template>
                </el-table-column>
                <el-table-column prop="token_coin" label="收入代币（枚）" align="center">
                    <template slot-scope="scope" v-if='scope.row.token_coin'>
                        {{`-${scope.row.token_coin}`}}
                    </template>
                </el-table-column>
                <el-table-column prop="calc_type" label="交易方式" align="center">
                    <template slot-scope="scope">
                        <template v-if='scope.row.calc_type == 1'>店主分红</template>
                        <template v-else-if='scope.row.calc_type == 2'>店铺分红</template>
                        <template v-else-if='scope.row.calc_type == 4'>销售提成</template>
                        <template v-else-if='scope.row.calc_type == 8'>推广提成</template>
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="时间" align="center">
                    <template slot-scope="scope" v-id='scope.row.create_time'>
                        {{scope.row.create_time | formatDate}}
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="备注" align="center"></el-table-column>
            </el-table>
            <!-- 支出店铺提成 -->
            <el-table v-show='status == 3' :data="tableData" border v-loading="tableLoading">
                <el-table-column prop="serial_no" label="编号" align="center"></el-table-column>
                <el-table-column prop="order_num" label="订单编号" align="center"></el-table-column>
                <el-table-column prop="balance" label="支出金额" align="center">
                    <template slot-scope="scope" >
                        {{`-${scope.row.balance}`}}
                    </template>
                </el-table-column>
                <el-table-column prop="token_coin" label="赠送代币（枚）" align="center">
                    <template slot-scope="scope">
                        {{`-${scope.row.token_coin}`}}
                    </template>
                </el-table-column>
                <el-table-column label="交易方式" align="center">
                    <template slot-scope="scope">
                        待提现账户提现
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="时间" align="center">
                    <template slot-scope="scope" v-id='scope.row.create_time'>
                        {{scope.row.create_time | formatDate}}
                    </template>
                </el-table-column>
                <el-table-column prop="type" label="备注" align="center">
                    <template slot-scope="scope">
                        <template v-if='scope.row.type == 1'>金币转换</template>
                        <template v-if='scope.row.type == 2'>代币转换</template>
                    </template>
                </el-table-column>
            </el-table>
            <div class="block">
                <el-pagination
                        background
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
import breadcrumb from '@/components/common/Breadcrumb'
import * as api from '@/api/api.js';
import utils from '@/utils/index.js';
import {myMixinTable} from '@/JS/commom'
export default {
components: {breadcrumb},

mixins:[myMixinTable],

data () {
    return {
        // 人员id
        memberId:'',
        // form表单
        form:{
            no:'',
            orderNum:'',
            finishTime:[],
        },
        // 表格信息
        tableData:[],
        name:'', // 姓名
        status:'1', // 1：收入 2：支出交易提成 3：交易店铺提成
        tableLoading:false,
        // 接口地址
        url:'',
    };
},

activated(){
    this.memberId = this.$route.query.memberInfo.memberId || sessionStorage.getItem('memberInfo').memberId;
    this.name = this.$route.query.memberInfo.nickname || sessionStorage.getItem('memberInfo').nickname;
    if(this.status == 1){
        this.url = api.queySettlementTotalListByProfit;
    }else if(this.status == 2){
        this.url = api.queySettlementTotalListByProfit;
    }else{
        this.url = api.queyDetailTokenCoinListByProfit;
    }
    this.getList(this.page.currentPage);
},

methods: {
    //   提交表单
    getList(val){
        let data = {};
        data.dealerId = this.memberId;
        data.page = val;
        data.pageSize = 10;
        data.id = this.form.no;
        data.orderNum = this.form.orderNum;
        data.startTime = this.form.finishTime.length==0?'':utils.formatTime(this.form.finishTime[0],1);
        data.createEndTime = this.form.finishTime.length==0?'':utils.formatTime(this.form.finishTime[1],1);
        this.page.currentPage = val;
        this.tableLoading = true;
        this.$axios.post(this.url,data).then(res=>{
            this.tableData = [];
            this.tableData = res.data.data.data;
            this.page.totalPage = res.data.data.resultCount;
            this.tableLoading = false;
        }).catch(err=>{
            this.tableLoading = false;
        })
    },
    //   重置表单
    resetForm(formName){
        this.$refs[formName].resetFields();
        this.getList(1);
    },
    // 编号
    handleIndex(val){
        return val+1;
    },
    // 切换支出收入
    toggleStatus(val){
        this.status = val;
        this.tableData = [];
        this.form.no = '';
        this.form.orderNum = '';
        this.form.finishTime = [];
        if(val == 1){
            this.url = api.queySettlementTotalListByProfit;
        }else if(val == 2){
            this.url = api.queySettlementTotalListByProfit;
        }else{
            this.url = api.queyDetailTokenCoinListByProfit;
        }
        this.getList(1);
    },
}
}

</script>
<style lang='less' scoped>
.shareboun-account{
    .block{
        margin: 10px 0;
    }
    .boun-btn{
        margin: 10px 0;
    }
}
</style>