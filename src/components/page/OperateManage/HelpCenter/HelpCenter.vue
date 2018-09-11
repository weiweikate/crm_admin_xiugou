<template>
  <div class="help-center">
    <v-breadcrumb :nav="nav"></v-breadcrumb>
    <el-card :body-style="{ padding: '30px 60px' }">
      <el-button v-if='p.addHelpType' type="primary" @click="addQuestionCate">添加问题类目</el-button>
      <el-table :data="tableData" border style='margin-top:20px' :height="height">
        <el-table-column prop="id" label="编号" align="center"></el-table-column>
        <el-table-column prop="name" label="问题类目" align="center"></el-table-column>
        <el-table-column label="图片" align="center">
            <template slot-scope="scope">
                <img :src="scope.row.imgUrl" alt="">
            </template>
        </el-table-column>
        <el-table-column prop="num" label="问题数量" align="center"></el-table-column>
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
      <el-dialog title="添加问题类目" :visible.sync="isShowAddQues" width="40%">
          <div class="add-item">
              <span>问题类型</span>
              <el-input v-model="questionType" class="input-sty" placeholder="请输入问题类型"></el-input>
          </div>
       <div class="add-item">
           <span>选择图片</span>
           <el-input readonly v-model="imgUrl" auto-complete="off"></el-input>
           <el-upload class="icon-uploader"
                      action="/admin/ossClient/aliyunOSSUploadImage"
                      :on-success="handleAvatarSuccess">
               <el-button size="small" type="primary"><i class="el-icon-upload"></i>上传</el-button>
           </el-upload>
       </div>
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
            // 权限控制
            p: {
                addHelpType: false,
                deleteHelpType: false,
                queryHelpQuestionPageList: false
            },
            operate: true,
            isShowAddQues: false,
            addQuesTypeBtn: false,
            tableData: [],
            height: '100vh',
            questionType: '',
            imgUrl: '',
            delId: '',
            delUrl: '',
            delUri: '',
            isShowDelToast: false
        };
    },
    activated() {
        this.height = window.screen.availHeight - 400;
        this.pControl();
        this.getList();
    },
    methods: {
    // 权限控制
        pControl() {
            for (const k in this.p) {
                this.p[k] = utils.pc(pApi[k]);
            }
            if (!this.p.deleteHelpType && !this.p.queryHelpQuestionPageList) {
                this.operate = false;
            }
        },
        // 获取数据
        getList() {
            const data = {
                page: this.page.currentPage,
                pageSize: this.page.pageSize
            };
            request.queryHelpTypePageList(data).then(res => {
                this.tableData = [];
                this.tableData = res.data.data;
                this.page.totalPage = res.data.totalNum;
            }).catch(error => {
                console.log(error);
            });
        },
        // 添加问题类目
        addQuestionCate() {
            this.isShowAddQues = true;
            this.questionType = '';
        },
        confirmAddQuesType() {
            this.addQuesTypeBtn = true;
            const data = {
                name: this.questionType,
                imgUrl: '34234234'
            };
            request.addHelpType(data).then(res => {
                // this.$message.success(res.data.msg);
                this.getList(this.page.currentPage);
                this.addQuesTypeBtn = false;
                this.isShowAddQues = false;
            }).catch(error => {
                console.log(error);
                this.addQuesTypeBtn = false;
                this.isShowAddQues = false;
            });
        },
        // 问题列表
        questionList(row) {
            sessionStorage.setItem('questionTypeId', row.id);
            this.$router.push({ name: 'questionList', query: { 'questionTypeId': row.id }});
        },
        // 删除用户
        deleteUser(row) {
            this.delId = row.id;
            this.delUrl = 'deleteHelpType';
            this.delUri = pApi.deleteHelpType;
            this.isShowDelToast = true;
        },
        deleteToast(msg) {
            this.isShowDelToast = msg;
            this.getList(this.page.currentPage);
        },
        // 上传图片
        handleAvatarSuccess(res, file) {
            this.imgUrl = res.data.imageUrl;
        }
    }
};
</script>
<style lang='less'>
.help-center {
    img{
        width: 38px;
        height: 38px;
        border-radius: 5px;
        vertical-align: middle;
    }
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
      .el-input--small,.el-input__inner{
          width: 200px;
      }
  }
    .add-item{
        height: 40px;
        line-height: 40px;
    }

    .el-dialog .el-upload--text {
        width: 100px;
        height: 40px;
        border: none;
    }
    .icon-uploader {
        float: right;
        height: 33px;
    }
    .icon-uploader .el-button--small {
        border-radius: 5px;
        width: 100px;
    }
    .el-upload--text .el-icon-upload {
        line-height: 0;
        margin: 0;
        color: #fff;
        font-size: 14px;
    }
    .el-upload-list {
        display: none;
    }
}
</style>
