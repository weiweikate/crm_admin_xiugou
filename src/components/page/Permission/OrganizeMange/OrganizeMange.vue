<template>
    <div class="organize-mange">
        <breadcrumb :nav='nav'></breadcrumb>
        <el-card>
            <el-button v-if='p.addDepartment' @click="operateDepartment('add')" type="primary" class='add'>添加部门</el-button>
            <el-table border :data="tableData">
                <el-table-column prop="id" label="部门编号" align="center" min-width="150"></el-table-column>
                <el-table-column prop="name" label="部门名称" align="center" min-width="150"></el-table-column>
                <el-table-column prop="manager" label="负责人" align="center" min-width="150"></el-table-column>
                <el-table-column label="操作" align="center" min-width="250">
                    <template slot-scope="scope">
                        <el-button v-if='p.updateDepartment' @click="operateDepartment('edit',scope.row)" type="primary">编辑</el-button>
                        <el-button @click="goToJobMange(scope.row)" type="warning">岗位管理</el-button>
                    </template>
                </el-table-column> 
            </el-table>
        </el-card>
        <el-dialog :title="dialogTitle" :visible.sync="isShowDialog" width="30%">
            <div style="width:100%">
                <el-form :model="diaForm" ref="diaForm" :rules="rules" label-width='90px' inline label-position='right' style="width:300px;margin:0 auto">
                    <el-form-item prop="departmentName" label="部门名称">
                        <el-input v-model="diaForm.departmentName"></el-input>
                    </el-form-item>
                    <el-form-item prop="departmentManger" label="部门负责人">
                        <el-input v-model="diaForm.departmentManger"></el-input>
                    </el-form-item>
                    <el-form-item prop="departmentNote" label="备注说明">
                        <el-input type="textarea" autosize v-model="diaForm.departmentNote"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer">
                <el-button @click="confirmForm('diaForm')" type="primary">确 定</el-button>
                <el-button @click="resetForm('diaForm')">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import breadcrumb from "../../../common/Breadcrumb";
import * as api from "../../../../api/api.js";
import * as pApi from "../../../../privilegeList/index.js";
import utils from "../../../../utils/index.js";
export default {
  components: {
    breadcrumb
  },
  data() {
    return {
        // 权限控制
      p:{
        addDepartment:false,
        updateDepartment:false,
      },
      isShowOperate:true,

      nav: ["权限管理", "组织结构管理"],
      isShowDialog :false,
      dialogTitle:'',
      diaForm:{
          departmentName:'',
          departmentManger:'',
          departmentNote:''
      },
      formType:'add',
      departId:'',
      rules:{
          departmentName:[{ required: true, message: '请输入部门名称', trigger: 'blur' }],
      },
      tableData: [{ id: 123 }],
    };
  },
  activated() {
    this.getList();
    this.pControl();
  },
  methods: {
    // 权限控制
    pControl() {
      for (const k in this.p) {
        this.p[k] = utils.pc(pApi[k]);
      }
    },
    // 获取数据
    getList() {
        let data = {};
        data.url = pApi.queryDepartmentList;
        this.$axios.post(api.queryDepartmentList,data)
        .then(res=>{
            if(res.data.code == 200){
                this.tableData = [];
                this.tableData = res.data.data;
            }else{
                this.$message.warning(res.data.msg);
            }
        })
        .catch(err=>{
            console.log(err);
        })
    },

    // 添加/编辑部门
    operateDepartment(type,row){
        this.formType = type;
        utils.cleanFormData(this.diaForm);
        if(type == 'add'){
            this.dialogTitle = '添加部门';
            this.isShowDialog = true;
        }else{
            this.dialogTitle = '编辑部门';
            this.departId = row.id;
            this.$axios.post(api.findDepartmentById,{id:row.id})
            .then(res=>{
                if(res.data.code == 200){
                    this.diaForm.departmentName = res.data.data.name;
                    this.diaForm.departmentManger = res.data.data.manager;
                    this.diaForm.departmentNote = res.data.data.remark;
                    this.isShowDialog = true;
                }else{
                    this.$message.warning(res.data.msg);
                }
            })
            .catch(err=>{
                console.log(err)
            })
        }
    },
    confirmForm(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let data = {};
            data.name = this.diaForm.departmentName;
            data.manager = this.diaForm.departmentManger;
            data.remarks = this.diaForm.departmentNote;
            let url = '';
            if(this.formType == 'add'){
                url = api.addDepartment;
                data.url = pApi.addDepartment;
            }else{
                url = api.updateDepartment;
                data.url = pApi.updateDepartment;
                data.id = this.departId;
            }
            this.$axios.post(url,data)
            .then(res=>{
                if(res.data.code == 200){
                    this.$message.success(res.data.data);
                    this.resetForm(formName);
                    this.getList();
                }else{
                    this.$message.warning(res.data.msg);
                }
            })
            .catch(err=>{
                this.resetForm(formName);
                console.log(err);
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
    // 重置表单
    resetForm(formName) {
        this.$refs[formName].resetFields();
        this.isShowDialog = false;
    },
    // 跳转岗位权限
    goToJobMange(row){
        sessionStorage.setItem('jobsPermissionMangeId',row.id);
        this.$router.push({name:'jobsPermissionMange',params:{id:row.id}});
    }
  }
};
</script>
<style lang='less'>
.organize-mange{
    .el-dialog{
        border-radius: 10px;
    }
    .el-dialog__header{
        border-bottom: 1px solid #ff6868;
        .el-dialog__title{
            color: #ff6868;
        }
    }
    .add{
        margin-bottom: 10px;
    }
    .block {
        margin: 10px 0;
        float: right;
    }
}
</style>


