<template>
    <div class="topic-list">
        <v-breadcrumb :nav="['运营管理','专题管理']"></v-breadcrumb>
        <el-card :body-style="{ padding: '20px 40px' }">
            <el-button v-if='p.operateTpl' @click="addTopic" type="primary" style="margin-bottom:20px">添加专题</el-button>
            <el-button @click="topicTemplate" type="success" style="margin-bottom:20px">专题模板</el-button>
            <el-table border v-loading="tableLoading" :data="tableData">
                <el-table-column type="index" label="序号" align="center"></el-table-column>
                <el-table-column prop="name" label="专题名称" align="center"></el-table-column>
                <el-table-column prop="id" label="专题ID" align="center"></el-table-column>
                <el-table-column label="发布时间" align="center">
                    <template slot-scope="scope">{{scope.row.createTime|formatDate}}</template>
                </el-table-column>
                <el-table-column prop="topicTemplateId" label="活动模板" align="center"></el-table-column>
                <el-table-column prop="productCount" label="产品数" align="center"></el-table-column>
                <el-table-column prop="createAdmin" label="创建者" align="center"></el-table-column>
                <el-table-column v-if='p.operateTpl' label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button @click='editItem(scope.row)' type="primary">编辑</el-button>
                        <!--<el-button @click='preview(scope.row.id)' type="success">预览</el-button>-->
                        <el-button type="warning" @click="del(scope.row.id)">删除</el-button>
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
                    :page-size="20"
                    :total="page.totalPage">
                </el-pagination>
            </div>
        </el-card>
        <deletetoast :id="delId" :url="delUrl" :status="3" @msg="deleteToast" v-if="isShowDel"></deletetoast>
    </div>
</template>

<script>
    import vBreadcrumb from "../../../common/Breadcrumb.vue"
    import deletetoast from "../../../common/DeleteToast"
    import utils from "@/utils/index.js";
    import moment from 'moment';
    import * as api from '@/api/OperateManage/topicManage.js'
    import * as pApi from '@/privilegeList/OperateManage/topicManage.js';
    import { myMixinTable } from '@/JS/commom';
    export default {
        components: {
            vBreadcrumb,
            deletetoast
        },
        mixins:[myMixinTable],

        data() {
            return {
                p:{
                    operateTpl:false
                },
                isAddBanner: false,
                formLabelWidth: "130px",
                tableLoading:false,
                tableData: [], // { id: 1,img:'src/assets/images/avatar.jpg' }
                page: {
                    currentPage: 1,
                    totalPage: 1
                },
                delUrl: '', // 删除接口地址
                delId: '', // id
                isShowDel: false,
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
                let data={
                    page:this.page.currentPage,
                };
                this.tableLoading = true;
                this.$axios.post(api.topicList, data).then((res) => {
                    if (res.data.code == 200) {
                        this.tableData = [];
                        this.tableData = res.data.data.data;
                        this.page.totalPage = res.data.data.resultCount;
                    } else {
                        this.$message.warning(res.data.msg);
                    }
                    this.tableLoading = false;
                }).catch(err => {
                    console.log(err);
                    this.tableLoading = false;
                });
            },
            // 删除专题
            del(val) {
                this.delUrl = api.deleteTopic;
                this.delId = val;
                this.isShowDel = true
            },
            deleteToast(msg) {
                this.isShowDel = msg;
                this.getList()
            },
            //编辑
            editItem(row){
                sessionStorage.setItem('topicId',row.id);
                this.$router.push({name:'addProject',query:{topicId:row.id}})
            },
            //预览
            preview(id){
                sessionStorage.setItem('topicId',id);
                this.$router.push({path:'/topicPreview',query:{topicId:id}})
            },
            //添加
            addTopic(){
                sessionStorage.setItem('topicId','add');
                this.$router.push({name:'addProject',query:{topicId:'add'}})
            },
            //专题模板
            topicTemplate(){
                this.$router.push('/topicTemplate')
            }
        }
    };
</script>
<style lang='less'>
    .topic-list {
        .el-dialog__header {
            border-bottom: 1px solid #ccc;
            .el-dialog__title {
                color: #ff4e4e;
                font-weight: 700;
            }
        }
        img {
            width: 94px;
            height: 94px;
            background-color: #ffffff;
            border-radius: 4px;
            border: solid 2px #dddddd;
        }
        .input-style {
            width: 260px;
        }
        .el-input__suffix {
            line-height: 24px;
        }
        .icon-uploader {
            float: right;
            margin-right: 31px;
            height: 33px;
        }
        .icon-uploader .el-button--small {
            border-radius: 5px;
            width: 100px;
        }
        .el-upload--text {
            width: 100px;
            height: 40px;
            border: none;
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
        .img {
            width: 200px;
            height: 100px;
        }
        .tip {
            color: #ff4e4e;
            font-size: 12px;
            sortRank: absolute;
            left: 0;
            top: 80%;
        }
        .block {
            margin: 10px 0px;
        }
        /*弹窗样式*/
        .el-dialog {
            width: 530px;
            border-radius: 10px;
        }
        .el-dialog__header {
            border-bottom: 1px solid #eee;
            padding: 20px 20px 10px 50px;
        }
        .el-dialog__title {
            color: #ff6868;
        }
        .el-dialog .el-input {
            display: inline;
        }
        .el-dialog .el-input__inner {
            width: 360px;
        }
        .el-select .el-input__inner {
            width: 200px;
        }
        .el-dialog .el-upload--text {
            width: 100px;
            height: 40px;
            border: none;
        }
        .icon-area .el-input__inner {
            width: 240px;
        }
        .el-input__suffix {
            line-height: 24px;
        }
        .icon-uploader {
            float: right;
            margin-right: 31px;
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
        .el-dialog__footer {
            margin-right: 30px;
        }
        .el-upload-list {
            display: none;
        }
        .inf-area{
            margin:-10px 0 10px 100px;
            .tips{
                color: #ff6868;
            }
        }
    }
</style>
