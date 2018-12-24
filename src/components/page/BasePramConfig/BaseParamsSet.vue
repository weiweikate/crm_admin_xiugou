<template>
    <div class="base-params">
        <v-breadcrumb :nav="nav"></v-breadcrumb>
        <el-card v-loading="bodyLoading" :body-style="{ padding: '20px 40px',minHeight:'60vh' }">
            <div class="currency-title">参数设置</div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" size='mini' class="mt10">
                <el-form-item label="活动订单关闭时间" prop="activityOrderCancelTime">
                    <el-input v-model.number="ruleForm.activityOrderCancelTime" class="input-sty"></el-input><span class="point">分钟</span>
                </el-form-item>
                <el-form-item label="普通订单关闭时间" prop="orderCancleTime">
                    <el-input v-model.number="ruleForm.orderCancleTime" class="input-sty"></el-input><span class="point">小时</span>
                </el-form-item>
                <el-form-item label="订单完成超时时间" prop="goodsConfirmTime">
                    <el-input v-model.number="ruleForm.goodsConfirmTime" class="input-sty"></el-input><span class="point">天</span>
                </el-form-item>
                <el-form-item label="评价超时时间" prop="evaluationCancleTime">
                    <el-input v-model.number="ruleForm.evaluationCancleTime" class="input-sty"></el-input><span class="point">天</span>
                </el-form-item>
                <el-form-item label="售后回寄超时时间" prop="expressSendTime">
                    <el-input v-model.number="ruleForm.expressSendTime" class="input-sty"></el-input><span class="point">天</span>
                </el-form-item>
                <el-form-item label="售后申请次数" prop="afterSaleTimes">
                    <el-input v-model.number="ruleForm.afterSaleTimes" class="input-sty"></el-input><span class="point">次</span>
                </el-form-item>
                <el-form-item label="售后关闭时间" prop="afterSaleCancleTime">
                    <el-input v-model.number="ruleForm.afterSaleCancleTime" class="input-sty"></el-input><span class="point">天</span>
                </el-form-item>
                <el-form-item>
                    <el-button :loading="btnLoading" type="primary" @click="submitForm('ruleForm')">确认提交</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
