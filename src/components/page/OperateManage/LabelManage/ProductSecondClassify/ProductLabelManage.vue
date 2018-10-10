<template>
    <div class="productLabel-manage">
        <v-breadcrumb :nav="['运营管理','标签管理','产品品类','产品二级类目','产品标签管理']"></v-breadcrumb>
        <div class="table-block">
            <div style="margin-bottom: 20px">
                标签类型
                <el-select v-model="type" placeholder="全部">
                    <el-option value="">全部</el-option>
                    <el-option v-for="(v,k) in labelType" :key="k" :label="v.label" :value='v.id'>{{v.label}}</el-option>
                </el-select>
            </div>
            <div style="margin-bottom: 10px">
                <el-button type="primary" size="small" @click="importLabel">导入</el-button>
            </div>
            <template>
                <el-table :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange">
                    <el-table-column
                        type="selection"
                        width="55" align="center">
                    </el-table-column>
                    <el-table-column type="index" label="编号" align="center"></el-table-column>
                    <el-table-column prop="type" label="类型" align="center"></el-table-column>
                    <el-table-column label="标签" align="center">
                        <template slot-scope="scope">
                            <el-tag class="tag" type="info" :closable="scope.row.deleteStatus==1" v-for="(v,k) in scope.row.labels" :key="k"
                                    @close="deleteLabel(k,v)">{{v.name}}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column  label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button type="primary" size="small" :disabled="scope.row.deleteStatus" @click="addItem(scope.row.id)">添加</el-button>
                            <el-button type="success" size="small" :disabled="scope.row.deleteStatus" @click="clearItem(scope.row)">清空</el-button>
                            <el-button :type="!scope.row.deleteStatus?'danger':'warning'" size="small" @click="delItem(scope.row)"><span v-if="!scope.row.deleteStatus">删除</span><span v-else>确定</span></el-button>
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
            <div class="operate-table">
                <el-popover placement="top" width="160" v-model="isShowPop">
                    <p>确定清空吗？</p>
                    <div style="text-align: right; margin: 0">
                        <el-button @click="batchOperate(0)" type="primary" size="mini">确定</el-button>
                        <el-button size="mini" type="text" @click="isShowPop = false">取消</el-button>
                    </div>
                    <el-button slot="reference" @click="isShowPop = true">清空</el-button>
                </el-popover>
            </div>
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
        <!--导入标签-->
        <el-dialog title="导入标签" :visible.sync="exportMask">
            <el-form v-model="exportForm">
                <el-form-item label="标签类型" :label-width="formLabelWidth">
                    <el-select v-model="exportForm.type">
                        <el-option v-for="(v,k) in labelType" :key="k" :label="v.label" :value='v.id'>{{v.label}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="导入标签" :label-width="formLabelWidth">
                    <el-input readonly v-model="exportForm.url" placeholder="导入Excel" auto-complete="off"></el-input>
                    <el-upload class="icon-uploader"
                               :action="uploadExcel"
                               :on-success="handleAvatarSuccess"
                               :before-upload="beforeAvatarUpload">
                        <el-button size="small" type="primary">选择</el-button>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addOrEdit('exportForm')">确 认</el-button>
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

            tableData: [{ type: 1, labels: [{ name: 1, id: 1 }, { name: 2, id: 2 }], deleteStatus: false }],
            height: '',
            addMask: false,
            exportMask: false,
            isShowDelToast: false,
            formLabelWidth: '100px',
            form: {
                name: ''
            },
            id: '',
            itemId: '',
            multipleSelection: [],
            // 标签类型
            type: '',
            isShowPop: false,
            labelType: [{ label: 1, id: 1 }, { label: 2, id: 2 }],
            uploadExcel: '',
            exportForm: {
                type: '',
                url: ''
            }
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
                pageSize: this.page.pageSize,
                typeId: 1
            };
            request.querySysTagLibraryList(data).then(res => {
                this.tableData = [];
                this.tableData = res.data;
            }).catch(error => {
                console.log(error);
            });
        },
        // 添加
        addItem() {
            this.addMask = true;
            this.form.name = '';
        },
        // 添加确定
        addOrEdit(formName) {
            const data = this[formName];
            data.categoryId = this.id;
            if (!data.name) {
                this.$message.warning('请输入标签名称!');
                return;
            }
            this.btnLoading = true;
            request.addSysTagLibrary(data).then(res => {
                this.$message.success(res.msg);
                this.btnLoading = false;
                this.addMask = false;
                this.editMask = false;
                this.getList(this.page.currentPage);
            }).catch(error => {
                console.log(error);
            });
        },
        // 取消
        cancel() {
            this.addMask = false;
            this.exportMask = false;
            this.form.name = '';
            this.exportForm.type = '';
            this.exportForm.url = '';
        },
        // 导入
        importLabel() {
            this.exportMask = true;
        },
        // 删除标签
        delItem(row) {
            row.deleteStatus = !row.deleteStatus;
        },
        // 清空
        clearItem(row) {

        },
        // 全选
        handleSelectionChange(val) {
            const that = this;
            this.multipleSelection = [];
            val.forEach((v, k) => {
                that.multipleSelection.push(v.id);
            });
        },
        // 批量操作
        batchOperate(status) {
            if (this.multipleSelection.length == 0) {
                this.$message.warning('请选择活动!');
                return;
            }
            let url = '';
            // status 0:删除 1：结束
            if (status == 0) {
                url = 'deleteActivityDepreciate';
            } else {
                url = 'modifyActivityDepreciate';
            }
            request[url]({ list: this.multipleSelection.join(',') }).then(res => {
                this.isShowPop = false;
                this.isShowEndPop = false;
                this.$message.success(res.msg);
                this.getList(this.page.currentPage);
            }).catch(err => {
                console.log(err);
            });
        },
        // 上传excel
        handleAvatarSuccess(res) {
            this.exportForm.url = res.data;
        },
        // 格式
        beforeAvatarUpload(file) {
            console.log(file);
            const fileType = file.name.split('.')[1];
            const isXls = fileType;
            if (!isXls) {
                this.$message.error('请上传xls格式的文件');
            }
            return isXls;
        }
    }
};
</script>

<style lang="less">
    .productLabel-manage {
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
            width: 200px;
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
        .tag{
            margin-right: 5px;
        }
        .operate-table {
            margin-top: 10px;
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
        .icon-uploader {
            float: right;
            margin-right: 31px;
            height: 33px;
        }
        .icon-uploader .el-button--small {
            border-radius: 5px;
            width: 100px;
        }
        .el-input__suffix{
            top:-5px !important;
        }

    }
</style>
