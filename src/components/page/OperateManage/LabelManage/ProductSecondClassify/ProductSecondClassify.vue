<template>
    <div class="second-classify">
        <v-breadcrumb :nav="['运营管理','标签管理','产品品类','产品二级类目']"></v-breadcrumb>
        <div class="table-block">
            <template>
                <el-table :data="tableData" border style="width: 100%">
                    <el-table-column type="index" label="ID" align="center"></el-table-column>
                    <el-table-column prop="name" label="二级分类" align="center"></el-table-column>
                    <el-table-column prop="superiorName" label="一级分类" align="center"></el-table-column>
                    <el-table-column label="图标" align="center">
                        <template slot-scope="scope">
                            <img :src="scope.row.img" alt="">
                        </template>
                    </el-table-column>
                    <el-table-column  label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button type="danger" size="small" @click="setLabel(scope.row.id)">标签设置</el-button>
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

    </div>
</template>

<script>
import vBreadcrumb from '@/components/common/Breadcrumb.vue';
import icon from '@/components/common/ico.vue';
import deleteToast from '@/components/common/DeleteToast';
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
            title: '添加标签类型',
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
        this.id =
            this.$route.query.productLabelId || sessionStorage.getItem('productLabelId');
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
        // 标签设置
        setLabel(id) {
            sessionStorage.setItem('secCategoryId', id);
            this.$router.push({ path: '/productLabelManage', query: { secCategoryId: id }});
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
