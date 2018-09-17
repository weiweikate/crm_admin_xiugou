<template>
  <div class="question-list">
    <v-breadcrumb :nav="nav"></v-breadcrumb>
    <el-card :body-style="{ padding: '30px 60px' }">
      <el-button type="primary" @click="addQuestion">添加问题</el-button>
      <el-table :data="tableData" border style='margin-top:20px' :height="height">
        <el-table-column prop="id" label="编号" align="center"></el-table-column>
        <el-table-column prop="title" label="问题标题" align="center"></el-table-column>
        <el-table-column prop="helpYesNum" label="反馈有用" align="center"></el-table-column>
        <el-table-column prop="helpNoNum" label="反馈没用" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click='showQuestionInfo(scope.row)' type="primary">查看详情</el-button>
            <el-button @click="editQuestion(scope.row)" type="warning">编辑</el-button>
            <el-button @click="deleteUser(scope.row)" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page.currentPage"
            :page-size="page.pageSize"
            layout="total, prev, pager, next, jumper"
            :total="page.totalPage">
        </el-pagination>
      </div>
      <delete-toast :id='delId' :url='delUrl' :uri='delUri' @msg='deleteToast' v-if="isShowDelToast"></delete-toast>
    </el-card>
  </div>
</template>

<script>
import vBreadcrumb from '@/components/common/Breadcrumb.vue';
import deleteToast from '@/components/common/DeleteToast';
import * as pApi from '@/privilegeList/OperateManage/HelpCenter/index.js';
import utils from '@/utils/index.js';
import { myMixinTable } from '@/JS/commom';
import request from '@/http/http.js';

export default {
    components: { vBreadcrumb, deleteToast },
    mixins: [myMixinTable],

    data() {
        return {
            nav: ['运营管理', '帮助中心管理'],
            questionTypeId: '',
            tableData: [],
            height: '100vh',
            delId: '',
            delUrl: '',
            delUri: '',
            isShowDelToast: false
        };
    },

    activated() {
        this.height = window.screen.availHeight - 400;
        this.questionTypeId = this.$route.query.questionTypeId || sessionStorage.getItem('questionTypeId');
        this.getList();
    },

    methods: {
        // 获取数据
        getList() {
            const data = {
                typeid: this.questionTypeId,
                page: this.page.currentPage,
                pageSize: this.page.pageSize
            };
            request.queryHelpQuestionPageList(data).then(res => {
                this.tableData = [];
                this.tableData = res.data.data;
                this.page.totalPage = res.data.totalNum;
            }).catch(err => {
                console.log(err);
            });
        },
        // 添加问题
        addQuestion() {
            this.$router.push({ name: 'addQuestion', query: { questionTypeId: this.questionTypeId }});
        },
        // 编辑问题
        editQuestion(row) {
            sessionStorage.setItem('questionId', row.id);
            this.$router.push({ name: 'editQuestion', query: { questionTypeId: this.questionTypeId, questionId: row.id }});
        },
        // 查看问题详情
        showQuestionInfo(row) {
            sessionStorage.setItem('questionInfo', row.id);
            this.$router.push({ name: 'questionInfo', query: { 'questionInfo': row.id }});
        },
        // 删除
        deleteUser(row) {
            this.delId = row.id;
            this.delUrl = 'deleteHelpQuestion';
            this.delUri = pApi.deleteHelpQuestion;
            this.isShowDelToast = true;
        },
        deleteToast(msg) {
            this.isShowDelToast = msg;
            this.getList(this.page.currentPage);
        }
    }
};
</script>
<style lang='less' scoped>
.question-list {
  .input-sty {
    width: 210px;
  }
  .block {
    float: right;
    margin: 10px 0 10px 0;
  }
}
</style>