import vBreadcrumb from '@/components/common/Breadcrumb.vue';
import request from '@/http/http';
import { regExpConfig } from '@/utils/regConfig';
export default {
    components: { vBreadcrumb },
    data() {
        const commonCheckReg = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('选项不能为空'));
            }
            setTimeout(() => {
                if (!Number.isInteger(value)) {
                    callback(new Error('请输入数字值'));
                } else {
                    callback();
                }
            }, 1000);
        };
        const checkoutDays = (rule, value, callback) => {
            if (!regExpConfig.regNum1_4.test(value)) {
                return callback(new Error('请输入正确的天数'));
            }
            setTimeout(() => {
                if (!Number.isInteger(value)) {
                    callback(new Error('请输入数字值'));
                } else {
                    callback();
                }
            }, 1000);
        };
        return {
            nav: ['基础参数设置', '交易基础参数设置'],
            bodyLoading: false,
            btnLoading: false,
            ruleForm: {
                activityOrderCancelTime: '', // 活动订单关闭时间
                orderCancleTime: '', // 普通订单关闭时间
                goodsConfirmTime: '', // 订单完成超时时间
                evaluationCancleTime: '', // 评价超时时间
                expressSendTime: '', // 售后回寄超时时间
                afterSaleTimes: '', // 售后申请次数
                afterSaleCancleTime: '' // 售后关闭时间
            },
            rules: {
                activityOrderCancelTime: [
                    {
                        required: true,
                        validator: commonCheckReg,
                        trigger: 'blur'
                    }
                ],
                orderCancleTime: [
                    {
                        required: true,
                        validator: commonCheckReg,
                        trigger: 'blur'
                    }
                ],
                goodsConfirmTime: [
                    {
                        required: true,
                        validator: checkoutDays,
                        trigger: 'blur'
                    }
                ],
                evaluationCancleTime: [
                    {
                        required: true,
                        validator: checkoutDays,
                        trigger: 'blur'
                    }
                ],
                expressSendTime: [
                    {
                        required: true,
                        validator: checkoutDays,
                        trigger: 'blur'
                    }
                ],
                afterSaleTimes: [
                    {
                        required: true,
                        validator: commonCheckReg,
                        trigger: 'blur'
                    }
                ],
                afterSaleCancleTime: [
                    {
                        required: true,
                        validator: checkoutDays,
                        trigger: 'blur'
                    }
                ]
            }
        };
    },
    activated() {
        this.getInfo();
    },
    methods: {
        // 获取数据
        getInfo() {
            const data = {
                codes: 'time_activity_order_cancel,time_order_cancel,time_goods_confirm,time_express_send,time_evaluation_cancel,times_after_sale,time_after_sale_cancel'
            };
            this.bodyLoading = true;
            request
                .queryConfig(data)
                .then(res => {
                    res.data.forEach(v => {
                        v.value = v.value ^ 0;
                        switch (v.code) {
                            case 'time_activity_order_cancel':
                                this.ruleForm.activityOrderCancelTime = v.value;
                                break;
                            case 'time_order_cancel':
                                this.ruleForm.orderCancleTime = Math.floor(v.value / 60);
                                break;
                            case 'time_goods_confirm':
                                this.ruleForm.goodsConfirmTime = v.value;
                                break;
                            case 'time_evaluation_cancel':
                                this.ruleForm.evaluationCancleTime = v.value;
                                break;
                            case 'time_express_send':
                                this.ruleForm.expressSendTime = v.value;
                                break;
                            case 'times_after_sale':
                                this.ruleForm.afterSaleTimes = v.value;
                                break;
                            case 'time_after_sale_cancel':
                                this.ruleForm.afterSaleCancleTime = v.value;
                                break;
                        }
                    });
                    this.bodyLoading = false;
                })
                .catch(err => {
                    this.bodyLoading = false;
                    console.log(err);
                });
        },
        //   提交表单
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    const data = {
                        configVOS: [
                            {
                                code: 'time_activity_order_cancel',
                                value: this.ruleForm.activityOrderCancelTime
                            },
                            {
                                code: 'time_order_cancel',
                                value: this.ruleForm.orderCancleTime * 60
                            },
                            {
                                code: 'time_goods_confirm',
                                value: this.ruleForm.goodsConfirmTime
                            },
                            {
                                code: 'time_express_send',
                                value: this.ruleForm.expressSendTime
                            },
                            {
                                code: 'time_evaluation_cancel',
                                value: this.ruleForm.evaluationCancleTime
                            },
                            {
                                code: 'times_after_sale',
                                value: this.ruleForm.afterSaleTimes
                            },
                            {
                                code: 'time_after_sale_cancel',
                                value: this.ruleForm.afterSaleCancleTime
                            }
                        ]
                    };
                    this.btnLoading = true;
                    request
                        .addOrModifyList(data)
                        .then(res => {
                            this.$message.success(res.msg);
                            this.btnLoading = false;
                        })
                        .catch(err => {
                            console.log(err);
                            this.btnLoading = false;
                        });
                } else {
                    console.log('error submit!!');
                    this.$message.warning('请输入合法数据!');
                    return false;
                }
            });
        },
        // 取消
        cancle() {
            this.getInfo();
        }
    }
};
</script>
<style lang='less' scoped>
.base-params {
    .currency-title {
        width: 100%;
        height: 60px;
        background-color: #f7f7f7;
        line-height: 60px;
        padding: 0 20px;
        box-sizing: border-box;
    }

    .currency-small-title {
        display: inline-block;
        margin: 20px 0;
        box-sizing: border-box;
        font-size: 14px;
    }
    .input-sty {
        width: 350px;
        margin-bottom: 20px;
    }
    .point {
        font-size: 14px;
        padding: 0 15px 0 5px;
    }
}
</style>
