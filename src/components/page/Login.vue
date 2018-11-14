<template>
    <div class="login-wrap">
        <div class="ms-title">CRM系统后台登录</div>
        <div class="ms-login">
            <el-tabs class="tab" v-model="loginType" type="card" @tab-click="tabClick">
                <el-tab-pane label="账号登录" name="first">
                    <el-form :model="form1" :rules="rules" ref="form1" label-width="0px">
                        <el-form-item prop="phone">
                            <el-input class="login-inp" size="large" placeholder="请输入登录手机号" v-model="form1.phone">
                                <icon slot="prefix" class="login-ico" ico="icon-zhucedengluyonghuming"></icon>
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="password" style="margin-top:-40px">
                            <el-input @keyup.enter.native='submitForm("form1")' class="login-inp" type="password"
                                      size="large" placeholder="请输入登录密码" v-model="form1.password">
                                <icon slot="prefix" class="login-ico" ico="icon-3denglumima"></icon>
                            </el-input>
                        </el-form-item>
                        <div class="login-btn">
                            <el-button :loading="btnLoading" @click="submitForm('form1')">登录</el-button>
                        </div>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="手机验证登录" name="second">
                    <el-form :model="form2" :rules="rules" ref="form2" label-width="0px">
                        <el-form-item prop="phone">
                            <el-input class="login-inp" size="large" placeholder="请输入登录手机号" v-model="form2.phone">
                                <icon slot="prefix" class="login-ico" ico="icon-zhucedengluyonghuming"></icon>
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="code" style="margin-top:-40px">
                            <el-input @keyup.enter.native='submitForm("form2")' class="login-inp" size="large"
                                      placeholder="请输入验证码" v-model="form2.code">
                                <icon slot="prefix" class="login-ico" ico="icon-yanzhengma"></icon>
                            </el-input>
                            <el-button @click="getCode" class="code-btn" type="primary" v-if="code">获取验证码</el-button>
                            <el-button class="code-btn" type="primary" v-else>{{codeTime}}s</el-button>
                        </el-form-item>
                        <div class="login-btn">
                            <el-button :loading="btnLoading" @click="submitForm('form2')">登录</el-button>
                        </div>
                    </el-form>
                </el-tab-pane>
                <!-- <el-tab-pane label="扫码登录" name="third">
                    <div style="width:100%;text-align:center">扫码登录暂未开通，敬请期待！</div>
                </el-tab-pane> -->
            </el-tabs>
        </div>
        <div style="text-align: center">更新时间:{{version}}</div>
    </div>
</template>

<script>
    import icon from '../common/ico';
    import request from '@/http/http.js';

    export default {
        components: {
            icon
        },
        data() {
            return {
                redirect: undefined,
                version: process.env.version,
                loginType: 'first',
                btnLoading: false,
                code: true,
                codeTime: 5,
                form1: {
                    phone: '',
                    password: ''
                    // phone: '18667159736',
                    // password: 'a123456'
                },
                form2: {
                    phone: '',
                    code: ''
                },
                rules: {
                    phone: [
                        { required: true, message: '请输入登录手机号', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入登录密码', trigger: 'blur' }
                    ],
                    code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
                }
            };
        },
        watch: {
            $route: {
                handler: function (route) {
                    this.redirect = route.query && route.query.redirect;
                },
                immediate: true
            }
        },
        methods: {
            // 提交表单
            submitForm(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        const data = this[formName];
                        let url;
                        if (formName === 'form1') {
                            url = 'loginByPwd';
                        } else {
                            url = 'loginByCode';
                        }
                        if (this[formName].phone.length !== 11) {
                            this.$message.warning('账号长度不符');
                            return;
                        }
                        var exp = /^[0-9]*[1-9][0-9]*$/;
                        if (!exp.test(this[formName].phone)) {
                            this.$message.warning('账号不能含有字符或者符号');
                            return;
                        }
                        this.btnLoading = true;
                        data._url = url;
                        this.$store.dispatch('Login', data).then(() => {
                            this.btnLoading = false;
                            this.$router.push({ path: this.redirect || '/' });
                        }).catch(() => {
                            this.btnLoading = false;
                        });
                        /*request[url](data).then(res => {
                            localStorage.setItem('ms_username', res.data.name);
                            localStorage.setItem('ms_userID', res.data.id);
                            localStorage.setItem('ms_userPhone', res.data.telephone);
                            localStorage.setItem('ms_hadFirstLogin', res.data.hadFirstLogin);
                            this.getUserPriList(res.data.id);
                            this.btnLoading = false;
                        }).catch(err => {
                            this.btnLoading = false;
                            console.log(err);
                        });*/
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            // 获取验证码
            getCode() {
                const phoneNum = this.form2.phone;
                if (phoneNum === '') {
                    this.$message.warning('请输入手机号!');
                    return;
                }
                if (this.form2.phone.length !== 11) {
                    this.$message.warning('账号长度不符');
                    return;
                }
                var exp = /^[0-9]*[1-9][0-9]*$/;
                if (!exp.test(this.form2.phone)) {
                    this.$message.warning('账号不能含有字符或者符号');
                    return;
                }
                const that = this;
                this.code = false;
                this.codeTime = 60;
                const timer = setInterval(function () {
                    that.codeTime--;
                    if (that.codeTime <= 0) {
                        that.code = true;
                        clearInterval(timer);
                    }
                }, 1000);
                const data = { phone: this.form2.phone, templateCode: 'ADMIN_LOGIN_CODE' };
                request.getCode(data).then(res => {
                    this.$message.success(res.msg);
                });
            },
            // tab切换
            tabClick(params) {
            },
            // 获取权限列表
            getUserPriList(id) {
                request.findAdminUserbyId({ id: id }).then(res => {
                    this.$message.success('登录成功！');
                    this.$router.push({ path: this.redirect || '/dashboard' });
                    this.btnLoading = false;
                }).catch(err => {
                    this.btnLoading = false;
                    console.log(err);
                });
            }
        }
    };
</script>

<style lang='less'>
    @import "../../assets/css/login/login.css";
</style>
