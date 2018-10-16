<template>
    <div class="pwd-mask">
        <div class="box">
            <div class="mask-title"><icon class="title-icon" ico='icon-wodejihuo' /> 管理员账号激活</div>
            <div class="mask-content">
                <el-form :model="form" :rules="rules" ref="form" label-width="0px">
                    <el-form-item class="inp" prop="phone">
                        <el-input  size="media" placeholder="请输入登陆手机号" v-model="form.phone">
                            <icon slot="prefix" class="inp-ico " ico="icon-3denglumima"></icon>
                        </el-input>
                    </el-form-item>
                    <el-form-item class="inp" prop="code">
                        <el-button @click="getCode" class="code-btn" type="primary" v-if="code">获取验证码</el-button>
                        <el-button class="code-btn" type="primary" v-else>{{codeTime}}s</el-button>
                        <el-input size="media" placeholder="请输入验证码" v-model="form.code">
                            <icon slot="prefix" class="inp-ico" ico="icon-yanzhengma"></icon>
                        </el-input>
                    </el-form-item>
                    <el-button class="confirm-btn" @click="submitForm('form')">下一步</el-button>
                </el-form>
            </div>
        </div>
    </div>
</template>
<script>
import icon from '../../common/ico';
import request from '@/http/http.js';
export default {
    components: {
        icon
    },
    data() {
        return {
            code: true,
            codeTime: 0,
            form: {
                phone: '',
                code: ''
            },
            rules: {
                phone: [
                    { required: true, message: '请输入登陆手机号', trigger: 'blur' }
                ],
                code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
            }
        };
    },
    methods: {
        submitForm(form) {
            const data = {};
            data.phone = this.form.phone;
            data.code = this.form.code;
            request.loginUpdateCheckCode(data).then(res => {
                if (res.code === 10000) {
                    localStorage.setItem('ms_phone', this.form.phone);
                    this.$emit('status', false);
                }
            }).catch(err => {
                console.log(err);
            });
        },
        // 获取验证码
        getCode() {
            if (this.form.phone == '') {
                this.$message.warning('请输入手机号');
                return;
            }
            const that = this;
            this.code = false;
            const data = {};
            data.phone = this.form.phone;
            data.templateCode = 'ADMIN_FIRSTLOGIN_CODE';
            request.getCode(data).then(res => {
                this.codeTime = 60;
                const timer = setInterval(function() {
                    that.codeTime--;
                    if (that.codeTime <= 0) {
                        that.code = true;
                        clearInterval(timer);
                    }
                }, 1000);
                this.$message.success(res.msg);
            });
        }
    }
};
</script>
<style lang="less">
.pwd-mask {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  .box {
    width: 530px;
    height: 385px;
    background-color: #fff;
    border-radius: 10px;
    overflow: hidden;
    .mask-title {
      width: 100%;
      height: 56px;
      border-bottom: 1px solid #ccc;
      text-align: center;
      line-height: 56px;
      .title-icon {
        color: #33b4ff;
        font-size: 22px;
        vertical-align: -0.25em;
      }
    }
    .mask-content {
      position: relative;
      width: 100%;
      height: 326px;
      overflow: hidden;
      .inp {
        position: relative;
        margin: 40px 0 0 75px;
        width: 380px;
        .el-input__inner {
            height: 50px;
            border-radius: 8px;
        }
        .el-input--prefix .el-input__inner{
          padding-left: 30px;
        }
        .inp-ico {
          font-size: 20px;
          margin-top: 15px;
        }
        .code-btn {
          width: 92px;
          line-height: 100%;
          position: absolute;
          top: 10px;
          left: 270px;
          border-radius: 10px;
          background-color: #33b4ff;
          border-color: #33b4ff;
          z-index: 99;
        }
      }
      .confirm-btn {
        position: absolute;
        left: 75px;
        bottom: 50px;
        width: 380px;
        height: 50px;
        background-color: #ff6868;
        border-radius: 8px;
        border-color: #ff6868;
        color: #fff;
        font-size: 18px;
      }
    }
  }
}
</style>


