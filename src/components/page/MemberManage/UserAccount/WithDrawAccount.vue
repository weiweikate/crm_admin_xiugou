<template>
    <div class="withdraw-account">
        <breadcrumb :nav='["经销商会员管理","会员管理","会员详情","TA的账户","待提现账户明细"]'></breadcrumb>
        <el-card :body-style="{ padding: '30px' }">
            <el-form :model="form" ref='form' inline>
                <el-form-item prop="no" label="编号">
                    <el-input v-model="form.no" placeholder="请输入编号"></el-input>
                </el-form-item>
                <el-form-item v-if='status == 1' prop="orderNum" label="订单号">
                    <el-input v-model="form.orderNum" placeholder="请输入订单号"></el-input>
                </el-form-item>
                <el-form-item prop="finishTime" label="完成时间">
                    <el-date-picker v-model="form.finishTime" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                </el-form-item>
                <el-form-item v-if='status == 1' prop="status" label="金额状态">
                    <el-select v-model="form.status" placeholder="请选择金额状态">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="可提现" value="1"></el-option>
                        <el-option label="冻结中" value="2"></el-option>
                    </el-select>
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
            <el-button @click="toggleStatus(2)" style="margin:10px 0" :type="status==2?'primary':''">支出</el-button>
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
                        <template v-if='scope.row.calc_type == 4'>销售提成</template>
                        <template v-if='scope.row.calc_type == 8'>推广提成</template>
                    </template>
                </el-table-column>
                <el-table-column prop="calc_time" label="完成时间" align="center">
                    <template slot-scope="scope" v-id='scope.row.calc_time'>
                        {{scope.row.calc_time | formatDate}}
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="买家层级" align="center"></el-table-column>
                <el-table-column prop="status" label="金额状态" align="center">
                    <template slot-scope="scope">
                        <template v-if='scope.row.status == 1'>待结算</template>
                        <template v-else-if='scope.row.status == 2'>冻结</template>
                        <template v-else-if='scope.row.status == 3'>完成</template>
                        <template v-else-if='scope.row.status == 4'>隐藏</template>
                    </template>
                </el-table-column>
                <el-table-column label="备注" align="center">
                    <template slot-scope="scope">
                        <span style="color:red" v-if='scope.row.status == 2'>层级受限</span>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 支出 -->
            <el-table v-show='status == 2' :data="tableData" border v-loading="tableLoading">
                <el-table-column prop="id" label="编号" align="center"></el-table-column>
                <el-table-column prop="balance" label="支出金额" align="center">
                    <template slot-scope="scope" v-if='scope.row.balance'>
                        {{`-${scope.row.balance}`}}
                    </template>
                </el-table-column>
                <el-table-column prop="token_coin" label="支出代币（枚）" align="center">
                    <template slot-scope="scope" v-if='scope.row.token_coin'>
                        {{`-${scope.row.token_coin}`}}
                    </template>
                </el-table-column>
                <el-table-column prop="calc_type" label="交易方式" align="center">
                    <template slot-scope="scope">
                        <template v-if='scope.row.calc_type == 4'>销售提成</template>
                        <template v-if='scope.row.calc_type == 8'>推广提成</template>
                    </template>
                </el-table-column>
                <el-table-column prop="calc_time" label="完成时间" align="center">
                    <template slot-scope="scope" v-id='scope.row.calc_time'>
                        {{scope.row.calc_time | formatDate}}
                    </template>
                </el-table-column>
                <el-table-column label="备注" align="center">
                    <template slot-scope="scope">
                        <template v-if='scope.row.status == 2'>层级受限</template>
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
import breadcrumb from '@/components/common/Breadcrumb'
import * as api from '@/api/api.js';
import { myMixinTable } from '@/JS/commom.js';
import utils from '@/utils/index.js';
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
            status:''
        },
        // 表格信息
        tableData:[],
        name:'', // 姓名
        status:'1', // 1：收入 2：支出
        tableLoading:false,
        // 接口地址
        url:'',
    };
},

activated(){
    this.memberId = this.$route.query.memberInfo.memberId || sessionStorage.getItem('memberInfo').memberId;
    this.name = this.$route.query.memberInfo.nickname || sessionStorage.getItem('memberInfo').nickname;
    if(this.status == 1){
        this.url = api.queySettlementTotalListByIncome;
    }else{
        this.url = api.queySettlementTotalListByExpenditure;
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
        data.status = this.form.status;
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
        this.form.finishTime = [];
        this.form.status = '';
        if(val == 1){
            this.url = api.queySettlementTotalListByIncome;
        }else{
            this.url = api.queySettlementTotalListByExpenditure;
        }
        this.getList(1);
    }
}
}

</script>
<style lang='less' scoped>
.withdraw-account{
    .block{
        margin: 10px 0;
    }
}
</style>