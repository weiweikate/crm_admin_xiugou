<template>
    <div class="edit-manger-msg">
        <breadcrumb :nav='nav'></breadcrumb>
        <el-card :body-style="{padding:'0px'}">
            <div class="box">
                <div class="detail-msg">
                    <span>基础信息</span>
                    <p>姓名：{{name}}</p>
                    <p>手机号：{{telephone}}</p>
                    <span>部门信息</span>
                    <p>所属部门：{{deptmentName}}</p>
                    <p>所在岗位：{{jobName}}</p>
                    <p>直接上级：{{immediateSuperior}}</p>
                    <span>权限信息</span>
                    <p>默认权限：<el-tag style="margin-right:5px" v-for="(v,k) in privilege" :key="k">{{v}}</el-tag></p>
                    <div class="avatar"><img :src="face" alt=""></div>
                    <el-upload
                        class="avatar"
                        :action="uploadImg"
                        :show-file-list="false"
                        :on-success="uploadAvatar">
                        <img v-if="face == ''" src="../../../assets/images/avatar.jpg" alt="">
                        <img v-else :src="face" alt="">
                    </el-upload>
                    <el-button type="primary" class='edit-btn' @click='editPwd'>登陆密码修改</el-button>
                </div>
            </div>
        </el-card>
        <el-dialog title="登陆密码修改" width="600px" :visible.sync="isShowEditPwd">
            <div class="toask-wrap">
                <el-form ref="form" :model="form" :rules="rules">
                    <el-form-item prop="phone">
                        <el-input class="edit-pwd-inp" size="large" placeholder="请输入手机号" v-model="form.phone">
                            <icon slot="prefix" class="inp-ico" ico="icon-zhucedengluyonghuming"></icon>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="code">
                        <el-input class="edit-pwd-inp" size="large" placeholder="请输入验证码" v-model="form.code">
                            <icon slot="prefix" class="inp-ico " ico="icon-yanzhengma"></icon>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input class="edit-pwd-inp" type="password" size="large" placeholder="请重新设置您的密码" v-model="form.password">
                            <icon slot="prefix" class="inp-ico " ico="icon-3denglumima"></icon>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="repeatPwd">
                        <el-input class="edit-pwd-inp" type="password" size="large" placeholder="请再次输入您的密码" v-model="form.repeatPwd">
                            <icon slot="prefix" class="inp-ico " ico="icon-3denglumima"></icon>
                        </el-input>
                    </el-form-item>
                </el-form>
                <el-button @click="getCode" class="code-btn" type="primary" v-if="code">获取验证码</el-button>
                <el-button class="code-btn" type="primary" v-else>{{codeTime}}s</el-button>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirmEditPwd('form')">确 定</el-button>
                <el-button @click="isShowEditPwd = false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import breadcrumb from '@/components/common/Breadcrumb';
import icon from '@/components/common/ico';
import * as api from '@/api/api.js';
import request from '@/http/http';
import { mapGetters } from 'vuex';
export default {
    components: {
        breadcrumb,
        icon
    },
    computed: {
        ...mapGetters([
            'user'
        ])
    },
    data() {
        return {
            nav: ['权限管理', '管理员基础信息修改'],
            isShowEditPwd: false,
            code: true,
            uploadImg: '',
            name: '',
            telephone: '',
            deptmentName: '',
            jobName: '',
            immediateSuperior: '',
            privilege: [],
            face: '',
            id: '',
            form: {
                phone: '',
                code: '',
                password: '',
                repeatPwd: ''
            },
            rules: {
                phone: [{ required: true, message: '请输入电话号码', trigger: 'blur' }],
                code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
            }
        };
    },
    activated() {
        this.uploadImg = api.uploadImg;
        this.id = this.user.id;
        request.findAdminUserbyId({ id: this.id }).then(res => {
            this.name = res.data.name;
            this.telephone = res.data.telephone;
            this.deptmentName = res.data.deptmentName;
            this.jobName = res.data.jobName;
            this.immediateSuperior = res.data.immediateSuperior;
            this.face = res.data.face;
            this.privilege = [];
            res.data.adminUserPrivilegeList.forEach((v, k) => {
                this.privilege.push(v.name);
            });
        }).catch(err => {
            console.log(err);
        });
    },
    methods: {
    //  修改信息
        editPwd() {
            this.form = {};
            this.isShowEditPwd = true;
        },
        confirmEditPwd(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.form.password != this.form.repeatPwd) {
                        this.$message.warning('两次密码输入不一致');
                        return;
                    }
                    const data = {};
                    data.id = this.id;
                    data.phone = this.form.phone;
                    data.password = this.form.password;
                    data.code = this.form.code;
                    request.updateAdminUserPassword(data).then(res => {
                        this.isShowEditPwd = false;
                        this.$message.success(res.msg);
                    }).catch(err => {
                        console.log(err);
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },

        // 上传图片
        uploadAvatar(res) {
            const imageUrl = res.data;
            request.updateAdminUser({ id: this.id, face: imageUrl, type: 2 }).then(res => {
                this.$message.success(res.msg);
                this.face = imageUrl;
            }).catch(err => {
                console.log(err);
            });
        },
        //  获取验证码
        getCode() {
            if (this.form.phone == '') {
                this.$message.warning('请输入手机号');
                return;
            }
            const data = {};
            const that = this;
            this.code = false;
            this.codeTime = 60;
            let timer = setInterval(function() {
                that.codeTime--;
                if (that.codeTime <= 0) {
                    that.code = true;
                    clearInterval(timer);
                }
            }, 1000);
            data.phone = this.form.phone;
            data.templateCode = 'ADMIN_FIRSTLOGIN_CODE';
            request.getCode(data).then(res => {
                this.$message.success(res.msg);
            });
        }
    }
};
</script>
<style lang="less">
.edit-manger-msg {
  .box {
    width: 100%;
    height: 80vh;
    padding: 50px 100px;
    box-sizing: border-box;
    .detail-msg {
      position: relative;
      width: 760px;
      height: auto;
      padding: 0px 45px;
      box-sizing: border-box;
      border: 1px solid #ccc;
      border-radius: 10px;
      & > span {
        line-height: 46px;
        font-size: 16px;
      }
      p {
        line-height: 36px;
        font-size: 14px;
        color: #666;
      }
      .avatar {
        position: absolute;
        top: 20px;
        right: 60px;
        width: 100px;
        height: 100px;
        border: 2px solid #dfdfdf;
        border-radius: 10px;
        overflow: hidden;
        img {
            width: 100%;
            height:100%;
        }
      }
      .edit-btn {
        position: absolute;
        top: 145px;
        right: 60px;
      }
    }
  }
  .toask-wrap{
      position: relative;
      width: 530px;
      .code-btn{
          position: absolute;
          top: 76px;
          right: 92px;
          border-radius: 10px;
      }
      .el-input--prefix .el-input__inner {
            padding-left: 30px;
        }
        .el-input__inner {
            height: 50px;
            border-radius: 8px;
        }
  }
  .el-dialog__header {
    border-bottom: 1px solid #ccc;
  }
  .el-dialog__title {
    color: #ff6868;
  }
  .edit-pwd-inp {
    width: 370px;
    margin-left: 85px;
    .inp-ico{
        font-size: 22px;
        margin-top: 12px;
    }
  }
  .el-form-item__error{
      left: 92px;
  }
  .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .el-upload:hover {
      border-color: #409eff;
    }
    .el-upload--text {
      width: 100%;
      height: 100%;
      border: none;
    }
}
</style>


