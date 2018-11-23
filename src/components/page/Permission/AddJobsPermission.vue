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
import breadcrumb from '@/components/common/Breadcrumb';
export default {
    components: {
        breadcrumb
    },
    data() {
        return {
            nav: ['权限管理', '岗位权限管理', '添加岗位'],
            authList: [],
            department: [],
            form: {
                department: [],
                name: ''
            },
            rules: {
                name: { required: true, message: '请选择所在岗位', trigger: 'blur' },
                department: {
                    required: true,
                    message: '请选择所属部门',
                    trigger: 'blur'
                }
            }
        };
    },
    activated() {
        this.form.department = [];
        this.form.name = '';
        this.getRoleList();
    },
    methods: {
        // 提交表单
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 返回
        goBack() {
            this.$router.push('/jobsPermissionMange');
        },
        // 获取部门列表
        getDepartmentList() {
            this.department = [];
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


