<template>
    <div class="sended-list">
        <v-breadcrumb :nav="['订单管理','支付单列表']"></v-breadcrumb>
        <el-card style="margin:10px 0 20px">
            <el-form ref="form" :inline="true" :model="form" label-width="120px">
                <el-form-item prop="time" label="创建时间">
                    <el-date-picker
                        v-model="form.time"
                        type="datetimerange"
                        format="yyyy-MM-dd"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item prop="deliveryNo" label="发货单号">
                    <el-input style="width:200px" placeholder="请输入发货单号" v-model="form.deliveryNo"></el-input>
                </el-form-item>
                <el-form-item prop="warehouseNo" label="仓库订单号">
                    <el-input style="width:200px" placeholder="请输入仓库订单号" v-model="form.warehouseNo"></el-input>
                </el-form-item>
                <el-form-item prop="status" label="发货单状态">
                    <el-select v-model="form.status" placeholder="全部">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="仓库接收失败" value="1"></el-option>
                        <el-option label="全部发货" value="2"></el-option>
                        <el-option label="等待仓库发货" value="3"></el-option>
                        <el-option label="发货取消" value="4"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button @click="getList(1)" type="primary">查询</el-button>
                    <el-button @click="resetForm('form')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <div class="table-block">
            <el-table v-loading="tableLoading" :data="tableData" border style="width: 100%">
                    <el-table-column :prop="orderProductExpress.expressNo" label="发货单号" align="center"></el-table-column>
                    <el-table-column :prop="orderProductExpress.warehouseOrderNo" label="仓库订单号" align="center"></el-table-column>
                    <el-table-column :prop="orderDelivery.supplierName" label="供应商名称" align="center"></el-table-column>
                    <el-table-column :prop="orderDelivery.freightAmount" label="物流费用" align="center"></el-table-column>
                    <el-table-column :prop="orderProductExpress.expressName" label="物流公司" align="center"></el-table-column>
                    <el-table-column label="发货单状态" align="center">
                        <template slot-scope="scope">
                            <template v-if="scope.row.status == 1">仓库接收失败</template>
                            <template v-if="scope.row.status == 2">全部发货</template>
                            <template v-if="scope.row.status == 3">等待仓库发货</template>
                            <template v-if="scope.row.status == 4">发货取消</template>
                        </template>
                    </el-table-column>
                    <el-table-column label="创建时间" align="center">
                        <template slot-scope="scope">
                            {{scope.row.createTime|formatDateAll}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button type="primary" @click="$router.push({path:'/sendedOrderInfo',query:{sendedOrderInfoId:scope.row.id}})">查看</el-button>
                        </template>
                    </el-table-column>
                </el-table>
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
    import { myMixinTable } from '@/JS/commom';
    import moment from 'moment';
    import request from '@/http/http.js';

    export default {
        components: {
            vBreadcrumb
        },
        mixins: [myMixinTable],
        data() {
            return {

                tableData: [],
                tableLoading: false,
                height: '',
                form: {
                    time: '',
                    deliveryNo: '',
                    warehouseNo: '',
                    status: ''
                }
            };
        },
        created() {
        },
        activated() {
            this.getList(this.page.currentPage);
        },
        methods: {
            // 获取列表
            getList(val) {
                const that = this;
                const data = {
                    page: val,
                    pageSize: this.page.pageSize,
                    status: that.form.status,
                    deliveryNo: that.form.deliveryNo,
                    warehouseNo: that.form.warehouseNo,
                    from: this.form.time[0] ? moment(this.form.time[0]).format('YYYY-MM-DD') : '',
                    to: this.form.time[1] ? moment(this.form.time[1]).format('YYYY-MM-DD') : ''
                };
                this.page.currentPage = val;
                that.tableLoading = true;
                request.getProductBrandList(data).then(res => {
                    that.tableLoading = false;
                    if (!res.data.data) return;
                    that.tableData = res.data.data;
                    that.page.totalPage = res.data.totalNum;
                }).catch(error => {
                    console.log(error);
                    that.tableLoading = false;
                });
            },
            //   重置表单
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.getList(this.page.currentPage);
            }
        }
    };
</script>

<style lang="less">
    .table-block {
        padding: 20px 20px 60px;
        background: #fff
    }
    .block {
        float: right;
        margin-top: 10px
    }
</style>
