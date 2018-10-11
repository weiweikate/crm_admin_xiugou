<template>
    <div class="second-classify">
        <v-breadcrumb :nav="['运营管理','标签管理','产品品类','产品标签类型设置']"></v-breadcrumb>
        <div class="table-block">
            <el-button type="primary" style="margin-bottom: 20px" @click="addClassify">添加产品标签类型</el-button>
            <template>
                <el-table :data="tableData" border style="width: 100%">
                    <el-table-column type="index" label="编号" align="center"></el-table-column>
                    <el-table-column prop="name" label="类型" align="center"></el-table-column>
                    <el-table-column prop="tagNum" label="标签数" align="center">
                        <template slot-scope="scope">{{scope.row.tagNum||0}}</template>
                    </el-table-column>
                    <el-table-column  label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button type="danger" :disabled="scope.row.tagNum>0" size="small" @click="delItem(scope.row.id)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
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
        </div>

        <!--添加弹窗-->
        <el-dialog :title="title" :visible.sync="addMask">
            <el-form v-model="form">
                <el-form-item label="类型名称" :label-width="formLabelWidth">
                    <el-input v-model="form.name" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addOrEdit('form')">确 认</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
        <!--删除弹窗-->
        <delete-toast :id='delId' :url='delUrl' :uri='delUri' @msg='deleteToast' v-if="isShowDelToast"></delete-toast>
    </div>
</template>

<script>
import vBreadcrumb from '@/components/common/Breadcrumb.vue';
import icon from '@/components/common/ico.vue';
import deleteToast from '@/components/common/DeleteToast';
import utils from '@/utils/index.js';
import * as pApi from '@/privilegeList/index.js';
import { myMixinTable } from '@/JS/commom';
import request from '@/http/http.js';

export default {
    components: {
        vBreadcrumb,
        icon,
        deleteToast
    },
    mixins: [myMixinTable],
    data() {
        return {

            tableData: [],
            height: '',
            addMask: false,
            isShowDelToast: false,
            formLabelWidth: '100px',
            form: {
                name: ''
            },
            title: '添加标签类型',
            id: '',
            delId: 66,
            delUrl: 'http://api',
            delUri: ''
        };
    },
    created() {
    },
    activated() {
        this.getList(this.page.currentPage);
    },
    methods: {
        // 获取列表
        getList(val) {
            const data = {
                page: val,
                pageSize: this.page.pageSize
            };
            request.querySysTagTypePageList(data).then(res => {
                this.tableData = [];
                this.tableData = res.data.data;
                this.page.totalPage = res.data.totalNum;
            }).catch(error => {
                console.log(error);
            });
        },
        // 添加
        addClassify() {
            this.addMask = true;
            this.form.name = '';
        },
        // 添加确定
        addOrEdit(formName) {
            const data = this[formName];
            if (!data.name) {
                this.$message.warning('请输入类型名称!');
                return;
            }
            this.btnLoading = true;
            request.addSysTagType(data).then(res => {
                this.$message.success(res.msg);
                this.btnLoading = false;
                this.addMask = false;
                this.getList(this.page.currentPage);
            }).catch(error => {
                console.log(error);
            });
        },
        // 删除
        delItem(id) {
            this.delId = id;
            this.delUrl = 'updateSysTagTypeStatusById';
            this.isShowDelToast = true;
        },
        // 删除弹窗
        deleteToast(msg) {
            this.isShowDelToast = msg;
            this.getList(this.page.currentPage);
        },
        // 取消
        cancel() {
            this.addMask = false;
            this.getList(this.page.currentPage);
        }
    }
};
</script>

<style lang="less">
    .second-classify {
        /*表格样式*/
        .table-block {
            padding: 20px 20px 60px;
            background: #fff;
        }
        img {
            width: 38px;
            height: 38px;
            border-radius: 5px;
            vertical-align: middle;
        }
        .block {
            float: right;
            margin-top: 10px;
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
    }
</style>
