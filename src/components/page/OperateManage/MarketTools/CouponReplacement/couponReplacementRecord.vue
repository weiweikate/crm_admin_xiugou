<template>
    <div class="deliver-coupon-record">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card class="mb10">
            <el-form :model="form" ref="form" @submit.native.prevent inline label-width="120px">
                <el-form-item prop="phone" label="发放手机号">
                    <el-input v-model="form.phone"></el-input>
                </el-form-item>
                <el-form-item prop="status" label="发放状态">
                    <el-select v-model="form.status">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="成功" value="1"></el-option>
                        <el-option label="失败" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="genre" label="发放方式">
                    <el-select v-model="form.genre">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="条件发放" value="1"></el-option>
                        <el-option label="定向发放" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="updataTime" label="领取时间">
                    <el-date-picker type="datetimerange" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="form.updataTime" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
                </el-form-item>
                <el-form-item prop="recordId" label="发放编号">
                    <el-input v-model="form.recordId"></el-input>
                </el-form-item>
                <el-form-item prop="couponName" label="券名称">
                    <el-input v-model="form.couponName"></el-input>
                </el-form-item>
                <el-form-item prop="couponConfigId" label="券ID">
                    <el-input v-model="form.couponConfigId"></el-input>
                </el-form-item>
                <el-form-item label=" ">
                    <el-button native-type="submit" @click="getList(1)" type="primary">查 询</el-button>
                    <el-button @click="resetForm('form')" >重 置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card>
            <el-table v-loading="pageLoading" :data="tableData" border stripe>
                <el-table-column type="index" label="序号" align="center"></el-table-column>
                <el-table-column prop="recordId" label="发放编号" align="center"></el-table-column>
                <el-table-column prop="couponName" label="券名称" align="center"></el-table-column>
                <el-table-column prop="couponConfigId" label="券ID" align="center"></el-table-column>
                <el-table-column prop="genre" label="发放方式" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.genre == 1">条件发放</span>
                        <span v-else-if="scope.row.genre == 2">定向发放</span>
                        <span v-else>-</span>
                    </template>
                </el-table-column>
                <el-table-column prop="phone" label="发放手机号" align="center"></el-table-column>
                <el-table-column label="发送状态" align="center">
                    <template slot-scope="scope">
                        <template v-if="scope.row.status==1">成功</template>
                        <template v-else-if="scope.row.status==2">失败</template>
                        <template v-else>-</template>
                    </template>
                </el-table-column>
                <el-table-column label="领取时间" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status == 1">{{scope.row.updateTime|formatDateAll}}</span>
                        <span v-else-if="scope.row.status == 2">/</span>
                        <span v-else>/</span>
                    </template>
                </el-table-column>
                <el-table-column prop="reason" label="失败原因" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status == 1">/</span>
                        <span v-else-if="scope.row.status == 2">{{scope.row.reason}}</span>
                        <span v-else>/</span>
                    </template>
                </el-table-column>
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
                nav: ['运营管理', '营销工具管理', '优惠券发放记录列表'],
                pageLoading: false,
                form: {
                    phone: '',
                    status: '',
                    genre: '',
                    updataTime: [],
                    recordId: '',
                    couponName: '',
                    couponConfigId: ''
                },
                tableData: []
            };
        },
        mounted() {
            this.getList(this.page.currentPage);
        },
        methods: {
            getList(val) {
                this.pageLoading = true;
                this.form.updataTime = this.form.updataTime ? this.form.updataTime : [];
                const data = {
                    page: val,
                    pageSize: this.page.pageSize,
                    type: 1,
                    ...this.form,
                    beginUpdateTime: this.form.updataTime.length === 0 ? '' : this.form.updataTime[0],
                    endUpdateTime: this.form.updataTime.length === 0 ? '' : this.form.updataTime[1]
                };
                this.page.currentPage = val;
                this.tableData = [];
                request.queryReissueRecordPageList(data).then(res => {
                    this.pageLoading = false;
                    this.tableData = res.data.data;
                    this.page.totalPage = res.data.totalNum;
                }).catch(err => {
                    this.pageLoading = false;
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
