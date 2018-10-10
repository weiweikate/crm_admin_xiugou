<template>
    <div class="withdrawal-charge">
        <v-breadcrumb :nav="['基础参数设置','提现手续费设置']"></v-breadcrumb>
        <el-card :body-style="{ padding: '30px' }" v-loading="pageLoading">
            <div class="charge-title">提现手续费设置</div>
            <p class="with-charge-p">
                <span>提现手续费比例</span>
                <el-input-number :min="0" :controls="false" v-model="charge" style="width:150px" placeholder="请输入数值"></el-input-number> %
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
                <el-input-number :min="0" :controls="false" v-model="minBalance" style="width:150px" placeholder="请输入数值"></el-input-number>　元
            </p>
            <p class="with-charge-p">
                <el-button :loading="btnLoading" @click="submitForm" type="primary">确认保存</el-button>
                <el-button @click="cancle">取消</el-button>
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
        this.getList();
        // this.getUserLevel();
    },

    methods: {
        /**
         * @Description: 获取经销商层级
         * @author wuchengji
         * @date 2018-9-7
        */
        getUserLevel() {

        },
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
                codes: 'service_charge,min_balance'
            };
            request.queryConfig(data).then(res => {
                this.pageLoading = false;
                this.charge = res.data[0].value;
                this.minBalance = res.data[1].value;
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
            const data = {
                configVOS: [
                    {
                        code: 'service_charge',
                        name: '手续费',
                        value: this.charge,
                        value_type: 1,
                        status: 1
                    },
                    {
                        code: 'min_balance',
                        name: '最低提现金额',
                        value: this.minBalance,
                        value_type: 1,
                        status: 1
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
