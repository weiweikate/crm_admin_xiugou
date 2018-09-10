<template>
    <div>
        <breadcrumb :nav='nav'></breadcrumb>
        <el-card>
            <el-button v-if="p.addRole" type='primary' @click="addRole">添加岗位</el-button>
            <el-table v-loading="tableLoading" class="w-table" stripe :data="tableData" :height="height" border style="width: 100%">
                <el-table-column prop="id" label="ID" width="180" align="center"></el-table-column>
                <el-table-column prop="rname" label="角色名称" align="center"></el-table-column>
                <el-table-column prop="dname" label="部门" align="center"></el-table-column>
                <el-table-column v-if="isShowOperate" label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button v-if="p.updateRole" type="warning" @click='editRole(scope.row)'>编辑</el-button>
                        <el-button v-if="p.deleteRole" type="danger" @click="deleteRole(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="block">
                <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="page.currentPage"
                    layout="total, prev, pager, next, jumper"
                    :total="page.totalPage">
                </el-pagination>
            </div>
        </el-card>
        <delete-toast :id='delId' :url='delUrl' :uri='delUri' @msg='deleteToast' v-if="isShowDelToast"></delete-toast>
    </div>
</template>
<script>
import breadcrumb from "../../common/Breadcrumb";
import deleteToast from "../../common/DeleteToast";
import * as api from "../../../api/api.js";
import utils from '../../../utils/index.js'
import * as pApi from '../../../privilegeList/index.js';
import { myMixinTable } from '@/JS/commom';
export default {
  components: {
    breadcrumb,
    deleteToast
  },
  mixins:[myMixinTable],
  data() {
    return {
      // 权限控制
      p:{
        addRole:false,
        updateRole:false,
        deleteRole:false,
      },
      isShowOperate:true,

      nav: ["岗位管理", "岗位权限管理"],
      tableLoading: false,
      isShowDelToast: false,
      departmentId:'',
      delId: 66,
      delUrl: "http://api",
      delUri:'',
      tableData: [],
    };
  },
  created() {
    let winHeight = window.screen.availHeight - 360;
    this.height = winHeight;
    this.pControl();
  },
  activated(){
    this.departmentId = this.$route.params.id || sessionStorage.getItem('jobsPermissionMangeId');
    this.pControl();
    this.getList(this.page.currentPage);
  },
  methods: {
    // 权限控制
    pControl() {
      for (const k in this.p) {
        this.p[k] = utils.pc(pApi[k]);
      }
      if (!this.p.updateRole && !this.p.deleteRole) {
        this.isShowOperate = false;
      }
    },
    //获取列表
    getList(val) {
      let that = this;
      let data = {};
      data.id = this.departmentId;
      data.page = val;
      data.url = pApi.jobsPermissionMange;
      this.tableLoading = true;
      this.$axios
        .post(api.queryRolePageList, data)
        .then(res => {
          that.tableLoading = false;
          if(res.data.code == 200){
            this.tableData = [];
            this.tableData = res.data.data.data;
            this.page.totalPage = res.data.data.resultCount;
          }else{
            this.$message.warning(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
          that.tableLoading = false;
        });
    },

    // 添加角色
    addRole(){
        this.$router.push('addJobsPermission');
    },

    // 编辑角色
    editRole(row){
        sessionStorage.setItem('editJobsPermission',row.id);
        this.$router.push({name:'editJobsPermission',params:{userId:row.id}});
    },

    // 删除模板
    deleteRole(row) {
      this.delId = row.id;
      this.delUrl = api.deleteRole;
      this.delUri = pApi.deleteRole;
      this.isShowDelToast = true;
    },
    deleteToast(msg) {
      this.getList(this.page.currentPage);
      this.isShowDelToast = msg;
    }
  }
};
</script>
<style lang="less">
.w-table {
  margin-top: 10px;
}
.block {
  float: right;
  margin: 10px 0 10px 0;
}
.el-dialog__title {
  color: #ff6868;
}
.rootscode-inp {
  width: 215px;
}
.el-dialog__header {
  border-bottom: 1px solid #eee;
  padding: 20px 20px 10px 50px;
}
</style>


