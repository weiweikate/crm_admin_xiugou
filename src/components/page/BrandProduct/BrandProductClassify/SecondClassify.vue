<template>
    <div class="second-classify">
        <v-breadcrumb :nav="['品牌产品管理','产品品类分类管理',name]"></v-breadcrumb>
        <div class="table-block">
            <el-button type="primary" style="margin-bottom: 20px" @click="addClassify">添加二级类目</el-button>
            <template>
                <el-table :data="tableData" :height="height" border style="width: 100%">
                    <el-table-column type="index" label="ID" align="center"></el-table-column>
                    <el-table-column prop="name" label="二级分类" align="center"></el-table-column>
                    <el-table-column prop="superiorName" label="一级分类" align="center"></el-table-column>
                    <el-table-column label="图标" align="center">
                        <template slot-scope="scope">
                            <img :src="scope.row.img" alt="">
                        </template>
                    </el-table-column>
                    <el-table-column prop="sort" label="排序" align="center"></el-table-column>
                    <el-table-column prop="status" label="状态" align="center">
                        <template slot-scope="scope">
                            <template v-if="scope.row.status == 1">启用</template>
                            <template v-if="scope.row.status == 2">禁用</template>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="160" label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button type="primary" size="small" @click="toThirdClassify(scope.row)">三级类目</el-button>
                            <el-button type="warning" size="small" @click="editItem(scope.row)">编辑</el-button>
                            <!--<el-button type="danger" size="small" @click="delItem(scope.row.id)">删除</el-button>-->
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

        <!--添加/编辑类目弹窗-->
        <el-dialog :title="title" :visible.sync="editMask">
            <el-form v-model="form" label-width="100px">
                <el-form-item label="类目名称"">
                    <el-input v-model="form.name" auto-complete="off"></el-input>
                    <span style="font-size: 12px;color: #aaa">（2-16位汉字字母组合）</span>
                </el-form-item>
                <el-form-item label="类目图标" class="icon-area">
                    <el-input readonly v-model="form.img" auto-complete="off"></el-input>
                    <el-upload class="icon-uploader"
                               :action="uploadImg"
                               :before-upload="beforeAvatarUpload"
                               :on-success="handleAvatarSuccess">
                        <el-button size="small" type="primary"><i class="el-icon-upload"></i>上传</el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item label="一级分类">
                    <el-input v-model="name" auto-complete="off" disabled=""></el-input>
                </el-form-item>
                <el-form-item label="是否启用">
                    <el-select v-model="form.status">
                        <el-option label="是" value="1"></el-option>
                        <el-option label="否" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="name" label="APP排序">
                    <el-input v-model="form.sort" auto-complete="off"></el-input>
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
import { myMixinTable, beforeAvatarUpload } from '@/JS/commom';
import request from '@/http/http.js';
import * as api from '@/api/api.js';

export default {
    components: {
        vBreadcrumb,
        icon,
        deleteToast
    },
    mixins: [myMixinTable, beforeAvatarUpload],
    data() {
        return {

            tableData: [],
            // 类目类型
            type: '',
            height: '',
            editMask: false,
            isShowDelToast: false,
            formLabelWidth: '100px',
            form: {
                name: '',
                status: '1',
                img: ''
            },
            title: '添加二级类目',
            id: '',
            itemId: '',
            name: '',
            itype: '',
            delId: 66,
            delUrl: 'http://api',
            delUri: '',
            uploadImg: ''
        };
    },
    created() {
        const winHeight = window.screen.availHeight - 500;
        this.height = winHeight;
    },
    activated() {
        this.uploadImg = api.uploadImg;
        this.name =
            this.$route.query.name || JSON.parse(sessionStorage.getItem('secondClassify')).name;
        this.id =
            this.$route.query.id || JSON.parse(sessionStorage.getItem('secondClassify')).id;
        this.type =
            this.$route.query.type || JSON.parse(sessionStorage.getItem('secondClassify')).type;
        this.getList(this.page.currentPage);
    },
    methods: {
        // 获取列表
        getList(val) {
            const data = {
                page: val,
                fatherId: this.id,
                pageSize: this.page.pageSize,
                level: 2
            };
            this.page.currentPage = val;
            request.queryProductCategoryList(data).then(res => {
                this.tableData = [];
                this.tableData = res.data.data;
                this.page.totalPage = res.data.totalNum;
            }).catch(error => {
                console.log(error);
            });
        },
        // 添加二级类目
        addClassify() {
            this.title = '添加二级类目';
            this.editMask = true;
            utils.cleanFormData(this.form);
            this.form.status = '1';
            this.itype = 'add';
        },
        // 编辑
        editItem(row) {
            this.title = '编辑二级类目';
            this.editMask = true;
            row.status = row.status.toString();
            this.form = row;
            this.itemId = row.id;
            this.itype = 'edit';
        },
        // 添加修改确定
        addOrEdit(formName) {
            let url = '';
            const data = this[formName];
            data.type = this.type;
            data.level = 2;
            data.fatherId = this.id;
            if (!data.name) {
                this.$message.warning('请输入类目名称!');
                return;
            }
            const reg = /^[A-Za-z\u4e00-\u9fa5]{2,16}$/;
            if (!reg.test(data.name)) {
                this.$message.warning('请输入2-16位汉字字母的组合!');
                return;
            }
            if (!data.img) {
                this.$message.warning('请上传类目图标!');
                return;
            }
            if (!data.sort) {
                this.$message.warning('请输入排序!');
                return;
            }
            if (this.itype == 'add') {
                url = 'addProductCategory';
            } else {
                url = 'modifyProductCategory';
                data.id = this.itemId;
            }
            this.btnLoading = true;
            request[url](data).then(res => {
                this.$message.success(res.msg);
                this.btnLoading = false;
                this.editMask = false;
                this.getList(this.page.currentPage);
            }).catch(error => {
                console.log(error);
                this.btnLoading = false;
            });
        },
        // 删除
        delItem(id) {
            this.delId = id;
            this.delUrl = 'deleteProductCategory';
            this.isShowDelToast = true;
        },
        // 删除弹窗
        deleteToast(msg) {
            this.isShowDelToast = msg;
            this.getList(this.page.currentPage);
        },
        // 上传图片
        handleAvatarSuccess(res, file) {
            this.form.img = res.data;
        },
        // 取消
        cancel() {
            this.editMask = false;
            this.getList(this.page.currentPage);
        },
        // 跳转到三级类目
        toThirdClassify(row) {
            sessionStorage.setItem('thirdClassify', JSON.stringify({ name: row.name, id: row.id, type: row.type, superiorName: row.superiorName }));
            this.$router.push({ path: '/thirdClassify', query: { name: row.name, id: row.id, type: row.type, superiorName: row.superiorName }});
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
