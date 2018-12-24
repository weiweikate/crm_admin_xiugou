<!-- 基础费率设置  -->
<template>
    <div class="basic-rate-setting">
        <v-breadcrumb :nav="nav"></v-breadcrumb>
        <el-card v-loading="bodyLoading" :body-style="{ padding: '20px 40px',minHeight:'60vh' }">
            <div class="currency-title">基础费率设置</div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" size='mini' class="mt10">
                <el-form-item label="支付交易手续费" prop="serverCharge">
                    <el-input type="number" v-model.number="ruleForm.serverCharge" @keyup.native="ruleForm.serverCharge = Math.abs(ruleForm.serverCharge)" class="input-sty"></el-input><span class="point">%</span><span>支付价格 * 三方收单手续费率</span>
                </el-form-item>
                <el-form-item label="税率" prop="taxRate">
                    <el-input type="number" v-model.number="ruleForm.taxRate" @keyup.native="ruleForm.taxRate = Math.abs(ruleForm.taxRate)" class="input-sty"></el-input><span class="point">%</span><span>商品毛利润 * 商品差额税费率</span>
                </el-form-item>
                <el-form-item label="其他交易成本1" prop="otherTradeCostOne">
                    <el-input type="number" v-model.number="ruleForm.otherTradeCostOne" @keyup.native="ruleForm.otherTradeCostOne = Math.abs(ruleForm.otherTradeCostOne)" class="input-sty"></el-input><span class="point">%</span><span>支付价格 * 其他交易成本1费率</span>
                </el-form-item>
                <el-form-item label="其他交易成本2" prop="otherTradeCostTwo">
                    <el-input type="number" v-model.number="ruleForm.otherTradeCostTwo" @keyup.native="ruleForm.otherTradeCostTwo = Math.abs(ruleForm.otherTradeCostTwo)" class="input-sty"></el-input><span class="point">%</span><span>商品毛利润 * 其他交易成本2费率</span>
                </el-form-item>
                <el-form-item label="公司利润" prop="companyProfits">
                    <el-input type="number" v-model.number="ruleForm.companyProfits" @keyup.native="ruleForm.companyProfits = Math.abs(ruleForm.companyProfits)" class="input-sty"></el-input><span class="point">%</span><span>商品成交毛利-支付交易手续费-税率</span>
                </el-form-item>
                <el-form-item>
                    <el-button :loading="btnLoading" type="primary" @click="submitForm('ruleForm')">确认</el-button>
                    <el-button :loading="btnLoading" @click="cancel('ruleForm')">取消</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
import vBreadcrumb from '@/components/common/Breadcrumb.vue';
import { regExpConfig } from '@/utils/regConfig.js';
import request from '@/http/http';
export default {
    data() {
        const commonCheckReg = (rule, value, callback) => {
            if (!value && value !== 0) {
                return callback(new Error('选项不能为空'));
            }
            setTimeout(() => {
                if (!regExpConfig.float.test(value)) {
                    callback(new Error('请输入数字值'));
                } else {
                    callback();
                }
            }, 1000);
        };
        return {
            nav: ['结算管理', '基础费率设置'],
            bodyLoading: false,
            btnLoading: false,
            ruleForm: {
                serverCharge: '', // 交易手续费
                taxRate: '', // 税率
                otherTradeCostOne: '', // 其他交易成本1
                otherTradeCostTwo: '', // 其他交易成本2
                companyProfits: '' // 公司利润
            },
            rules: {
                serverCharge: [{ required: true, validator: commonCheckReg, trigger: 'blur' }],
                taxRate: [{ required: true, validator: commonCheckReg, trigger: 'blur' }],
                otherTradeCostOne: [{ required: true, validator: commonCheckReg, trigger: 'blur' }],
                otherTradeCostTwo: [{ required: true, validator: commonCheckReg, trigger: 'blur' }],
                companyProfits: [{ required: true, validator: commonCheckReg, trigger: 'blur' }]
            }
        };
    },
    created() {},
    mounted() {
        this.getInfo();
    },
    computed: {}, // 计算属性
    methods: {
        getInfo() {
            const data = {
                codes: 'pay_service_charge_rate,tax_rate,other_one_trade_cost_rate,other_two_trade_cost_rate,company_profit_rate'
            };
            this.bodyLoading = true;
            request
                .queryConfig(data)
                .then(res => {
                    res.data.forEach(v => {
                        switch (v.code) {
                            case 'pay_service_charge_rate':
                                this.ruleForm.serverCharge = v.value;
                                break;
                            case 'tax_rate':
                                this.ruleForm.taxRate = v.value;
                                break;
                            case 'other_one_trade_cost_rate':
                                this.ruleForm.otherTradeCostOne = v.value;
                                break;
                            case 'other_two_trade_cost_rate':
                                this.ruleForm.otherTradeCostTwo = v.value;
                                break;
                            case 'company_profit_rate':
                                this.ruleForm.companyProfits = v.value;
                                break;
                        }
                    });
                    console.log(this.ruleForm);
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
                                code: 'pay_service_charge_rate',
                                value: this.ruleForm.serverCharge
                            },
                            {
                                code: 'tax_rate',
                                value: this.ruleForm.taxRate
                            },
                            {
                                code: 'other_one_trade_cost_rate',
                                value: this.ruleForm.otherTradeCostOne
                            },
                            {
                                code: 'other_two_trade_cost_rate',
                                value: this.ruleForm.otherTradeCostTwo
                            },
                            {
                                code: 'company_profit_rate',
                                value: this.ruleForm.companyProfits
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
        cancel() {
            this.getInfo();
        }
    },
    components: {
        vBreadcrumb
    }
};
</script>
<style lang='less' scoped>
.basic-rate-setting {
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