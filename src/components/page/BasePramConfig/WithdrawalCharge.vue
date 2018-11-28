<template>
    <div class="withdrawal-charge">
        <v-breadcrumb :nav="['基础参数设置','提现手续费设置']"></v-breadcrumb>
        <el-card :body-style="{ padding: '30px' }" v-loading="pageLoading">
            <div class="charge-title">提现手续费设置</div>
            <p class="with-charge-p">
                <el-radio v-model="withSet" label="minBalance" >设置起始提现金额</el-radio>
                <el-input v-model="minBalance" :disabled="withSet !== 'minBalance'" style="width:150px" placeholder="请输入数值"></el-input>　元　
                <span style="color: #ccc">注：填写数值0-100，只可填写数字</span>
            </p>
            <p class="with-charge-p">
                <el-radio v-model="withSet" label="charge" >提现金额低于</el-radio>
                <el-input v-model="less" :disabled="withSet !== 'charge'" style="width:150px" placeholder="请输入数值"></el-input>　元，收取提现费用
                <el-input v-model="withCharge" :disabled="withSet !== 'charge'" style="width:150px" placeholder="请输入数值"></el-input>　元　
                <span style="color: #ccc">注：高于则不收提现手续费</span>
            </p>
            <div class="charge-title">提现设置</div>
            <p class="with-charge-p">
                <el-checkbox v-model="isSelectWithCharge" @change="isSelectWithCharge?'':charge = '0'">提现手续费比例</el-checkbox>
                <el-input :disabled="!isSelectWithCharge" v-model="charge" style="width:150px" placeholder="请输入数值"></el-input> %　
                <span style="color: #ccc">注：填写数值0-100，只可填写数字</span>
            </p>
            <p class="with-charge-p">
                <el-button :loading="btnLoading" @click="submitForm" type="primary">确认保存</el-button>
            </p>
        </el-card>
    </div>
</template>

<script>
import vBreadcrumb from '@/components/common/Breadcrumb.vue';
import request from '@/http/http';
export default {
    components: { vBreadcrumb },

    data() {
        return {
            btnLoading: false,
            pageLoading: false,
            charge: '', // 提现手续费
            isSelectWithCharge: false,
            withSet: 'minBalance',
            minBalance: '', // 提现金额
            less: '',
            withCharge: '',
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
        this.getList();
    },

    methods: {
        /**
         * @Description: 数据回显
         * @param:
         * @return:
         * @author wuchengji
         * @date 2018/10/10
        */
        getList() {
            this.pageLoading = true;
            const data = {
                codes: 'service_charge,min_balance,when_less_than_balance,case_service_charge'
            };
            request.queryConfig(data).then(res => {
                this.pageLoading = false;
                res.data.forEach(v => {
                    if (v.code == 'service_charge') {
                        this.charge = v.value;
                        this.isSelectWithCharge = v.status == 1;
                    } else if (v.code == 'min_balance') {
                        this.minBalance = v.value;
                        if (v.status == 1) {
                            this.withSet = 'minBalance';
                        }
                    } else if (v.code == 'when_less_than_balance') {
                        this.less = v.value;
                        if (v.status == 1) {
                            this.withSet = 'charge';
                        }
                    } else if (v.code == 'case_service_charge') {
                        if (v.status == 1) {
                            this.withSet = 'charge';
                        }
                        this.withCharge = v.value;
                    }
                });
                this.bodyLoading = false;
            }).catch(err => {
                this.pageLoading = false;
                console.log(err);
            });
        },
        /**
         * @Description: 提交表单
         * @param:
         * @return:
         * @author wuchengji
         * @date 2018/10/10
        */
        submitForm() {
            if (this.charge < 0 || this.charge > 100 || this.charge.length > 9) return this.$message.warning('请输入正确提现手续费比例');
            if (this.minBalance < 0 || this.minBalance > 100 || this.minBalance.length > 9) return this.$message.warning('请输入正确起始提现金额');
            const data = {
                configVOS: [
                    {
                        code: 'service_charge',
                        name: '手续费',
                        value: this.charge,
                        value_type: 1,
                        status: this.isSelectWithCharge ? 1 : 0
                    },
                    {
                        code: 'min_balance',
                        name: '最低提现金额',
                        value: this.minBalance,
                        value_type: 1,
                        status: this.withSet == 'minBalance' ? 1 : 0
                    },
                    {
                        code: 'when_less_than_balance',
                        name: '提现金额低于条件',
                        value: this.less,
                        value_type: 1,
                        status: this.withSet == 'charge' ? 1 : 0
                    },
                    {
                        code: 'case_service_charge',
                        name: '满足条件时收取提现费用',
                        value: this.withCharge,
                        value_type: 1,
                        status: this.withSet == 'charge' ? 1 : 0
                    }
                ]
            };
            this.btnLoading = true;
            request.addOrModifyList(data).then(res => {
                this.$message.success(res.msg);
                this.btnLoading = false;
            }).catch(err => {
                console.log(err);
                this.btnLoading = false;
            });
        },
        // 取消
        cancle() {
            this.getList();
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
