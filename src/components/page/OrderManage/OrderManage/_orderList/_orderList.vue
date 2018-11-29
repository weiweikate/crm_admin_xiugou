<template>
    <div class="product-order-list" v-loading="pageLoading">
        <el-table v-if="tableData.length==0" border>
            <el-table-column label="商品信息" align="center"></el-table-column>
            <el-table-column label="单价  元" align="center"></el-table-column>
            <el-table-column label="订单金额" align="center"></el-table-column>
            <el-table-column label="收货信息" align="center"></el-table-column>
            <el-table-column label="发货信息" align="center"></el-table-column>
            <el-table-column label="发票信息" align="center"></el-table-column>
            <el-table-column label="操作" align="center"></el-table-column>
        </el-table>
        <table v-else class="order-list-table">
            <thead>
                <tr>
                    <td>商品信息</td>
                    <td>单价<span class="marl20">元</span></td>
                    <td>订单金额</td>
                    <td>收货信息</td>
                    <td>发货信息</td>
                    <td>发票信息</td>
                    <td>操作</td>
                </tr>
            </thead>
            <tbody v-for="(v,k) in tableData" :key="k">
                <tr>
                    <td colspan="7" class="head">
                        <div><el-checkbox @change="orderCheckBox(v)" v-model="v.checked"></el-checkbox><span class="marl20">平台订单号 </span><span class="marl20">{{v.orderNum}}</span></div>
                        <div>仓库订单号 <span class="marl20">{{v.orderNum}}</span></div>
                        <div>下单时间 <span class="marl20">{{v.createTime|formatDateAll}}</span></div>
                        <div>
                            <el-popover v-auth="'order.orderList.bj'" placement="bottom" width="150" v-model="v.isShowPop" trigger="hover">
                                            <span slot="reference" style="cursor:pointer">标记 &nbsp <span class="star"
                                                                                                         :style="{color:v.starColor}">★</span></span>
                                <span v-for="(v1,k1) in markArr" :key="k1" @click="changeColor(v1,v)"
                                      :style="{color:v1.label,fontSize:'22px',cursor:'pointer',marginRight:'5px'}">★</span>
                                <el-input v-model="v.adminRemark" placeholder="请输入备注"></el-input>
                            </el-popover>
                        </div>
                    </td>
                </tr>
                <tr v-for="(value,index) in v.orderProductList" :key="index">
                    <td style="width: 400px">
                        <div class="name">
                            <img :src="value.specImg" alt="">
                            <div class="pro-name">{{value.productName}}</div>
                            <div class="pro-spec">{{value.spec}}</div>
                            <div style="clear: both"></div>
                        </div>
                    </td>
                    <td>
                        <span>¥{{value.price}}</span>
                        <span class="num">{{value.num}}</span>
                    </td>
                    <td class="text-left" :rowspan="v.orderProductList.length" v-if="index==0">
                        应付金额：{{v.totalPrice}}
                    </td>
                    <td class="text-left" :rowspan="v.orderProductList.length" v-if="index==0">
                        <div>用户账号：13333333333</div>
                        <div>收货人姓名：{{v.receiver}}</div>
                        <div>客服备注：{{v.remark}}</div>
                    </td>
                    <td class="text-left" :rowspan="v.orderProductList.length" v-if="index==0">
                        <div>供应商：13333333333</div>
                        <div>发货仓库：{{v.receiver}}</div>
                        <div>推送状态：{{v.remark}}</div>
                        <div>锁定状态：{{v.remark}}</div>
                    </td>
                    <td class="text-left" :rowspan="v.orderProductList.length" v-if="index==0">
                        <div>开具发票：13333333333</div>
                    </td>
                    <td :rowspan="v.orderProductList.length" v-if="index==0">
                        <div class="order-status">待付款</div>
                        <div class="color-blue" v-if="v.status<5">取消订单</div>
                        <div class="color-blue" @click="$router.push({path:'/orderInfo',query:{orderInfoId:v.id}})">订单详情</div>
                    </td>
                </tr>
            </tbody>
        </table>
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
    </div>
</template>

