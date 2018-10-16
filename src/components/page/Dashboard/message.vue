<template>
    <div class="message">
        <v-breadcrumb :nav='["首页","全部消息"]'></v-breadcrumb>
        <el-card>
            <el-form :model="form" ref="form" inline label-width="120px">
                <el-form-item prop="type" label="类型">
                    <el-select v-model="form.type" placeholder="请选择">
                        <el-option v-for="(v, k) in typeArr" :key="k" :label="v.label" :value="v.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="time" label="消息时间">
                    <el-date-picker v-model="form.time" start-placeholder="开始时间" end-placeholder="结束时间" type="datetimerange"></el-date-picker>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" @click="submitForm">查询</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card style="margin-top: 10px ">
            <el-table ref="table" v-loading="loading" :data="tableData" border stripe @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="消息类型">
                    <template slot-scope="scope">
                        <p class="msg-content">
                            <el-tag v-if="scope.row.read">已读</el-tag>
                            <el-tag type="danger" v-else>未读</el-tag>
                            <span v-if="scope.row.type == 100">【产品礼包】</span>
                            <span v-else-if="scope.row.type == 100">【商品库存】</span>
                            <span v-else-if="scope.row.type == 100">【营销工具】</span>
                            <span v-else-if="scope.row.type == 100">【奖品管理】</span>
                            <span v-else-if="scope.row.type == 100">【广告位】</span>
                            <span v-else-if="scope.row.type == 100">【店铺举报】</span>
                            <span v-else-if="scope.row.type == 100">【会员邀请】</span>
                            <span v-else-if="scope.row.type == 100">【订单管理】</span>
                            <span>{{scope.row.content}}</span>
                        </p>
                    </template>
                </el-table-column>
                <el-table-column prop="id" label="时间" align="center" width="150">
                    <template slot-scope="scope">
                        {{scope.row.createdTime | formatDateAll}}
                    </template>
                </el-table-column>
                <el-table-column prop="id" label="操作" align="center" width="150">
                    <template slot-scope="scope">
                        <el-button type="primary">{{scope.row.buttonName}}</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="block">
                <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-size="page.pageSize"
                    :current-page="page.currentPage"
                    layout="total, prev, pager, next, jumper"
                    :total="page.totalPage">
                </el-pagination>
            </div>
            <span class="block" style="float: left;">
                <span class="select-all" @click="selectAll([...tableData])" >全选</span>
                <el-button type="primary" @click="changeStatus()" >标记为已读</el-button>
            </span>
        </el-card>
    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import moment from 'moment';
    import { myMixinTable } from '@/JS/commom';
    import request from '@/http/http.js';
    export default {
        components: { vBreadcrumb },
        mixins: [myMixinTable],
        data() {
            return {
                form: {
                    type: '',
                    time: []
                },
                loading: false,
                typeArr: [
                    { label: '全部', value: '' },
                    { label: '产品礼包', value: '100' },
                    { label: '商品库存', value: '200' },
                    { label: '营销工具', value: '300' },
                    { label: '奖品管理', value: '400' },
                    { label: '广告位', value: '500' },
                    { label: '店铺举报', value: '600' },
                    { label: '会员邀请', value: '700' },
                    { label: '订单管理', value: '800' }
                ],
                tableData: [],
                multipleSelection: []
            };
        },
        activated() {
            this.submitForm();
        },
        methods: {
            submitForm: function() {
                this.form.time = this.form.time ? this.form.time : [];
                const data = {
                    page: this.page.currentPage,
                    pageSize: this.page.pageSize,
                    type: this.form.type,
                    startTime: this.form.time.length != 0 ? moment(this.form.time[0]).format('YYYY-MM-DD HH:mm:ss') : '',
                    endTime: this.form.time.length != 0 ? moment(this.form.time[1]).format('YYYY-MM-DD HH:mm:ss') : ''
                };
                this.loading = true;
                request.queryMessagePage(data).then(res => {
                    this.loading = false;
                    this.tableData = res.data.data;
                    this.page.totalPage = res.data.totalNum;
                }).catch(err => {
                    this.loading = false;
                    console.log(err);
                });
            },
            // 全选操作
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            selectAll(rows) {
                if (rows) {
                    rows.forEach(row => {
                        this.$refs.table.toggleRowSelection(row);
                    });
                }
            },
            // 批量已读
            changeStatus() {
                if (this.multipleSelection.length === 0) return;
                const idArr = [];
                this.multipleSelection.forEach(v => {
                    idArr.push(v.id);
                });
                request.readMessages({ ids: idArr.join(',') }).then(res => {
                    this.$message.success(res.msg);
                    this.submitForm();
                }).catch(err => {
                    console.log(err);
                });
            }
        }
    };
</script>

<style lang="less" scoped>
.message{
    .msg-content{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .select-all{
        font-size: 14px;
        margin:0 15px 0 20px;
        cursor: pointer;
    }
    .block{
        margin: 10px 0;
    }
}
</style>
