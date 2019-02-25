<template>
    <div>
        <breadcrumb :nav="nav"></breadcrumb>
        <el-card>
            <el-form ref="form" :model="form" inline label-width="120px">
                <el-form-item prop="beginTime" label="操作开始时间">
                    <el-date-picker v-model="form.beginTime" type="datetime" placeholder="请选择开始时间" default-time="00:00:00"></el-date-picker>
                </el-form-item>
                <el-form-item prop="endTime" label="操作结束时间">
                    <el-date-picker v-model="form.endTime" type="datetime" placeholder="请选择结束时间" default-time="00:00:00"></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getList(1)">搜索</el-button>
                    <el-button @click="resetForm('form')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card class="con-card">
            <mr-flying parentClass="content-box">
                <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page.currentPage" :page-size="page.pageSize" layout="total, prev, pager, next, jumper" :total="page.totalPage"></el-pagination>
            </mr-flying>
            <el-table v-loading="tableLoading" class="w-table" stripe :data="tableData" :height="height" border style="width: 100%">
                <el-table-column prop="id" label="日志号" width="100" align="center"></el-table-column>
                <el-table-column prop="name" label="用户名" align="center"></el-table-column>
                <el-table-column prop="contentKey" label="内容摘要" align="center"></el-table-column>
                <el-table-column prop="operateKey" label="操作模块" align="center"></el-table-column>
                <el-table-column prop="content" label="操作内容" align="center"></el-table-column>
                <el-table-column prop="createTime" label="操作时间" align="center"></el-table-column>
            </el-table>
        </el-card>
    </div>
</template>
<script>
import breadcrumb from '../../../common/Breadcrumb';
import * as api from '../../../../api/api.js';
import * as pApi from '../../../../privilegeList/index.js';
import moment from 'moment';
export default {
    components: {
        breadcrumb
    },
    data() {
        return {
            nav: ['经销商会员管理', '会员管理', '会员详情'],
            id: '',
            form: {
                beginTime: '',
                endTime: ''
            },
            tableLoading: false,
            tableData: [],
            height: '',
            page: {
                currentPage: 1,
                totalPage: 0
            }
        };
    },
    created() {
        const winHeight = window.screen.availHeight - 500;
        this.height = winHeight;
    },
    activated() {
        this.id = this.$route.params.userId || sessionStorage.getItem('showMangeLogTmp');
        this.getList(this.page.currentPage);
    },
    methods: {
        //  获取数据
        getList(val) {
            const that = this;
            const data = {
                id: this.id,
                beginTime: this.form.beginTime == '' ? '' : moment(this.form.beginTime).format('YYYY-MM-DD HH:mm:ss'),
                endTime: this.form.endTime == '' ? '' : moment(this.form.endTime).format('YYYY-MM-DD HH:mm:ss'),
                url: pApi.showAdminLog,
                page: val
            };
            this.tableLoading = true;
            this.$axios
                .post(api.getMangerLog, data)
                .then(res => {
                    if (res.data.code == 200) {
                        that.tableData = [];
                        that.tableData = res.data.data.data;
                        that.page.totalPage = res.data.data.resultCount;
                    } else {
                        that.$message.warning(res.data.msg);
                    }
                    that.tableLoading = false;
                })
                .catch(err => {
                    console.log(err);
                    that.tableLoading = false;
                });
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.page.currentPage = val;
            this.getList(val);
        },

        //   重置表单
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }
    }
};
</script>
<style lang="less">
.w-table {
    margin-top: 10px;
}
.con-card {
    margin-top: 20px;
}
.block {
    float: right;
    margin: 10px 0 10px 0;
}
.roots-inp {
    width: 215px;
}
.selectTpl {
    color: #6ac8ff;
    cursor: pointer;
}
</style>





