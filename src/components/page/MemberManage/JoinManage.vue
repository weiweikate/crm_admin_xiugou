<template>
    <div>
        <v-breadcrumb :nav="['会员管理','会员邀请管理']"></v-breadcrumb>
            <el-card style="margin:10px 0 20px">
                <el-form ref="form" :inline="true" :model="form">
                    <el-form-item prop="initiator" label="发起人" label-width="120">
                        <el-input style="width:200px" placeholder="请输入发起人姓名" v-model="form.initiator"></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button @click="getList(1)" type="primary">查询</el-button>
                        <el-button @click="resetForm('form')">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        <div class="table-block">
            <el-button @click="sendInvite" style="margin-bottom: 20px" type="primary">发起邀请</el-button>
            <template>
                <el-table v-loading="tableLoading" :data="tableData" border style="width: 100%">
                    <el-table-column prop="id" label="邀请记录ID" align="center"></el-table-column>
                    <el-table-column prop="levelName" label="邀请层级" align="center"></el-table-column>
                    <el-table-column prop="invalidTime" label="邀请时间" align="center">
                        <template slot-scope="scope">{{scope.row.invalidTime|formatDateAll}}</template>
                    </el-table-column>
                    <el-table-column prop="adminName" label="发起者" align="center"></el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button type="warning" size="small" @click="detailItem(scope.row)">详情</el-button>
                            <el-button type="danger" size="small" @click="watchItem(scope.row)">查看邀请</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
            <div class="block">
                <el-pagination
                        background
                        :page-size="page.pageSize"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="page.currentPage"
                        layout="total, prev, pager, next, jumper"
                        :total="page.totalPage">
                </el-pagination>
            </div>
        </div>

    </div>
</template>

<script>
import vBreadcrumb from '../../common/Breadcrumb.vue';
import icon from '../../common/ico.vue';
import request from '@/http/http';
import { myMixinTable } from '@/JS/commom';
export default {
    components: {
        vBreadcrumb, icon
    },
    mixins: [myMixinTable],
    data() {
        return {
            tableData: [],
            tableLoading: false,
            height: '',
            formLabelWidth: '100px',
            form: {
                initiator: ''
            },
            selected: ''
        };
    },
    activated() {
        this.form.initiator = this.$route.query.inviteName || '';
        this.getList(this.page.currentPage);
    },
    methods: {
        // 获取列表
        getList(val) {
            const data = {
                page: val,
                pageSize: this.page.pageSize,
                adminName: this.form.initiator
            };
            this.page.currentPage = val;
            this.tableLoading = true;
            request.queryList(data).then(res => {
                this.tableData = res.data.data;
                this.page.totalPage = res.data.totalNum;
                this.tableLoading = false;
            }).catch(err => {
                console.log(err);
                this.tableLoading = false;
            });
        },
        // 详情
        detailItem(row) {
            this.$router.push({name: 'inviteDetail', query: {joinManageInfo: row}});
        },
        // 查看邀请
        watchItem(row) {
            this.$router.push({name: 'inviteLink', query: {joinManageLinkPage: row}});
        },
        // 发起邀请
        sendInvite() {
            this.$router.push('/sendInvite');
        },
        // 重置表单
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.getList(this.page.currentPage);
        }
    }
};
</script>

<style>

</style>
