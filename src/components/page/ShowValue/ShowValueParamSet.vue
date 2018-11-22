<template>
    <div class="show-value-param-set">
        <v-breadcrumb :nav="nav"></v-breadcrumb>
        <el-card v-loading="bodyLoading">
            <div class="param-title">秀值参数设置</div>
            <p class="tip">实际领取秀值金，现金与秀豆的分配比例</p>
            <div class="ratio-set">
                <p>秀豆比例</p>
                <el-input-number :min="0" :max="100" :controls="false" class="inp" @input="computedBeanRation" v-model="beanRatio"></el-input-number>
                <span>%</span>
            </div>
            <div class="ratio-set">
                <p>现金比例</p>
                <el-input-number :min="0" :max="100" :controls="false" disabled class="inp" v-model="cashRatio"></el-input-number>
                <span>%</span>
            </div>
            <div style="clear: both"></div>
            <p class="tip">现金兑换秀豆规则</p>
            <div class="ratio-set">
                <el-input-number :min="0" :controls="false" disabled class="inp" v-model="bean"></el-input-number>
                <span>秀豆 = </span>
            </div>
            <div class="ratio-set">
                <el-input-number :min="0" :controls="false" disabled class="inp" v-model="money"></el-input-number>
                <span>元</span>
            </div>
            <div style="clear: both"></div>
            <el-button :loading="btnLoading" @click="submitForm" style="margin: 20px 50px" type="primary">提 交</el-button>
        </el-card>
    </div>
</template>

<script>
import vBreadcrumb from '@/components/common/Breadcrumb.vue';
import request from '@/http/http';
export default {
    data() {
        return {
            nav: ['秀值模块', '秀值分配比例设置'],
            cashRatio: '', // 现金比例
            beanRatio: '', // 秀豆比例
            bean: '', // 秀豆
            money: 0.01,
            bodyLoading: false,
            btnLoading: false
        };
    },
    components: { vBreadcrumb },
    activated() {
        this.getInfo();
    },
    methods: {
        computedBeanRation() {
            this.cashRatio = 100 - this.beanRatio;
        },
        // 获取数据
        getInfo() {
            const data = {
                codes: 'bean_ratio,bean_to_cash'
            };
            this.bodyLoading = true;
            request.queryConfig(data).then(res => {
                this.beanRatio = res.data[0].value;
                this.bean = res.data[1].value;
                this.bodyLoading = false;
            }).catch(err => {
                this.bodyLoading = false;
                console.log(err);
            });
        },
        //   提交表单
        submitForm() {
            const data = {
                configVOS: [
                    {
                        code: 'bean_ratio',
                        value: this.beanRatio,
                        value_type: 1,
                        status: 1
                    },
                    {
                        code: 'bean_to_cash',
                        value: this.bean,
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
        }
    }
};
</script>

<style lang="less" scoped>
.show-value-param-set{
    .param-title{
        background-color: #f7f7f7;
        height: 60px;
        width: 100%;
        line-height: 60px;
        font-weight: 700;
        padding: 0 20px;
        box-sizing: border-box;
        font-size: 18px;
    }
    .tip{
        padding: 50px 0 30px 20px;
        font-size: 14px;
        font-weight: 700;
    }
    .ratio-set{
        padding-left: 20px;
        font-size: 14px;
        width: 200px;
        float: left;
        & .inp {
            width: 150px;
            margin-top: 5px;
        }
    }
}
</style>
