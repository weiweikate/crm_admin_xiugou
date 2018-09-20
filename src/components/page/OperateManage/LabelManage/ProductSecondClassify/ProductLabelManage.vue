<template>
    <div class="second-classify">
        <v-breadcrumb :nav="['运营管理','标签管理','产品品类','产品二级类目','产品标签管理']"></v-breadcrumb>
        <div class="table-block">
            <div style="margin-bottom: 20px">
                标签类型
                <el-select>
                    <el-option value="">全部</el-option>
                </el-select>
                <div style="float: right">
                    <el-button type="primary" size="small" @click="importLabel">导入</el-button>
                </div>
            </div>
            <template>
                <el-table :data="tableData" border style="width: 100%">
                    <el-table-column type="index" label="编号" align="center"></el-table-column>
                    <el-table-column prop="param" label="类型" align="center"></el-table-column>
                    <el-table-column label="标签" align="center">
                        <template slot-scopr="scope">
                            <el-tag class="tag" type="info" closable v-for="(v,k) in scope.row.labels" :key="k"
                                    @close="deleteLabel(k,v)">{{v.label}}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column  label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button type="primary" size="small" @click="delItem(scope.row.id)">添加</el-button>
                            <el-button type="danger" size="small" @click="delItem(scope.row.id)">清空</el-button>
                            <el-button type="success" size="small" @click="delItem(scope.row.id)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>

        </div>
        <!--添加弹窗-->
        <el-dialog title="添加标签" :visible.sync="addMask">
            <el-form v-model="form">
                <el-form-item label="标签名称" :label-width="formLabelWidth">
                    <el-input v-model="form.name" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addOrEdit('form')">确 认</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
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
                param: ''
            },
            id: '',
            itemId: '',
            name: '',
            superiorName: '',
            className: '',
            itype: '',
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
            request.querySysTagLibraryList({}).then(res => {
                this.tableData = [];
                this.tableData = res.data;
            }).catch(error => {
                console.log(error);
            });
        },
        // 添加
        addClassify() {
            this.addMask = true;
            this.form.param = '';
        },
        // 添加确定
        addOrEdit(formName) {
            const data = {};
            data.param = this[formName].param;
            data.categoryId = this.id;
            if (!data.param) {
                this.$message.warning('请输入类型名称!');
                return;
            }
            this.btnLoading = true;
            request.addProductCategoryParam(data).then(res => {
                // this.$message.success(res.data.msg);
                this.btnLoading = false;
                this.addMask = false;
                this.editMask = false;
                this.getList(this.page.currentPage);
            }).catch(error => {
                console.log(error);
            });
        },
        // 导入
        importLabel() {

        },
        // 删除标签
        deleteLabel() {

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

        .icon-area .el-input__inner {
            width: 240px;
        }
        .el-dialog__footer {
            margin-right: 30px;
        }

    }
</style>
