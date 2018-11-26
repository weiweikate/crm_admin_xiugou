<template>
    <div class="productLabel-manage">
        <v-breadcrumb :nav="['运营管理','标签管理','产品品类','产品二级类目','产品标签管理']"></v-breadcrumb>
        <div class="table-block">
            <div style="margin-bottom: 20px">
                标签类型
                <el-select v-model="type" placeholder="全部" @change="getList">
                    <el-option value="">全部</el-option>
                    <el-option v-for="(v,k) in labelType" :key="k" :label="v.typeName" :value='v.typeId'>{{v.typeName}}</el-option>
                </el-select>
            </div>
            <div style="margin-bottom: 10px">
                <!--<el-button type="primary" size="small" @click="importLabel">导入</el-button>-->
            </div>
            <template>
                <el-table :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange">
                    <el-table-column
                        type="selection"
                        width="55" align="center">
                    </el-table-column>
                    <el-table-column type="index" label="编号" align="center"></el-table-column>
                    <el-table-column prop="typeName" label="类型" align="center"></el-table-column>
                    <el-table-column label="标签" align="center">
                        <template slot-scope="scope">
                            <el-tag class="tag" type="info" :closable="scope.row.deleteStatus==1" v-for="(v,k) in scope.row.sysTagLibraryVOList" :key="k"
                                    @close="deleteLabel(v,scope.$index)">{{v.name}}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column  label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button type="primary" size="small" :disabled="scope.row.deleteStatus" @click="addItem(scope.row)" v-auth="'yunying.labelManage.tj'">添加</el-button>
                            <el-button type="success" size="small" :disabled="scope.row.deleteStatus" @click="clearItem(scope.row)" v-auth="'unying.labelManage.qk'">清空</el-button>
                            <el-button v-if="!scope.row.deleteStatus" type="danger" size="small" @click="delItem(scope.row)" v-auth="'yunying.labelManage.sc'">删除</el-button>
                            <el-button v-else type="warning" size="small" @click="deleteSure(scope.$index)">确定</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
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
                <el-button :loading="btnLoading" type="primary" @click="addOrEdit('form')">确 认</el-button>
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
                               :before-upload="beforeUpload">
                        <el-button size="small" type="primary">选择</el-button>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addOrEdit('exportForm')">确 认</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
        <!--清空-->
        <div class="clear-mask" v-if="clearMask">
            <div class="box">
                <div class="mask-title"><icon class="ico" ico='icon-jinggao'/>  清空</div>
                <div class="mask-content">
                    <span class="del-tip">是否清空标签</span>
                    <div class="del-btn-group">
                        <el-button :loading="btnLoading" @click="clearLabel" class="del-btn" type="danger">确认清空</el-button>
                        <el-button @click="cancel">取消</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import vBreadcrumb from '@/components/common/Breadcrumb.vue';
import icon from '@/components/common/ico.vue';
import request from '@/http/http.js';

