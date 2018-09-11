<template>
    <div class="add-manger">
        <breadcrumb :nav='nav'></breadcrumb>
        <el-card>
            <div class="add-box">
                <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                    <span class="add-box-title">基础信息</span>
                    <el-form-item prop="name" label="姓名">
                        <el-input class="add-mange-inp" v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item prop="telephone" label="手机号">
                        <el-input class="add-mange-inp" v-model="form.telephone"></el-input>
                    </el-form-item>
                    <div class="avatar">
                        <img v-if="form.face" :src="form.face">
                        <img v-else src="../../../assets/images/avatar.jpg" alt="">
                        <el-upload
                                :action="uploadImg"
                                :show-file-list="false"
                                :on-success="uploadAvatar">
                            <el-button type="primary">编辑头像</el-button>
                        </el-upload>
                        <div class="tip">请上传jpg，png格式</div>
                    </div>
                    <div class="clearfix"></div>
                    <hr width='90%' size='1' color='#ccc' class='add-box-sep'>
                    <span class="add-box-title">部门信息</span>
                    <el-form-item prop="deptmentId" label="所属部门">
                        <el-select v-model="form.deptmentId" @change="getJobList" placeholder="请选择">
                            <el-option v-for="item in department" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="jobId" label="所在岗位">
                        <el-select v-model="form.jobId" placeholder="请选择">
                            <el-option v-for="item in jobList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="immediateSuperior" label="直接上级">
                        <el-input class="add-mange-inp" v-model="form.immediateSuperior"></el-input>
                    </el-form-item>
                    <hr width='90%' size='1' color='#ccc' class='add-box-sep'>
                    <span class="add-box-title">权限信息</span>
                    <el-collapse accordion v-for="(v,k) in userManList" :key="k">
                        <el-collapse-item>
                            <template slot="title">
                                <el-checkbox class="collapse-tit" v-model="checkAllUser[k]" @change="handleCheckAllChangeUser(checkAllUser[k],k)">{{v.title}}</el-checkbox>
                            </template>
                            <el-checkbox-group v-model="checkedUser[k]" @change="handleCheckedUserChange(checkedUser[k],k)">
                                <div v-for="(item,index) in v.value" :key="index">
                                    <div class="collapse-title">{{item.title}}</div>
                                    <div style="overflow:hidden;margin-bottom:10px;">
                                        <div class="collapse-item">
                                            <el-checkbox v-for="(v1,k1) in item.value" :label="v1.id" :key="k1">{{v1.title}}</el-checkbox>
                                        </div>
                                    </div>
                                </div>
                            </el-checkbox-group>
                        </el-collapse-item>
                    </el-collapse>
                    <el-form-item>
                      <el-button type="primary" :loading="btnLoading" @click="submitForm('form')" style="margin-left:35%">提交</el-button>
                      <el-button @click="resetForm('form')">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </div>
