<template>
  <div class="help-center">
    <v-breadcrumb :nav="nav"></v-breadcrumb>
    <el-card :body-style="{ padding: '30px 60px' }">
      <el-button v-if='p.addHelpType' type="primary" @click="addQuestionCate">添加问题类目</el-button>
      <el-table :data="tableData" border style='margin-top:20px' :height="height">
        <el-table-column prop="id" label="编号" align="center"></el-table-column>
        <el-table-column prop="name" label="问题类目" align="center"></el-table-column>
        <el-table-column prop="problemNum" label="问题数量" align="center"></el-table-column>
        <el-table-column v-if='operate' label="操作" align="center">
          <template slot-scope="scope">
            <el-button v-if='p.queryHelpQuestionPageList' type="primary" @click="questionList(scope.row)">问题列表</el-button>
            <el-button v-if='p.deleteHelpType' type="danger" @click="deleteUser(scope.row)">删除</el-button>
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
      <el-dialog title="添加问题类目" :visible.sync="isShowAddQues" width="30%">
        <span>问题类型</span>
        <el-input v-model="questionType" class="input-sty" placeholder="请输入问题类型"></el-input>
        <span slot="footer">
          <el-button type="primary" :loading="addQuesTypeBtn" @click="confirmAddQuesType">确 定</el-button>
          <el-button @click="isShowAddQues = false">取 消</el-button>
        </span>
      </el-dialog>
      <delete-toast :id='delId' :url='delUrl' :uri='delUri' @msg='deleteToast' v-if="isShowDelToast"></delete-toast>
    </el-card>
  </div>
</template>

<script>
import vBreadcrumb from "@/components/common/Breadcrumb.vue";
import deleteToast from "@/components/common/DeleteToast";
import * as api from '@/api/OperateManage/HelpCenter/index.js';
import * as pApi from "@/privilegeList/OperateManage/HelpCenter/index.js";
import utils from '@/utils/index.js';
import { myMixinTable } from '@/JS/commom';
export default {
  components: { vBreadcrumb,deleteToast },

  mixins:[myMixinTable],

  data() {
    return {
      nav: ["运营管理", "帮助中心管理"],
      // 权限控制
      p: {
        addHelpType:false,
        deleteHelpType:false,
        queryHelpQuestionPageList:false,
      },
      operate:true,
      isShowAddQues:false,
      addQuesTypeBtn:false,
      tableData: [],
      height:'100vh',
      questionType:'',
      delId:'',
      delUrl:'',
      delUri:'',
      isShowDelToast:false
    };
  },
  activated(){
    this.height = window.screen.availHeight-400;
    this.pControl();
    this.getList();
  },
  methods: {
    // 权限控制
    pControl() {
      for (const k in this.p) {
        this.p[k] = utils.pc(pApi[k]);
      }
      if(!this.p.deleteHelpType && !this.p.queryHelpQuestionPageList){
        this.operate = false;
      }
    },
    // 获取数据
    getList(){
      this.$axios.post(api.queryHelpTypePageList,{})
      .then((res) => {
        this.tableData = [];
        this.tableData = res.data.data.data;
        this.page.totalPage = res.data.data.resultCount
      }).catch((err) => {
        console.log(err);
      });
    },
    // 添加问题类目
    addQuestionCate(){
      this.isShowAddQues = true;
      this.questionType = '';
    },
    confirmAddQuesType(){
      let that = this;
      this.addQuesTypeBtn = true;
      this.$axios.post(api.addHelpType,{name:this.questionType})
      .then((res) => {
        this.$message.success(res.data.msg);
        this.getList(this.page.currentPage);
        this.addQuesTypeBtn = false;
        this.isShowAddQues = false;
      }).catch((err) => {
        console.log(err);
        this.addQuesTypeBtn = false;
        this.isShowAddQues = false;
      });
    },
    // 问题列表
    questionList(row){
      sessionStorage.setItem('questionTypeId',row.id);
      this.$router.push({name:'questionList',query:{'questionTypeId':row.id}});
    },
    // 删除用户
    deleteUser(row){
      this.delId = row.id;
      this.delUrl = api.deleteHelpType;
      this.delUri = pApi.deleteHelpType;
      this.isShowDelToast = true;
    },
    deleteToast(msg) {
      this.isShowDelToast = msg;
      this.getList(this.page.currentPage);
    },
  }
};
</script>
<style lang='less'>
.help-center {
  .input-sty{
    width: 210px;
  }
  .block {
    float: right;
    margin: 10px 0 10px 0;
  }
  .el-dialog{
    border-radius:10px;
    .el-dialog__header{
      border-bottom: 1px solid #dfdfdf;
      .el-dialog__title{
        color: #ff4e4e;
      }
    }
  }
}
</style>