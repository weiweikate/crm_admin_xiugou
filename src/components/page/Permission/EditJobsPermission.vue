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
                      {{departmentName}}
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
                                <div style="overflow:hidden;margin-bottom:10px">
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
                        <el-button size="medium" @click="goBack">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </div>
</template>
<script>
import breadcrumb from "../../common/Breadcrumb";
import * as api from "../../../api/api.js";
import * as pApi from "../../../privilegeList/index.js";
export default {
  components: {
    breadcrumb
  },
  data() {
    return {
      nav: ["权限管理", "岗位权限管理", "编辑岗位"],
      checkAllUser: [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false
      ],
      isIndeterminateUser: false,
      checkedUser: [[], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
      userManList: [],
      getUserPriList: [],
      id: "",
      departmentName:'',
      form: {
        department: [],
        name: ""
      },
      rules: {
        name: { required: true, message: "请选择所在岗位", trigger: "blur" },
      }
    };
  },
  created(){
    this.getCreatedMsg();
  },
  activated() {
    this.getCreatedMsg();
  },
  methods: {
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let data = {};
          let role = [];
          this.checkedUser.forEach((v, k) => {
            v.forEach(val => {
              role.push(val);
            });
          });
          data.role = role.join(",");
          data.id = this.id;
          data.name = this.form.name;
          data.url = pApi.updateRole;
          this.$axios
            .post(api.updateRole, data)
            .then(res => {
                this.$message.success(res.data.data);
                this.$router.push("/jobsPermissionMange");
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

    // 组装权限列表数据
    assemblyData() {
      let that = this;
      this.checkedUser = [];
      for (let i = 0; i < this.userManList.length + 1; i++) {
        this.checkedUser.push([]);
      }
      this.userManList.forEach((v1, k1) => {
        let arrLength = 0;
        v1.value.forEach((v2, k2) => {
          v2.value.forEach((v3, k3) => {
            arrLength++;
            if (that.getUserPriList.indexOf(v3.id) != -1) {
              that.checkedUser[k1].push(v3.id);
            }
          });
        });
        if (arrLength == that.checkedUser[k1].length) {
          that.checkAllUser[k1] = true;
        }
      });
    },

    // 全选用户管理
    handleCheckAllChangeUser(val, k) {
      let tmp = [];
      this.userManList[k].value.forEach(function(v) {
        v.value.forEach(function(val) {
          tmp.push(val.id);
        });
      });
      this.checkedUser[k] = val ? tmp : [];
    },
    handleCheckedUserChange(value, k) {
      let itemTmp = [];
      let checkedCount = value.length;
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
    // created
    getCreatedMsg() {
      this.getRoleList();
      (this.checkAllUser = [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false
      ]),
        (this.id =
          this.$route.params.userId ||
          sessionStorage.getItem("editJobsPermission"));
      this.$axios
        .post(api.findRoleById, { id: this.id })
        .then(res => {
          if (res.data.code == 200) {
            this.form.department = [];
            this.getUserPriList = [];
            this.form.name = res.data.data.name;
            this.departmentName = res.data.data.deptmentName;
            res.data.data.rolePrivilegeList.forEach((v, k) => {
              this.getUserPriList.push(v.privilegeId);
            });
            let that=this;
            setTimeout(function () {
                that.assemblyData();
            },500)
          } else {
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
    font-size: 14px;
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


