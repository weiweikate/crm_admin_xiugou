<template>
    <div class="second-classify">
        <v-breadcrumb :nav="['品牌产品管理','产品分类管理',name]"></v-breadcrumb>
        <div class="table-block">
            <el-button type="primary" style="margin-bottom: 20px" @click="addClassify">添加详细参数</el-button>
            <template>
                <el-table :data="tableData" :height="height" border style="width: 100%">
                    <el-table-column type="index" label="编号" align="center"></el-table-column>
                    <el-table-column prop="name" label="参数名称" align="center"></el-table-column>
                    <el-table-column min-width="160" label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button type="danger" size="small" @click="delItem(scope.row.id)">删除</el-button>
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
                    layout="total, prev, pager, next, jumper"
                    :total="page.totalPage">
                </el-pagination>
            </div>
        </div>

        <!--添加产品详细参数弹窗-->
        <el-dialog :title="title" :visible.sync="addMask">
            <el-form v-model="addForm">
                <el-form-item label="类目名称" :label-width="formLabelWidth">
                    <el-input v-model="addForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="类目图标" :label-width="formLabelWidth" class="icon-area">
                    <el-input readonly v-model="addForm.img" auto-complete="off"></el-input>
                    <el-upload class="icon-uploader"
                               action="/admin/ossClient/aliyunOSSUploadImage"
                               :on-success="handleAvatarSuccess">
                        <el-button size="small" type="primary"><i class="el-icon-upload"></i>上传</el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item label="二级分类" :label-width="formLabelWidth">
                    <el-input v-model="name" auto-complete="off" disabled=""></el-input>
                </el-form-item>
                <el-form-item label="是否启用" :label-width="formLabelWidth">
                    <el-select v-model="addForm.status">
                        <el-option label="是" value="1"></el-option>
                        <el-option label="否" value="2"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addOrEdit('addForm')">确 认</el-button>
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
            // 类目类型
            type: '',
            height: '',
            addMask: false,
            editMask: false,
            isShowDelToast: false,
            formLabelWidth: '100px',
            form: {
                name: '',
                status: '1',
                img: ''
            },
            addForm: {
                name: '',
                status: '1',
                img: ''
            },
            title: '添加产品详细参数',
            id: '',
            itemId: '',
            name: '',
            itype: '',
            delId: 66,
            delUrl: 'http://api',
            delUri: ''
        };
    },
    created() {
        const winHeight = window.screen.availHeight - 500;
        this.height = winHeight;
    },
    activated() {
        this.name =
            this.$route.query.name ||
            JSON.parse(sessionStorage.getItem('secondClassify').name);
        this.id =
            this.$route.query.id ||
            JSON.parse(sessionStorage.getItem('secondClassify').id);
        this.type =
            this.$route.query.type ||
            JSON.parse(sessionStorage.getItem('secondClassify').type);
        this.getList(this.page.currentPage);
    },
    methods: {
        // 获取列表
        getList(val) {
            const that = this;
            const data = {
                page: val,
                fatherid: this.id,
                pageSize: this.page.pageSize
            };
            request.getCategoryList(data).then(res => {
                this.tableData = [];
                this.tableData = res.data.data;
                this.page.totalPage = res.data.totalNum;
            }).catch(error => {
                console.log(error);
            });
        },
        // 添加三级类目
        addClassify() {
            this.title = '添加三级类目';
            this.addMask = true;
            this.addForm.name = '';
            this.addForm.img = '';
            this.addForm.status = '1';
            this.itype = 'add';
        },
        // 编辑
        editItem(row) {
            this.title = '编辑三级类目';
            this.editMask = true;
            row.status = row.status.toString();
            this.form = row;
            this.itemId = row.id;
            this.itype = 'edit';
        },
        // 添加修改确定
        addOrEdit(formName) {
            let url = '';
            const data = {};
            data.name = this[formName].name;
            data.img = this[formName].img;
            data.status = this[formName].status;
            data.type = this.type;
            if (!data.name) {
                this.$message.warning('请输入类目名称!');
                return;
            }
            if (!data.img) {
                this.$message.warning('请上传类目图标!');
                return;
            }
            if (this.itype == 'add') {
                url = 'addCategory';
                data.fatherid = this.id;
            } else {
                url = 'editCategory';
                data.id = this.itemId;
            }
            this.btnLoading = true;
            request[url](data).then(res => {
                // this.$message.success(res.data.msg);
                this.btnLoading = false;
                this.addMask = false;
                this.editMask = false;
                this.getList(this.page.currentPage);
            }).catch(error => {
                console.log(error);
            });
        },
        // 删除
        delItem(id) {
            this.delId = id;
            this.delUrl = 'deleteCategory';
            this.delUri = pApi.deleteProductCategory_2;
            this.isShowDelToast = true;
        },
        // 删除弹窗
        deleteToast(msg) {
            this.isShowDelToast = msg;
            this.getList(this.page.currentPage);
        },
        // 上传图片
        handleAvatarSuccess(res, file) {
            if (this.itype == 'add') {
                this.addForm.img = res.data.imageUrl;
            } else {
                this.form.img = res.data.imageUrl;
            }
        },
        // 取消
        cancel() {
            this.addMask = false;
            this.editMask = false;
            this.getList(this.page.currentPage);
        },
        // 跳转到产品详细参数
        toDetailParam(id) {
            sessionStorage.setItem('thirdId', id);
            this.$router.push({ path: '/thirdClassify', query: { thirdId: id }});
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
