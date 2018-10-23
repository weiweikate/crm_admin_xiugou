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
                <el-form-item prop="num" label="红包数">
                    <el-input v-model="form.num" placeholder="请输入数值" @input="calMoney" class="input-sty"></el-input>
                    <span class="point">份</span>
                </el-form-item>
                <el-form-item label="套餐金额">
                    <el-input v-model="form.money" disabled="" placeholder="请输入数值" class="input-sty"></el-input>
                    <span class="point">元</span>
                </el-form-item>
                <el-form-item prop="days" label="推广周期">
                    <el-input v-model="form.days" placeholder="请输入数值" class="input-sty"></el-input>
                    <span class="point">天</span>
                </el-form-item>
                <el-form-item prop="buyNumber" label="可购买数">
                    <el-input v-model="form.buyNumber" placeholder="请输入数值" class="input-sty"></el-input>
                    <span class="point">份</span>
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
                form: {
                    name: '',
                    price: '',
                    num: '',
                    money: '',
                    days: '',
                    buyNumber: ''
                },
                rules: {
                    name: [{ validator: checkName, trigger: 'blur' }],
                    price: [{ validator: isDouble, trigger: 'blur' }],
                    num: [{ validator: isInt, trigger: 'blur' }],
                    days: [{ validator: isInt, trigger: 'blur' }],
                    buyNumber: [{ validator: isInt, trigger: 'blur' }]
                }

            };
        },

        activated() {
        },

        methods: {
            //   提交表单
            submitForm(formName) {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.btnLoading = true;
                        request.addOrModifyList({}).then(res => {
                            this.$message.success(res.msg);
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
            cancel() {
                this.getInfo();
            },
            calMoney() {
                if (this.form.num && this.form.price) {
                    this.form.money = this.form.price * this.form.num;
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
    }
</style>