<script>
    import request from '@/http/http.js';
    import { myMixinTable } from '@/JS/commom';
    import moment from 'moment';
    export default {
        mixins: [myMixinTable],
        data() {
            return {
                w: {
                    name: '25%',
                    price: '8%',
                    num: '8%',
                    consignee: '12%',
                    status: '8%',
                    collection: '12%',
                    shipper: '8%',
                    operate: '15%',
                    minWidth: '100px'
                },
                starArr: [
                    { label: '红色标记', value: '1' },
                    { label: '蓝色标记', value: '2' },
                    { label: '绿色标记', value: '3' },
                    { label: '黄色标记', value: '4' },
                    { label: '紫色标记', value: '5' }
                ],
                markArr: [
                    { label: 'red', value: '1' },
                    { label: 'skyblue', value: '2' },
                    { label: 'lightgreen', value: '3' },
                    { label: 'orange', value: '4' },
                    { label: 'purple', value: '5' }
                ],
                tableData: [],
                pageLoading: false,
                data: {},
                // returnType状态
                returnTypeArr: ['退款', '退货', '换货'],
                // 售后状态
                afterSaleStatusArr: ['申请中', '已同意', '已拒绝', '发货中', '云仓发货中', '已完成', '已关闭', '超时关闭'],
                ids: []
            };
        },
        methods: {
            // 提交表单
            getList(val) {
                this.data.page = this.page.currentPage;
                this.data.size = this.page.pageSize;
                this.tableData = [];
                this.pageLoading = true;
                request.queryOrderPageList(this.data).then(res => {
                    this.pageLoading = false;
                    for (const i in res.data.data) {
                        // res.data.data[i].isShowPop = false;
                        res.data.data[i].starColor =
                            this.markArr[res.data.data[i].adminStars - 1] == undefined
                                ? '#ccc'
                                : this.markArr[res.data.data[i].adminStars - 1].label;
                        // res.data.data[i].price =
                        //     res.data.data[i].totalPrice == null
                        //         ? '0'
                        //         : res.data.data[i].totalPrice;
                        res.data.data[i].orderProductList = res.data.data[i].orderProductList || [];
                        this.tableData.push(res.data.data[i]);
                    }
                    this.page.totalPage = res.data.totalNum;
                }).catch(err => {
                    this.pageLoading = false;
                    console.log(err);
                });
            },
            // 修改星级
            changeColor(v1, v) {
                const data = {};
                data.id = v.id;
                data.adminStars = v1.value;
                data.adminRemark = v.adminRemark;
                request.orderSign(data).then(res => {
                    this.$message.success(res.msg);
                    v.starColor = v1.label;
                    v.isShowPop = false;
                }).catch(err => {
                    console.log(err);
                });
            },
            // 跳到售后详情
            toAfterSale(id) {
                sessionStorage.setItem('afterSaleOprId', id);
                this.$router.push({
                    path: '/afterSaleOpr',
                    query: { afterSaleOprId: id }
                });
            },
            // 推送云仓
            pushCloud(row) {
                const data = {
                    ids: []
                };
                if (row) {
                    data.ids.push(row.id);
                } else {
                    data.ids = this.ids;
                }
                request.orderSendOut(data).then(res => {
                    this.$message.success(res.msg);
                    this.getList(this.page.currentPage);
                }).catch(err => {
                    console.log(err);
                });
            },
            // 订单详情
            orderInfo(row) {
                sessionStorage.setItem('orderInfoId', row.id);
                this.$router.push({ name: 'orderInfo', query: { orderInfoId: row.id }});
            },
            // 订单多选框
            orderCheckBox(row) {
                if (row.checked) {
                    this.ids.push(row.id);
                } else {
                    this.ids.forEach((v, k) => {
                        if (v == row.id) {
                            this.ids.splice(k, 1);
                        }
                    });
                }
            },
            // 更改订单状态（单个）
            changeStatus(row, status) {
                if (status == 3) {
                    request.pickUpOrderProduct({ orderProductId: row.id }).then(res => {
                        this.$message.success(res.data.data);
                        this.getList(1);
                    }).catch(err => {
                        console.log(err);
                    });
                }
            }
        }
    };
</script>

<style lang='less' scoped>
    .product-order-list {
        .order-list-table {
            font-size:12px;
            width: 100%;
            color:#606266;
            border: 1px solid #ebeef5;
            border-collapse: collapse;
            margin-bottom: 20px;
            line-height: 23px;
            td {
                border: 1px solid #ebeef5;
                padding: 8px;
                text-align: center;
            }
            .head{
                background: #33b4ff;
                color: #fff;
                text-align: left;
                div{
                    display: inline-block;
                    width: 20%;
                }
            }
            .marl20{
                margin-left: 20px;
            }
            .name {
                float: left;
                position: relative;
                display: inline-block;
                height: 100px;
                text-align: left;
                img {
                    position: absolute;
                    width: 100px;
                    height: 100px;
                    border-radius: 5px;
                    border: 1px solid #eee;
                }
                .pro-name {
                    position: absolute;
                    top: 5px;
                    left: 115px;
                    width: 270px;
                }
                .pro-spec {
                    position: absolute;
                    left: 115px;
                    bottom:5px;
                    width: 270px;
                }
            }
            .num {
              margin-left: 20px;
            }
            .order-status{
                margin-bottom: 10px;
            }
            .color-blue{
                color: #33b4ff;
                cursor: pointer;
            }
            .text-left{
                text-align: left;
            }
        }
        .block {
            margin: 20px 0px;
        }
    }
</style>
