<template>
    <div class="pwd-mask">
        <div class="box">
            <div class="mask-title"><icon class="title-icon" ico='icon-wodejihuo' /> 管理员账号激活</div>
            <div class="mask-content">
                <el-form :model="form" :rules="rules" ref="form" label-width="0px">
                    <el-form-item class="inp" prop="password">
                        <el-input  size="media" placeholder="请重新设置您的登陆密码" type="password" v-model="form.password">
                            <icon slot="prefix" class="inp-ico " ico="icon-3denglumima"></icon>
                        </el-input>
                    </el-form-item>
                    <el-form-item class="inp" prop="repeatPwd">
                        <el-input size="media" placeholder="确认密码" type="password" v-model="form.repeatPwd">
                            <icon slot="prefix" class="inp-ico" ico="icon-3denglumima"></icon>
                        </el-input>
                    </el-form-item>
                    <el-button class="confirm-btn" @click="submitForm('form')">设置完成</el-button>
                </el-form>
            </div>
        </div>
    </div>
</template>
<script>
import icon from "../../common/ico";
import * as api from '../../../api/api.js';
export default {
  components: {
    icon
  },
  data() {
    return {
      form: {
        password: "",
        repeatPwd: ""
      },
      rules: {
        password: [
          {
            required: true,
            message: "请输入6到16位数字加英文设置密码",
            trigger: "blur"
          }
        ],
        repeatPwd: [
          { required: true, message: "请再次登陆密码", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.form.password != this.form.repeatPwd) {
            this.$message.warning("两次密码输入不一致");
            return;
          }
          let data = {};
          data.phone = localStorage.getItem('ms_phone');
          data.password = this.form.repeatPwd;
          this.$axios
            .post(api.loginUpdatePassword, data)
            .then(res => {
                console.log(res.data);
              if (res.data.code == 200) {
                  localStorage.setItem("ms_hadFirstLogin", 0);
                  this.$emit('status',false);
              } else {
                this.$message.warning(res.data.msg);
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
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
      }
    }
    .mask-content {
      position: relative;
      width: 100%;
      height: 326px;
      overflow: hidden;
      .inp {
        margin: 40px 0 0 75px;
        width: 380px;
        .inp-ico {
          font-size: 20px;
          margin-top: 15px;
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