</template>
<script>
import breadcrumb from '../../common/Breadcrumb';
import * as api from '../../../api/api.js';
import * as pApi from '../../../privilegeList/index.js';
import request from '@/http/http.js';
export default {
    components: {
        breadcrumb
    },
    data() {
        return {
            nav: ['权限管理', '创建账号'],
            btnLoading: false,
            checkAllUser: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
            checkedUser: [[], [], [], [], [], [], [], [], [], [], []],
            uploadImg: '',
            userManList: [],
            department: [],
            jobList: [],
            form: {
                name: '',
                telephone: '',
                deptmentId: [],
                jobId: '',
                immediateSuperior: '',
                face: ''
            },
            rules: {
                name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
                telephone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
                deptmentId: [{ required: true, message: '请输入所属部门', trigger: 'blur' }],
                jobId: [{ required: true, message: '请输入所在岗位', trigger: 'blur' }],
                immediateSuperior: [{ required: true, message: '请输入直接上级ID', trigger: 'blur' }]
            }
        };
    },
    activated() {
        this.form = {};
        this.checkedUser = [[], [], [], [], [], [], [], [], [], [], []];
        this.checkAllUser = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
        this.uploadImg = api.addImg;
        this.getRoleList();
        this.getDepartmentList();
    },
    methods: {
        // 提交表单
        submitForm(formName) {
            let data = {};
            const role = [];
            const reg = /^1(3|4|5|6|7|8)\d{9}$/;
            if (!reg.test(Number(this.form.telephone))) {
                this.$message.warning('请输入正确的手机号！');
                return;
            }
            this.checkedUser.forEach((v, k) => {
                v.forEach((val) => {
                    role.push(val);
                });
            });
            data = this.form;
            data.role = role.join(',');
            data.url = pApi.addAdminUser;
            this.btnLoading = true;
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    request.addManger(data).then(res => {
                        this.btnLoading = false;
                        this.$message.success(res.msg);
                        this.$router.push('/manageList');
                    }).catch(err => {
                        console.log(err);
                        this.btnLoading = false;
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 重置表单
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },

        // 上传图片
        uploadAvatar(res) {
            this.form.face = res.data.imageUrl;
        },

        // 全选用户管理
        handleCheckAllChangeUser(val, k) {
            const tmp = [];
            this.userManList[k].value.forEach(function(v) {
                v.value.forEach(function(val) {
                    tmp.push(val.id);
                });
            });
            this.checkedUser[k] = val ? tmp : [];
        },
        handleCheckedUserChange(value, k) {
            const itemTmp = [];
            const checkedCount = value.length;
            this.userManList[k].value.forEach(function(v) {
                v.value.forEach(function(val) {
                    itemTmp.push(val.value);
                });
            });
            this.checkAllUser[k] = checkedCount == itemTmp.length;
            this.$set(this.checkAllUser, k, this.checkAllUser[k]);
        },

        // 获取权限列表
        getRoleList() {
            const data = {};
            request.getRoleList(data).then(res => {
                this.userManList = res.data;
            }).catch(err => {
                console.log(err);
            });
        },

        // 获取部门列表
        getDepartmentList() {
            this.department = [];
            request.queryDepartmentList({}).then(res => {
                if (res.data.length !== 0) {
                    res.data.forEach((v, k) => {
                        this.department.push({ label: v.name, value: v.id });
                    });
                }
            }).catch(err => {
                console.log(err);
            });
        },
        // 获取岗位列表
        getJobList(val) {
            this.jobList = [];
            this.form.jobId = '';
            request.queryJobList({ id: val }).then(res => {
                if (res.data.length !== 0) {
                    res.data.forEach((v, k) => {
                        this.jobList.push({ label: v.name, value: v.id });
                    });
                }
            }).catch(err => {
                console.log(err);
            });
        }
    }
};
</script>
<style lang="less">
.add-manger {
  .add-box {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 30px;
    box-sizing: border-box;
    .add-mange-inp {
      width: 217px;
    }
    .add-box-title {
      display: block;
      margin: 0px 0px 20px 10px;
    }
    .add-box-sep {
      margin-bottom: 20px;
    }
    .el-collapse {
      width: 90%;
      border: 1px solid #ccc;
      padding: 3px;
      box-sizing: border-box;
      border-radius: 5px;
      margin-bottom: 10px;
      .el-collapse-item__header,
      .el-collapse-item__wrap {
        border: none;
      }
      .el-collapse-item__content {
        padding-bottom: 0;
      }
    }
    .collapse-tit .el-checkbox__label {
      font-size: 18px;
    }
    .collapse-item {
      float: left;
      width: 90%;
      height: auto;
      border: 1px solid #ccc;
      border-radius: 10px;
      line-height: 38px;
      padding: 0 20px 0 20px;
      box-sizing: border-box;
    }
    .collapse-title {
      float: left;
      height: 38px;
      line-height: 38px;
      margin: 0px 10px 0px 20px;
      font-size: 14px;
    }
    .el-checkbox {
      margin-left: 20px;
    }
    .avatar {
      position: absolute;
      right: 1%;
      top: 3%;
      width: 150px;
      height: 150px;
      text-align: center;
      img {
        width: 100px;
        height: 100px;
        border-radius: 10px;
        border: 2px solid #dfdfdf;
        margin-bottom: 10px;
      }
    }
    .clearfix {
      clear: both;
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
      width: 80px;
      height: 32px;
      border: none;
    }
    .tip {
      font-size: 12px;
      color: #999;
    }
    .submit-btn {
      width: 100%;
      text-align: right;
    }
  }
}
</style>


