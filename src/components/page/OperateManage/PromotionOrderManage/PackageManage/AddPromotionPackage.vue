<template>
    <div class="add-promotionPackage">
        <v-breadcrumb :nav="nav"></v-breadcrumb>
        <el-card v-loading="bodyLoading" :body-style="{ padding: '20px 40px',minHeight:'60vh' }">
            <el-form ref="form" :model="form" :rules="rules" label-width="110px" style="margin-top: 30px">
                <el-form-item prop="name" label="套餐名称">
                    <el-input v-model="form.name" maxlength="18" placeholder="请输入套餐名称" class="input-sty"></el-input>
                </el-form-item>
                <el-form-item prop="price" label="套餐单红包金额">
                    <el-input v-model="form.price" placeholder="请输入数值" @input="calMoney" class="input-sty"></el-input>
                    <span class="point">元</span>
                </el-form-item>
                <el-form-item prop="count" label="红包数">
                    <el-input v-model="form.count" placeholder="请输入数值" @input="calMoney" class="input-sty"></el-input>
                    <span class="point">份</span>
                </el-form-item>
                <el-form-item label="套餐金额">
                    <el-input v-model="form.total" disabled="" placeholder="请输入数值" class="input-sty"></el-input>
                    <span class="point">元</span>
                </el-form-item>
                <el-form-item prop="cycle" label="推广周期">
                    <el-input v-model="form.cycle" placeholder="请输入数值" class="input-sty"></el-input>
                    <span class="point">天</span>
                </el-form-item>
                <el-form-item prop="totalNumber" label="可购买数">
                    <el-input v-model="form.totalNumber" placeholder="请输入数值" class="input-sty"></el-input>
                    <span class="point">份</span>
                </el-form-item>
                <el-form-item label="是否限购">
                    <el-radio-group v-model="buyLimit" @change="changeNum">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="2">否</el-radio>
                    </el-radio-group>
                    <div v-if="buyLimit==1">
                        <span>每人限购份数</span><el-input v-model="form.buyLimit" placeholder="请输入数值" class="input-sty small-inp"></el-input>
                        <span class="point">份</span>
                    </div>
                </el-form-item>
                <el-form-item prop="remark" label="备注">
                    <el-input type="textarea" v-model="form.remark" maxlength="180" placeholder="请输入备注" class="input-sty remark-inp"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button :loading="btnLoading" type="primary" @click="submitForm('form')">确认保存</el-button>
                    <el-button type="success" @click="cancel">取消</el-button>
                </el-form-item>
            </el-form>
        </el-card>

    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import request from '@/http/http';
    import utils from '@/utils/index.js';

    export default {
        components: { vBreadcrumb },

        data() {
            var checkName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('套餐名称不能为空'));
                } else {
                    callback();
                }
            };
            var isInt = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入数值'));
                } else {
                    const reg = /^[1-9]*[1-9][0-9]*$/;
                    if (!reg.test(value) || value.length > 12) {
                        return callback(new Error('请输入1-12位数字'));
                    } else {
                        callback();
                    }
                }
            };
            var isInt5 = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入数值'));
                } else {
                    const reg = /^[1-9]*[1-9][0-9]*$/;
                    if (!reg.test(value) || value.length > 5) {
                        return callback(new Error('请输入1-5位数字'));
                    } else {
                        callback();
                    }
                }
            };
            var isDouble = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入数值'));
                } else {
                    const reg = /^(0|[1-9]\d*)([.]{1}[0-9]{1,2})?$/;
                    if (!reg.test(value) || value > 100000000000) {
                        return callback(new Error('请输入1-12位两位小数'));
                    } else {
                        callback();
                    }
                }
            };
            return {
                nav: ['运营管理', '推广订单管理', '套餐管理', '新建套餐'],
                bodyLoading: false,
                btnLoading: false,
                buyLimit: 1, // 是否限购 1是2否
                form: {
                    name: '',
                    price: '',
                    count: '',
                    total: '',
                    cycle: '',
                    totalNumber: '',
                    buyLimit: '',
                    remark: ''
                },
                rules: {
                    name: [{ validator: checkName, trigger: 'blur' }],
                    price: [{ validator: isDouble, trigger: 'blur' }],
                    count: [{ validator: isInt, trigger: 'blur' }],
                    cycle: [{ validator: isInt5, trigger: 'blur' }],
                    buyLimit: [{ validator: isInt, trigger: 'blur' }],
                    totalNumber: [{ validator: isInt, trigger: 'blur' }]
                }

            };
        },

        activated() {
            this.resetVlaue();
        },

        methods: {
            //   提交表单
            submitForm(formName) {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        const data = this[formName];
                        if (this.buyLimit == 1) {
                            if (!this.form.buyLimit) {
                                this.$message.warning('请输入限购数量');
                                return;
                            }
                        } else {
                            this.form.buyLimit = -1;
                        }
                        this.btnLoading = true;
                        request.addPromotionPackage(data).then(res => {
                            this.$message.success(res.msg);
                            this.$router.push('/packageManage');
                            this.btnLoading = false;
                        }).catch(err => {
                            console.log(err);
                            this.btnLoading = false;
                        });
                    } else {
                        console.log('error submit!!');
                        this.btnLoading = false;
                        return false;
                    }
                });
            },
            // 取消
            resetVlaue() {
                utils.cleanFormData(this.form);
                this.buyLimit = 1;
            },
            //返回列表
            cancel(){
                this.$router.push('/packageManage')
            },
            changeNum() {
                this.form.buyLimit = '';
            },
            calMoney() {
                if (this.form.count && this.form.price) {
                    this.form.total = this.form.price * this.form.count;
                }
            }
        }
    };
</script>
<style lang='less' scoped>
    .add-promotionPackage {
        .input-sty {
            width: 250px;
        }
        .small-inp{
            width: 160px;
            margin-left: 5px;
        }
        .point {
            font-size: 14px;
            padding: 0 15px 0 5px;
        }
        .btn-group {
            margin-top: 40px;
        }
        .opr-btn{
            font-size: 14px;
            color: #3a8ee6;
            cursor: pointer;
        }
        .add-btn{
            margin-left: 100px;
        }
        .remark-inp,/deep/.el-textarea__inner{
            height: 150px;
            resize: none;
        }
    }
</style>
