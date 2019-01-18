<template>
    <div class="deliver-coupon-record">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card class="mb10">
            <el-form :model="form" ref="form" inline label-width="120px">
                <el-form-item prop="name" label="发放手机号">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item prop="code" label="发放状态">
                    <el-select v-model="form.createUser">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="成功" value="1"></el-option>
                        <el-option label="失败" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="createUser" label="发放方式">
                    <el-select v-model="form.createUser">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="条件发放" value="1"></el-option>
                        <el-option label="定向发放" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="createTime" label="领取时间">
                    <el-date-picker type="datetimerange" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="form.createTime" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
                </el-form-item>
                <el-form-item prop="name" label="发放编号">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label=" ">
                    <el-button @click="getList(1)" type="primary">查 询</el-button>
                    <el-button @click="resetForm('form')" >重 置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card>
            <el-table :data="tableData" border stripe>
                <el-table-column prop="code" label="序号" align="center"></el-table-column>
                <el-table-column prop="name" label="发放编号" align="center"></el-table-column>
                <el-table-column prop="numItems" label="秀豆（枚）" align="center"></el-table-column>
                <el-table-column prop="residualQuantity" label="发放方式" align="center"></el-table-column>
                <el-table-column prop="residualQuantity" label="发放手机号" align="center"></el-table-column>
                <el-table-column label="发送状态" align="center">
                    <template slot-scope="scope">
                        <template v-if="scope.row.status==1">正常</template>
                        <template v-if="scope.row.status==2">已暂停</template>
                    </template>
                </el-table-column>
                <el-table-column label="领取时间" align="center">
                    <template slot-scope="scope">{{scope.row.createName}}<br>{{scope.row.createTime|formatDateAll}}</template>
                </el-table-column>
                <el-table-column prop="residualQuantity" label="失败原因" align="center"></el-table-column>
            </el-table>
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
        </el-card>
    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import { myMixinTable } from '@/JS/commom';
    import request from '@/http/http.js';
    import utils from '@/utils/index.js';

    export default {
        mixins: [myMixinTable],
        components: { vBreadcrumb },
        data() {
            return {
                nav: ['运营管理', '营销工具管理', '秀豆发放记录列表'],
                form: {
                    code: '',
                    createUser: '',
                    createTime: [],
                    name: '',
                    updateUser: '',
                    updateTime: []
                },
                tableData: [{id: '1'}]
            };
        },
        mounted() {
            this.getList(this.page.currentPage);
        },
        methods: {
            getList(val) {
                this.form.updataTime = this.form.updataTime ? this.form.updataTime : [];
                const data = {
                    page: val,
                    pageSize: this.page.pageSize,
                    type: 2,
                    ...this.form,
                    beginUpdateTime: this.form.updataTime.length === 0 ? '' : this.form.updataTime[0],
                    endUpdateTime: this.form.updataTime.length === 0 ? '' : this.form.updataTime[1]
                };
                this.page.currentPage = val;
                this.tableData = [];
                request.queryReissueRecordPageList(data).then(res => {
                    this.tableData = res.data.data;
                    this.page.totalPage = res.data.totalNum;
                }).catch(err => {
                    console.log(err);
                });
            },
            // 层级全选操作
            handleCheckAllChange(val) {
                const allList = this.levelList.map(v => v.id);
                this.queryForm.deliverLevels = val ? allList : [];
                this.isIndeterminate = false;
            },
            // 重置表单
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.getList(this.page.currentPage);
            }
        }
    };
</script>

<style lang="less" scoped>
    .deliver-coupon-record{
    }
</style>
