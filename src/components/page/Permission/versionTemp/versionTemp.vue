<template>
    <div class="version-iter">
        <el-button type="primary" @click="addVersion">新建版本信息</el-button>
        <mr-flying parentClass="content-box">
            <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page.currentPage"
                :page-size="page.pageSize"
                layout="total, prev, pager, next, jumper"
                :total="page.totalPage">
            </el-pagination>
        </mr-flying>
        <el-table v-loading="tableLoading" :data="tableData" border style='margin-top:20px' :height="height">
            <el-table-column prop="id" label="编号" align="center"></el-table-column>
            <el-table-column prop="version" label="版本号" align="center"></el-table-column>
            <el-table-column prop="createTime" label="上传时间" align="center">
                <template slot-scope="scope">
                    {{scope.row.createTime | formatDateAll}}
                </template>
            </el-table-column>
            <el-table-column prop="coerce" label="是否强制更新" align="center">
                <template slot-scope="scope">
                    {{scope.row.forceUpdate == 1?'是':'不是'}}
                </template>
            </el-table-column>
            <el-table-column prop="description" label="备注" align="center"></el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button type="primary" @click="editVersion(scope.row)">编辑</el-button>
                    <el-button type="danger" @click="showDeleteToast(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import request from '@/http/http';
import { myMixinTable } from '@/JS/commom';
export default {
    props: ['name'],
    mixins: [myMixinTable],
    data() {
        return {
            tableData: [],
            height: '100vh',
            tableLoading: false,
            status: '' // 1:安卓 2:ios
        };
    },
    activated() {
        this.height = window.screen.availHeight - 400;
    },
    methods: {
        // 获取数据
        getList() {
            const data = {
                type: this.status,
                page: this.page.currentPage,
                pageSize: this.page.pageSize
            };
            this.tableLoading = true;
            request.queryVersionRecordPageList(data).then(res => {
                this.tableLoading = false;
                this.tableData = [];
                this.tableData = res.data.data;
                this.page.totalPage = res.data.totalNum;
            }).catch(err => {
                this.tableLoading = false;
                console.log(err);
            });
        },
        // 添加问题类目
        addVersion() {
            this.$emit('addVersion');
        },
        showDeleteToast(row) {
            this.$emit('showDeleteToast', row);
        },
        editVersion(row) {
            this.$emit('addVersion', row);
        }
    }
};
</script>
<style lang='less' scoped>
    .version-iter {
        .input-sty{
            width: 210px;
        }
        .block {
            float: right;
            margin: 10px 0 10px 0;
        }
        /deep/.el-dialog{
            border-radius:10px;
            .el-dialog__header{
                border-bottom: 1px solid #dfdfdf;
                .el-dialog__title{
                    color: #ff4e4e;
                }
            }
        }
    }
</style>
