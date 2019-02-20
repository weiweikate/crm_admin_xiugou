<template>
    <div class="user-logout-param">
        <v-breadcrumb :nav="nav"></v-breadcrumb>
        <el-card v-loading="bodyLoading" :body-style="{ padding: '20px 40px',minHeight:'60vh' }">
            <div class="currency-title">参数设置</div>
            <el-form :model="form" :rules="rules" ref="ruleForm" label-width="140px" size='mini' class="mt10">
                <el-form-item label="解绑手机号，禁用" prop="unbindingPhone">
                    <el-input v-model.number="form.unbindingPhone" class="input-sty"></el-input><span class="point">天</span>
                </el-form-item>
                <el-form-item label="注销手机号，禁用" prop="canclePhone">
                    <el-input v-model.number="form.canclePhone" class="input-sty"></el-input><span class="point">天</span>
                </el-form-item>
                <p class="grey-text">注：禁用期间，手机号不可注册新账号，绑定其他账号</p>
                <el-form-item>
                    <el-button class="mt10" :loading="btnLoading" type="primary" @click="submitForm('ruleForm')">确认提交</el-button>
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
            return {
                nav: ['基础参数设置', '会员注册限制参数设置'],
                form: {
                    unbindingPhone: '',
                    canclePhone: ''
                },
                bodyLoading: false,
                btnLoading: false,
                rules: {
                    unbindingPhone: [
                        {
                            required: true,
                            validator: commonCheckReg,
                            trigger: 'blur'
                        }
                    ],
                    canclePhone: [
                        {
                            required: true,
                            validator: commonCheckReg,
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
                    codes: 'time_unbinding_phone,time_cancellation_phone'
                };
                this.bodyLoading = true;
                request
                    .queryConfig(data)
                    .then(res => {
                        res.data.forEach(v => {
                            v.value = v.value ^ 0;
                            switch (v.code) {
                                case 'time_unbinding_phone':
                                    this.form.unbindingPhone = v.value;
                                    break;
                                case 'time_cancellation_phone':
                                    this.form.canclePhone = v.value;
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
            // 提交表单
            submitForm(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        const data = {
                            configVOS: [
                                {
                                    code: 'time_unbinding_phone',
                                    value: this.form.unbindingPhone
                                },
                                {
                                    code: 'time_cancellation_phone',
                                    value: this.form.canclePhone
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
            }
        }
    };
</script>

<style lang="less" scoped>
.user-logout-param{
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
    }
    .point {
        font-size: 14px;
        padding: 0 15px 0 5px;
    }
}
</style>
