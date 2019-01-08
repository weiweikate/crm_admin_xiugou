<template>
    <div>
        <v-breadcrumb :nav="['运营管理','经验值专区管理','查看']"></v-breadcrumb>
        <el-card class="mt20" v-loading="loading">
            <div class="title">活动信息</div>
            <el-form ref="form" label-width="100px">
                <el-form-item label="活动名称">
                   {{form.name}}
                </el-form-item>
                <el-form-item label="活动规则">
                    <div class="regular-list" v-if="form.rules">
                        <div class="regular-item mb10" v-for="(item,index) in form.rules">
                            购买满{{item.startPrice}}元，经验值翻{{item.rate}}倍
                        </div>
                    </div>
                </el-form-item>

                <!-- 可选是否赠送优惠券S -->
                <el-form-item label="活动优惠券" class="border-dash">
                    <span>{{form.couponId}}</span>
                    <span style="color:red;display: inline-block;margin-left: 15px;" v-if="couponInfo.status === 0">已失效</span>
                    <span style="color:red;display: inline-block;margin-left: 15px;" v-if="couponInfo.totalNumber === 0">可发放数量不足</span>
                    <div class="coupon-name">{{couponInfo.name}}</div>
                    <div class="coupon-regular mb10">
                        每{{form.startPrice}}元，赠送优惠券{{form.startCount}}张
                        <div>单笔订单最多可赠送优惠券数量{{form.maxCount}}张</div>
                    </div>
                </el-form-item>
                <!-- 可选是否赠送优惠券E -->

                <el-form-item label="活动开始时间" label-width="120" class="border-dash">
                    {{form.startTime | formatDateAll}}
                </el-form-item>
                <el-form-item label="活动结束时间" label-width="120">
                    {{form.endTime | formatDateAll}}
                </el-form-item>
                <el-form-item label="活动商品" class="border-dash">
                    <el-table
                        :data="tableData"
                        border
                        v-loading="tableLoading"
                        style="width: 100%;">
                        <el-table-column
                            prop="spuCode"
                            label="SPU编码"
                            align="center"
                            width="180">
                        </el-table-column>
                        <el-table-column
                            prop="name"
                            label="商品名称"
                            align="center">
                        </el-table-column>
                        <el-table-column
                            align="center"
                            width="100"
                            label="V0价">
                            <template slot-scope="scope">
                                <span v-if="scope.row.minPrice === scope.row.maxPrice">￥{{scope.row.minPrice || '0.00'}}</span>
                                <span v-else>￥{{scope.row.minPrice || '0.00'}} ~ ￥{{scope.row.maxPrice || '0.00'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="saleStock"
                            align="center"
                            width="100"
                            label="可售库存">
                        </el-table-column>
                        <el-table-column
                            prop="saleNum"
                            align="center"
                            width="100"
                            label="销量">
                        </el-table-column>
                        <el-table-column
                            align="center"
                            width="100"
                            label="商品状态">
                            <template slot-scope="scope">
                                {{goodStatus[scope.row.productStatus]}}
                            </template>
                        </el-table-column>
                        <el-table-column
                            align="center"
                            width="100"
                            label="状态">
                            <template slot-scope="scope">
                                {{goodActiveStatus[scope.row.status]}}
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="show-more" v-if="!showMore" ><el-button @click="showMore = true">查看全部商品</el-button></div>
                </el-form-item>
                <el-form-item label="活动商品" class="border-dash">
                    <div v-if="form.rules">
                        <div class="flex" v-for="rule in form.rules">
                            <div class="flex-item">购买满{{rule.startPrice}}元，经验值翻{{rule.rate}}倍</div>
                            <div class="flex-item">经验值支出：<span class="red">{{rule.expNumber || 0.00}}</span></div>
                            <div class="flex-item">优惠券支出：<span class="red">{{rule.couponNumber || 0.00}}张</span></div>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="绑券记录" class="border-dash">
                    <div class="flex" v-for="c in form.coupons">
                        <div style="width: 120px;">优惠券ID：{{c.couponId}}</div>
                        <div class="flex-item">优惠券名称：{{c.name}}</div>
                        <div class="flex-item">优惠券支出：{{c.totalNumber || 0}}张</div>
                        <div class="flex-item">绑券时间：{{c.createTime | formatDateAll}}</div>
                    </div>
                </el-form-item>
            </el-form>

        </el-card>

    </div>
</template>
<script>
    import vBreadcrumb from '../../../common/Breadcrumb.vue';
    import request from '@/http/http';
    import moment from 'moment';
    export default {
        name: 'ExpAdd',
        data() {
            return {
                goodStatus: {
                    0: '已删除',
                    1: '待发布',
                    2: '待审核',
                    3: '已通过',
                    4: '已上架',
                    5: '已驳回',
                    6: '已下架'
                },
                goodActiveStatus: {
                    1: '已开启',
                    0: '已关闭'
                },
                loading: false,
                tableLoading: false,
                form: {},
                tableData: [],
                originTableData: [],
                activityCode: '',
                couponInfo: {},
                showMore: false
            };
        },
        watch: {
            showMore() {
                this.tableData = [].concat(this.originTableData);
            }
        },
        methods: {
            // 不做分页展示 一次性取全部，开始展示30个 点击显示全部再全显示
            getList() {
                const data = {
                    activityCode: this.activityCode,
                    page: 1,
                    pageSize: 2000
                };
                request.queryActivityProdPageList(data).then(res => {
                    this.tableLoading = false;
                    this.originTableData = res.data.data;
                    this.tableData = res.data.data.slice(0, 20);
                }).catch(res => {
                    this.tableLoading = false;
                    this.$message.warning(res.msg);
                });
            },
            getCouponById(couponId) {
                request.getCouponById({ id: couponId }).then(res => {
                    this.couponInfo = res.data;
                }).catch(res => {
                    this.$message.warning(res.msg);
                });
            },
            getExpActiveDetail(activityCode) {
                this.loading = true;
                request.queryExpByCode({ code: activityCode }).then(res => {
                    this.loading = false;
                    const data = Object.assign({}, res.data);
                    data.startTime = moment(data.startTime).format('YYYY-MM-DD HH:mm:ss');
                    data.endTime = moment(data.endTime).format('YYYY-MM-DD HH:mm:ss');
                    this.form = data;
                    this.tableLoading = true;
                    this.activityCode = res.data.activityCode;
                    if (data.couponId) {
                        this.getCouponById(data.couponId);
                    }
                    this.getList();
                }).catch(res => {
                    this.loading = false;
                    this.$message.warning(res.msg);
                });
            }
        },
        mounted() {
            const activityCode = this.$route.query.id;
            if (!activityCode || activityCode === 'undefined' || activityCode === 'null') return this.$message.warning('错误的活动id');
            this.getExpActiveDetail(activityCode);
        },
        components: {
            vBreadcrumb
        }
    };
</script>
<style lang='less' scoped>
    @import "styles/exp";
    .show-more {
        text-align: center;
        margin-top: 10px;
        color: #5a5a5a;
        font-size: 12px;
    }
    .border-dash {
        border-top: 1px dashed #e5e5e5;
        padding-top: 20px;
    }
</style>
