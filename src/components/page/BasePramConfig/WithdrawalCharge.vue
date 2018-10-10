<template>
    <div class="withdrawal-charge">
        <v-breadcrumb :nav="['结算管理','提现手续费设置']"></v-breadcrumb>
        <el-card :body-style="{ padding: '30px' }" v-loading="pageLoading">
            <div class="charge-title">提现手续费</div>
            <p class="with-charge-p">
                <span>提现手续费</span>
                <el-input v-model="charge" style="width:150px" placeholder="请输入数值"></el-input> %
            </p>
            <div class="charge-title">提现频率设置</div>
            <p v-for="(value,key) in levelList" :key="key" class="with-charge-p">
                <span>{{value.name}}用户</span>
                <el-select v-model="value.times">
                    <el-option v-for="(v,k) in dateList" :key="k" :label="v.label" :value='v.value'></el-option>
                </el-select>
                <span>　可提现　</span>
                <el-input v-model="value.num" style="width:150px" placeholder="请输入数值"></el-input>　次
            </p>
            <p class="with-charge-p">
                <span>设置提现金额　</span>
                <el-input v-model="minBalance" style="width:150px" placeholder="请输入数值"></el-input>　元
            </p>
            <p class="with-charge-p">
                <el-button :loading="btnLoading" @click="submitForm" type="primary">确认保存</el-button>
                <el-button>取消</el-button>
            </p>
        </el-card>
    </div>
</template>

<script>
import * as api from '@/api/SettlementMange/index.js';
import * as capi from '@/api/api.js';
import vBreadcrumb from '../../common/Breadcrumb.vue';
import * as pApi from '@/privilegeList/SettlementMange/index.js';
export default {
    components: { vBreadcrumb },

    data() {
        return {
            btnLoading: false,
            pageLoading: false,
            charge: '', // 提现手续费
            minBalance: '', // 提现金额
            // 日期类型
            dateList: [
                { label: '不限制', value: '' },
                { label: '天', value: '1' },
                { label: '周', value: '2' },
                { label: '月', value: '3' }
            ],
            // 经销商层级列表
            levelList: []
        };
    },

    activated() {
        this.getUserLevel();
    },

    methods: {
        /**
         * @Description: 获取经销商层级
         * @author wuchengji
         * @date 2018-9-7
        */
        getUserLevel() {
            this.$axios.post(capi.getDealerLevelList, {}).then(res => {
                res.data.data.forEach(v => {
                    this.levelList.push({ name: v.name, times: '', num: '' });
                });
                this.getList();
            }).catch(err => {
                console.log(err);
            });
        },
        //  获取数据
        getList() {
            this.pageLoading = true;
            this.$axios.post(api.queryWithdrawConfig, {}).then(res => {
                this.charge = res.data.data.config.serviceCharge;
                this.minBalance = res.data.data.config.minBalance;
                this.pageLoading = false;
            }).catch(err => {
                this.pageLoading = false;
            });
        },
        // 提交表单
        submitForm() {
            const data = {};
            this.btnLoading = true;
            data.serviceCharge = this.charge;
            data.minBalance = this.minBalance;
            data.url = pApi.updateWithdrawConfig;
            this.$axios.post(api.updateWithdrawConfig, data).then(res => {
                this.$message.success(res.data.msg);
                this.btnLoading = false;
            }).catch(err => {
                this.btnLoading = false;
            });
        }
    }
};

</script>
<style lang='less' scoped>
.withdrawal-charge{
    .charge-title{
        width: 100%;
        height: 60px;
        line-height: 60px;
        background-color: #f7f7f7;
        padding: 0 20px;
        box-sizing: border-box;
        margin: 20px 0;
    }
    .with-charge-p{
        font-size: 14px;
        padding: 10px 30px;
        box-sizing: border-box;
    }
}
</style>
