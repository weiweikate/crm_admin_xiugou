<template>
    <div class="add-manger">
        <breadcrumb :nav='nav'></breadcrumb>
        <el-card>
            <div class="add-box">
                <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                    <span class="add-box-title">基础信息</span>
                    <el-form-item prop="username" label="姓名">
                        <el-input class="add-mange-inp" v-model="form.username"></el-input>
                    </el-form-item>
                    <el-form-item prop="phone" label="手机号">
                        <el-input class="add-mange-inp" v-model="form.phone"></el-input>
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
                    <el-form-item prop="departmentId" label="所属部门">
                        <el-select v-model="form.departmentId" @change="getJobList" placeholder="请选择">
                            <el-option v-for="item in department" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="jobId" label="所在岗位">
                        <el-select v-model="form.jobId" placeholder="请选择">
                            <el-option v-for="item in jobList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="superior" label="直接上级">
                        <el-input class="add-mange-inp" v-model="form.superior"></el-input>
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
                      <el-button type="primary" @click="submitForm('form')" style="margin-left:35%">提交</el-button>
                      <el-button @click="resetForm('form')">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </div>
</template>
<script>
import breadcrumb from "../../common/Breadcrumb";
import * as api from "../../../api/api.js";
import * as pApi from '../../../privilegeList/index.js';
export default {
  components: {
    breadcrumb
  },
  data() {
    return {
      nav: ["权限管理", "创建账号"],
      checkAllUser: [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
      checkedUser: [[],[],[],[],[],[],[],[],[],[],[]],
      uploadImg:'',
      userManList: [],
      department: [],
      jobList:[],
      form: {
        username: "",
        phone: "",
        departmentId: [],
        jobId: "",
        superior: "",
        face: ""
      },
      rules:{
        username:[{ required: true, message: '请输入姓名', trigger: 'blur' }],
        phone:[{ required: true, message: '请输入手机号', trigger: 'blur' }],
        departmentId:[{ required: true, message: '请输入所属部门', trigger: 'blur' }],
        jobId:[{ required: true, message: '请输入所在岗位', trigger: 'blur' }],
        superior:[{required: true, message: '请输入直接上级ID', trigger: 'blur' },],
      }
    };
  },
  activated(){
    this.form = {};
    this.checkedUser = [[],[],[],[],[],[],[],[],[],[],[]];
    this.checkAllUser = [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
    console.log(123);
    this.uploadImg = api.addImg;
    this.getRoleList();
    this.getDepartmentList();
  },
  methods: {
    //提交表单
    submitForm(formName){
      let data= {};
      let role = [];
      let reg = /^1(3|4|5|6|7|8)\d{9}$/;
      if(!reg.test(parseInt(this.form.phone))){
        this.$message.warning('请输入正确的手机号！');
        return;
      }
      this.checkedUser.forEach((v,k)=>{
        v.forEach((val)=>{
          role.push(val);
        })
      })
      data = this.form;
      data.role = role.join(',');
      data.url = pApi.addAdminUser;
      this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$axios
            .post(api.addManger, data)
            .then(res => {
              if(res.data.code == 200){
                this.$message.success(res.data.data);
                this.$router.push('/manageList');
              }else{
                this.$message.warning(res.data.msg);
              }
            })
            .catch(err => {
              console.log(err);
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
      if(res.code == 200){
        this.form.face = res.data.imageUrl;
      }else{
        this.$message.warning(res.msg);
      }
    },

    // 全选用户管理
    handleCheckAllChangeUser(val,k) {
      let tmp = [];
      this.userManList[k].value.forEach(function(v) {
        v.value.forEach(function (val) {  
          tmp.push(val.id);
        })
      });
      this.checkedUser[k] = val ? tmp : [];
    },
    handleCheckedUserChange(value,k) {
      let itemTmp = [];
      let checkedCount = value.length;
      this.userManList[k].value.forEach(function(v) {
        v.value.forEach(function (val) {  
          itemTmp.push(val.value);
        })
      });
      this.checkAllUser[k] = checkedCount == itemTmp.length;
      this.$set(this.checkAllUser, k, this.checkAllUser[k]);
    },

    // 获取权限列表
    getRoleList() {
      let data = {};
      this.$axios
        .post(api.getRoleList, data)
        .then(res => {
          this.userManList = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 获取部门列表
    getDepartmentList(){
      this.department = [];
      this.$axios
        .post(api.queryDepartmentList, {})
        .then(res => {
          if(res.data.code == 200){
            res.data.data.forEach((v,k)=>{
              this.department.push({label:v.name,value:v.id});
            })
          }else{
            this.$message.warning(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取岗位列表
    getJobList(val){
      this.jobList = [];
      this.$axios
        .post(api.queryJobList, {dId:val})
        .then(res => {
          if(res.data.code == 200){
            res.data.data.forEach((v,k)=>{
              this.jobList.push({label:v.name,value:v.id});
            })
          }else{
            this.$message.warning(res.data.msg);
          }
        })
        .catch(err => {
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


