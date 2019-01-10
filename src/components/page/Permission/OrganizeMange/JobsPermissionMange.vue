<template>
    <div>
        <breadcrumb :nav='nav'></breadcrumb>
        <el-card>
            <el-button type='primary' @click="addRole" v-auth="'quanxian.jobsPermissionMange.tj'">添加岗位</el-button>
            <el-table v-loading="tableLoading" class="w-table" stripe :data="tableData" border
                      style="width: 100%">
                <el-table-column prop="id" label="岗位编号" width="180" align="center"></el-table-column>
                <el-table-column prop="name" label="岗位名称" align="center"></el-table-column>
                <el-table-column prop="departmentName" label="部门" align="center"></el-table-column>
                <el-table-column v-if="isShowOperate" label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="warning" @click='editRole(scope.row)' v-auth="'quanxian.jobsPermissionMange.bj'">编辑</el-button>
                        <el-button type="danger" @click="deleteRole(scope.row)" v-auth="'quanxian.jobsPermissionMange.sc'">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--<div class="block">
                <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="page.currentPage"
                    layout="total, prev, pager, next, jumper"
                    :total="page.totalPage">
                </el-pagination>
            </div>-->
        </el-card>
        <delete-toast :id='delId' :url='delUrl'  @msg='deleteToast' v-if="isShowDelToast"></delete-toast>
    </div>
</template>
<script>
    import breadcrumb from '../../../common/Breadcrumb';
    import deleteToast from '../../../common/DeleteToast';
    import { myMixinTable } from '@/JS/commom';
    import request from '@/http/http.js';
    import * as api from '@/api/api.js'

    export default {
        components: {
            breadcrumb,
            deleteToast
        },
        mixins: [myMixinTable],
        data() {
            return {
                isShowOperate: true,
                nav: ['岗位管理', '岗位权限管理'],
                tableLoading: false,
                isShowDelToast: false,
                departmentId: '',
                delId: '',
                delUrl: 'http://api',
                delUri: '',
                tableData: []
            };
        },
        mounted() {
            this.departmentId = this.$route.query.id;
            this.getList();
        },
        methods: {
            //获取列表
            getList() {
                this.tableLoading = true;
                request.queryJobList({ id: this.departmentId })
                    .then(res => {
                        this.tableLoading = false;
                        this.tableData = res.data;
                    })
                    .catch(err => {
                        this.$message.warning(err.msg);
                        this.tableLoading = false;
                    });
            },

            // 添加角色
            addRole() {
                this.$router.push({ name: 'addJobsPermission' });
            },

            // 编辑角色
            editRole(row) {
                this.$router.push({ name: 'editJobsPermission', query: { userId: row.id } });
            },

            // 删除模板
            deleteRole(row) {
                this.delId = row.id;
                this.delUrl = 'updateDeleteRole';
                this.isShowDelToast = true;
            },
            deleteToast(msg) {
                this.getList(this.page.currentPage);
                this.isShowDelToast = msg;
            }
        }
    };
</script>
<style lang="less">
    .w-table {
        margin-top: 10px;
    }

    .block {
        float: right;
        margin: 10px 0 10px 0;
    }

    .el-dialog__title {
        color: #ff6868;
    }

    .rootscode-inp {
        width: 215px;
    }

    .el-dialog__header {
        border-bottom: 1px solid #eee;
        padding: 20px 20px 10px 50px;
    }
</style>


