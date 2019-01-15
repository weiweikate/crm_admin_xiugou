<template>
    <div class="deliver-coupon">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card class="mb10">
            <el-form :model="form" ref="form" inline label-width="120px">
                <el-form-item prop="code" label="补发方式">
                    <el-select v-model="form.createUser">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="筛选补发" value="1"></el-option>
                        <el-option label="批量补发" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="createUser" label="补发状态">
                    <el-select v-model="form.createUser">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="审核中" value="1"></el-option>
                        <el-option label="已审核" value="2"></el-option>
                        <el-option label="审核驳回" value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="name" label="审核者">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item prop="createTime" label="审核时间">
                    <el-date-picker type="datetimerange" format="yyyy-MM-dd" v-model="form.createTime" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
                </el-form-item>
                <el-form-item prop="操作时间" label="审核时间">
                    <el-date-picker type="datetimerange" format="yyyy-MM-dd" v-model="form.createTime" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
                </el-form-item>
                <el-form-item prop="updateUser" label="操作者">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label=" ">
                    <el-button @click="getList(1)" type="primary">查 询</el-button>
                    <el-button @click="resetForm('form')" >重 置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card>
            <el-button type="primary" class="mb10" @click="dialogVisible = true" v-auth="'yunying.marketToolsManage.ggk.xzggk'">发放优惠券</el-button>
            <el-table :data="tableData" border stripe>
                <el-table-column prop="code" label="编号" align="center"></el-table-column>
                <el-table-column prop="name" label="优惠券名称" align="center"></el-table-column>
                <el-table-column prop="numItems" label="优惠券ID" align="center"></el-table-column>
                <el-table-column prop="sumTotalNum" label="优惠券类型" align="center"></el-table-column>
                <el-table-column prop="residualQuantity" label="补发方式" align="center"></el-table-column>
                <el-table-column prop="residualQuantity" label="补发人数" align="center"></el-table-column>
                <el-table-column label="补发状态" align="center">
                    <template slot-scope="scope">
                        <template v-if="scope.row.status==1">正常</template>
                        <template v-if="scope.row.status==2">已暂停</template>
                    </template>
                </el-table-column>
                <el-table-column label="创建人/创建时间" align="center">
                    <template slot-scope="scope">{{scope.row.createName}}<br>{{scope.row.createTime|formatDateAll}}</template>
                </el-table-column>
                <el-table-column prop="residualQuantity" label="操作者" align="center"></el-table-column>
                <el-table-column label="操作时间" align="center">
                    <template slot-scope="scope">{{scope.row.updateTime|formatDateAll}}</template>
                </el-table-column>
                <el-table-column prop="residualQuantity" label="发放说明" align="center"></el-table-column>
                <el-table-column prop="residualQuantity" label="审核者" align="center"></el-table-column>
                <el-table-column label="审核时间" align="center">
                    <template slot-scope="scope">{{scope.row.updateTime|formatDateAll}}</template>
                </el-table-column>
                <el-table-column prop="residualQuantity" label="审核说明" align="center"></el-table-column>
                <el-table-column prop="residualQuantity" label="操作" align="center"></el-table-column>
                <el-table-column label="操作" width="320px">
                    <template slot-scope="scope">
                        <el-button type="primary" v-if="scope.row.status==1" @click="showTip(scope.row.code, '2')" v-auth="'yunying.marketToolsManage.ggk.zt'">暂停</el-button>
                        <el-button type="primary" v-if="scope.row.status==2" @click="showTip(scope.row.code, '1')" v-auth="'yunying.marketToolsManage.ggk.kq'">开启</el-button>
                        <el-button type="warning" @click="editCard(scope.row.id)" v-auth="'yunying.marketToolsManage.ggk.bj'">编辑</el-button>
                        <el-button type="success" @click="toDetail(scope.row.id)" v-auth="'yunying.marketToolsManage.ggk.xq'">详情</el-button>
                        <el-button type="danger" v-if="scope.row.status==2" @click="showTip(scope.row.code, '0')" v-auth="'yunying.marketToolsManage.ggk.sc'">删除</el-button>
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
        <el-dialog
            title="优惠券补发"
            :visible.sync="dialogVisible"
            width="500px"
            :before-close="handleClose">
            <el-form :model="queryForm" :rules="rules" ref="queryForm" inline label-width="120px">
                <el-form-item prop="couponId" label="优惠券ID">
                    <el-input class="w200" v-model="queryForm.couponId"></el-input>
                    <el-select style="width: 100px" v-model="queryForm.couponType">
                        <el-option label="普通优惠券" value="1"></el-option>
                        <!--<el-option label="周期券" value="2"></el-option>-->
                        <!--<el-option label="靓号体验券" value="3"></el-option>-->
                        <!--<el-option label="拼店体验券" value="4"></el-option>-->
                    </el-select>
                </el-form-item>
                <el-form-item prop="deliverWays" label="补发方式">
                    <el-radio-group v-model="queryForm.deliverWays">
                        <el-radio label="1">条件补发</el-radio>
                        <el-radio label="2">定向补发</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label=" ">
                    <el-button @click="getList(1)" type="primary">查 询</el-button>
                    <el-button @click="resetForm('queryForm')" >重 置</el-button>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                <el-button @click="dialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>
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
                nav: ['运营管理', '营销工具管理', '优惠券补发'],
                dialogVisible: false,
                form: {
                    code: '',
                    createUser: '',
                    createTime: [],
                    name: '',
                    updateUser: '',
                    updateTime: []
                },
                queryForm: {
                    couponId: '',
                    couponType: '1',
                    deliverWays: '1',
                    deliverLevels: '',
                    regDate: [],
                    tip: ''
                },
                rules: {
                    couponId: [
                        { required: true, message: '请输入优惠券ID', trigger: 'blur' }
                    ],
                    deliverWays: [
                        { required: true, message: '请选择补发方式', trigger: 'blur' }
                    ]
                },
                tableData: []
            };
        },
        mounted() {
            this.getList(this.page.currentPage);
        },
        methods: {
            getList(val) {
                const data = {
                    page: val,
                    pageSize: this.page.pageSize,
                    code: this.form.code,
                    createUser: this.form.createUser,
                    name: this.form.name,
                    updateUser: this.form.updateUser,
                    startTime: this.form.createTime ? utils.formatTime(this.form.createTime[0], 1) : '',
                    endTime: this.form.createTime ? utils.formatTime(this.form.createTime[1], 1) : '',
                    updateStartTime: this.form.updateTime ? utils.formatTime(this.form.updateTime[0], 1) : '',
                    updateEndTime: this.form.updateTime ? utils.formatTime(this.form.updateTime[1], 1) : ''
                };
                this.page.currentPage = val;
                this.tableData = [];
                request.queryScratchCardList(data).then(res => {
                    this.tableData = res.data.data;
                    this.page.totalPage = res.data.totalNum;
                }).catch(err => {
                    console.log(err);
                });
            },
            //   重置表单
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.getList(this.page.currentPage);
            },
            // 关闭弹窗
            handleClose() {
                this.dialogVisible = false;
            }
        }
    };
</script>

<style lang="less" scoped>
    .deliver-coupon{
        .w200 {
            width: 200px;
        }
    }
</style>