export default {
    components: {
        vBreadcrumb,
        icon
    },
    data() {
        return {

            tableData: [],
            height: '',
            addMask: false,
            exportMask: false,
            isShowDelToast: false,
            formLabelWidth: '100px',
            form: {
                name: ''
            },
            id: '',
            status: '',
            multipleSelection: [],
            // 标签类型
            type: '',
            isShowPop: false,
            labelType: [],
            uploadExcel: '',
            exportForm: {
                type: '',
                url: ''
            },
            secCategoryId: '',
            clearMask: false,
            btnLoading: false
        };
    },
    created() {
    },
    activated() {
        this.secCategoryId = this.$route.query.secCategoryId || sessionStorage.getItem('secCategoryId');
        this.getTypeList();
        this.getList();
    },
    methods: {
        getTypeList() {
            const data = {
                typeId: '',
                secCategoryId: this.secCategoryId
            };
            request.querySysTagLibraryList(data).then(res => {
                this.typeList = [];
                this.labelType = res.data;
            }).catch(error => {
                console.log(error);
            });
        },
        // 获取列表
        getList() {
            const data = {
                typeId: this.type,
                secCategoryId: this.secCategoryId
            };
            request.querySysTagLibraryList(data).then(res => {
                this.tableData = [];
                res.data.forEach(function(v, k) {
                    v.deleteStatus = false;// 作为删除状态显示用
                    v.deleteLabelIds = [];// 为删除操作存储数据
                });
                this.tableData = res.data;
            }).catch(error => {
                console.log(error);
            });
        },
        // 添加
        addItem(row) {
            this.addMask = true;
            this.form.name = '';
            this.id = row.typeId;
            this.status = row.status;
        },
        // 添加确定
        addOrEdit(formName) {
            const data = this[formName];
            data.typeId = this.id;
            data.status = 1;
            data.secCategoryId = this.secCategoryId;
            if (!data.name) {
                this.$message.warning('请输入标签名称!');
                return;
            }
            this.btnLoading = true;
            request.addSysTagLibrary(data).then(res => {
                this.$message.success(res.msg);
                this.btnLoading = false;
                this.addMask = false;
                this.getList();
            }).catch(error => {
                console.log(error);
                this.btnLoading = false;
            });
        },
        // 取消
        cancel() {
            this.addMask = false;
            this.clearMask = false;
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
        // 删除
        deleteLabel(v, index) {
            this.tableData[index].sysTagLibraryVOList.splice(this.tableData[index].sysTagLibraryVOList.indexOf(v), 1);
            this.tableData[index].deleteLabelIds.push(v.id);
        },
        deleteSure(index) {
            const data = {
                tagIds: this.tableData[index].deleteLabelIds,
                secCategoryId: this.secCategoryId
            };
            if (!data.tagIds.length) return;
            request.removeTags(data).then(res => {
                this.$message.success(res.msg);
                this.getList();
            }).catch(error => {
                console.log(error);
            });
        },
        // 清空
        clearItem(row) {
            this.clearMask = true;
            this.id = row.typeId;
        },
        clearLabel() {
            const data = {
                typeId: this.id,
                secCategoryId: this.secCategoryId
            };
            this.btnLoading = true;
            request.removeByTypeId(data).then(res => {
                this.$message.success(res.msg);
                this.btnLoading = false;
                this.clearMask = false;
                this.getList();
            }).catch(error => {
                console.log(error);
                this.btnLoading = false;
            });
        },
        // 全选
        handleSelectionChange(val) {
            const that = this;
            this.multipleSelection = [];
            val.forEach((v, k) => {
                that.multipleSelection.push(v.typeId);
            });
        },
        // 批量操作
        batchOperate() {
            if (this.multipleSelection.length == 0) {
                this.$message.warning('请选择活动!');
                return;
            }
            const data = {
                secCategoryId: this.secCategoryId,
                typeIds: this.multipleSelection
            };
            request.removeByTypeIds(data).then(res => {
                this.isShowPop = false;
                this.isShowEndPop = false;
                this.$message.success(res.msg);
                this.getList();
            }).catch(err => {
                console.log(err);
            });
        },
        // 上传excel
        handleAvatarSuccess(res) {
            this.exportForm.url = res.data;
        },
        // 格式
        beforeUpload(file) {
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
            .el-input__suffix{
                top:-5px !important;
            }
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
        .clear-mask {
            display: flex;
            align-items: center;
            justify-content: center;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 99;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.2);
            .box {
                position: relative;
                width: 530px;
                height: 305px;
                background-color: #fff;
                border-radius: 10px;
                overflow: hidden;
                .mask-title {
                    width: 100%;
                    height: 56px;
                    border-bottom: 1px solid #ccc;
                    padding-left: 45px;
                    box-sizing: border-box;
                    text-align: center;
                    line-height: 56px;
                    color: #ff6868;
                    font-weight: 700;
                    .ico {
                        position: absolute;
                        top: 16px;
                        left: 228px;
                        color: red;
                        font-size: 20px;
                    }
                }
                .mask-content {
                    position: relative;
                    width: 100%;
                    height: 248px;
                    overflow: hidden;
                    padding: 30px 45px 0 45px;
                    box-sizing: border-box;
                    .del-tip {
                        position: absolute;
                        top: 30%;
                        left: 50%;
                        transform: translateX(-50%);
                        font-size: 22px;
                    }
                    .del-btn-group {
                        width: 180px;
                        display: flex;
                        justify-content: space-between;
                        position: absolute;
                        left: 50%;
                        transform: translateX(-50%);
                        bottom: 15%;
                        .del-btn {
                            background-color: #ff6868;
                        }
                    }
                }
            }
        }

    }
</style>
