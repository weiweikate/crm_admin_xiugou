<template>
    <div>
        <breadcrumb :nav='nav'></breadcrumb>
        <el-card>
            <div class="add-box">
                <el-form ref="form" :rules="rules" :model="form" label-width="100px">
                    <span class="add-box-title">基础信息</span>
                    <el-form-item prop="name" label="所在岗位">
                        <el-input style="width:220px" v-model="form.name" placeholder="请选择"></el-input>
                    </el-form-item>
                    <el-form-item prop="department" label="所属部门">
                        <el-select v-model="form.department" multiple placeholder="请选择">
                            <el-option v-for="item in department" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <hr width='90%' size='1' color='#ccc' class='add-box-sep'>
                    <span class="add-box-title">权限设置</span>
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
                    <el-form-item class="sub-btn">
                        <el-button size="medium" type="primary" @click="submitForm('form')">提交</el-button>
                        <el-button size="medium" @click="goBack">取消</el-button>
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
      nav: ["权限管理", "岗位权限管理", "添加岗位"],
      checkAllUser: [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],
      isIndeterminateUser: false,
      checkedUser: [[],[],[],[],[],[],[],[],[],[],],
      userManList: [],
      department: [],
      form: {
        department: [],
        name: "",
      },
      rules: {
        name: { required: true, message: "请选择所在岗位", trigger: "blur" },
        department: {
          required: true,
          message: "请选择所属部门",
          trigger: "blur"
        },
      }
    };
  },
  activated() {
    this.form.department =[];
    this.form.name = ''; 
    this.checkAllUser = [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
    this.getDepartmentList();
    this.getRoleList();
  },
  methods: {
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let data = {};
          let role = [];
          this.checkedUser.forEach((v,k)=>{
            v.forEach((val)=>{
              role.push(val);
            })
          })
          data.role = role.join(',');
          data.name = this.form.name;
          data.department = this.form.department.join(",");
          data.url = pApi.addRole;
          this.$axios
            .post(api.addRole, data)
            .then(res => {
              if(res.data.code == 200){
                  this.$message.success(res.data.data);
                  this.$router.push('/jobsPermissionMange');
              }else{
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
    },

    // 返回
    goBack() {
      this.$router.push('/jobsPermissionMange');
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
    getDepartmentList() {
      this.department = [];
      this.$axios
        .post(api.queryDepartmentList, {})
        .then(res => {
          if (res.data.code == 200) {
            res.data.data.forEach((v, k) => {
              this.department.push({ label: v.name, value: v.id });
            });
          } else {
            this.$message.warning(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
  }
};
</script>
<style lang="less">
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
    border-radius: 5px;
    line-height: 38px;
    padding: 0 10px 0 10px;
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
  .sub-btn {
    margin-top: 20px;
    padding-left: 30%;
    box-sizing: border-box;
  }
}
</style>


