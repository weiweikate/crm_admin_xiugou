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
                        <div><el-checkbox @change="orderCheckBox(v)" v-model="v.checked"></el-checkbox><span class="marl20">平台订单号 </span><span class="marl20">{{v.warehouseOrder.platformOrderNo}}</span></div>
                        <div>仓库订单号 <span class="marl20">{{v.warehouseOrder.warehouseOrderNo}}</span></div>
                        <div>下单时间 <span class="marl20">{{v.warehouseOrder.createTime|formatDateAll}}</span></div>
                        <div>
                            <el-popover v-auth="'order.orderList.bj'" placement="bottom" width="150" v-model="v.isShowPop" trigger="hover">
                                            <span slot="reference" style="cursor:pointer">标记 &nbsp <span class="star"
                                                                                                         :style="{color:markArr[v.warehouseOrder.markStar-1]}">★</span></span>
                                <span v-for="(v1,k1) in markArr" :key="k1" @click="changeColor(v1,v)"
                                      :style="{color:v1.label,fontSize:'22px',cursor:'pointer',marginRight:'5px'}">★</span>
                                <el-input v-model="v.warehouseOrder.markStar" placeholder="请输入备注"></el-input>
                            </el-popover>
                        </div>
                    </td>
                </tr>
                <tr v-for="(value,index) in v.productOrders" :key="index">
                    <td style="width: 400px">
                        <div class="name">
                            <img :src="value.specImg" alt="">
                            <div class="pro-name">{{value.productName}}</div>
                            <div class="pro-spec">{{value.spec}}</div>
                            <div style="clear: both"></div>
                        </div>
                    </td>
                    <td>
                        <span>¥{{value.unitPrice}}</span>
                        <span class="num">{{value.quantity}}</span>
                    </td>
                    <td class="text-left" :rowspan="v.productOrders.length" v-if="index==0">
                        应付金额：¥{{value.payAmount}}
                    </td>
                    <td class="text-left" :rowspan="v.productOrders.length" v-if="index==0">
                        <div>用户账号：{{v.warehouseOrder.userPhone}}</div>
                        <div>收货人姓名：{{v.warehouseOrder.receiver}}</div>
                        <div>客服备注：{{v.warehouseOrder.platformRemarks}}</div>
                    </td>
                    <td class="text-left" :rowspan="v.productOrders.length" v-if="index==0">
                        <div>供应商：{{v.warehouseOrder.supplierName}}</div>
                        <div>发货仓库：{{warehouseArr[v.warehouseOrder.warehouseType-1]}}</div>
                        <div>推送状态：{{pushStatusArr[v.warehouseOrder.subStatus]}}</div>
                        <div>锁定状态：{{lockStatusArr[v.warehouseOrder.lockStatus]}}</div>
                    </td>
                    <td class="text-left" :rowspan="v.productOrders.length" v-if="index==0">
                        <div>开具发票：{{v.orderInvoiceInfo?'是':'否'}}</div>
                    </td>
                    <td :rowspan="v.productOrders.length" v-if="index==0">
                        <div class="order-status">{{statusArr[v.warehouseOrder.status-1]}}</div>
                        <!--<div class="color-blue" v-if="v.status<4" @click="cancelOrder(v)">取消订单</div>-->
                        <div class="color-blue" @click="$router.push({path:'/orderInfo',query:{orderInfoId:v.warehouseOrder.warehouseOrderNo}})">订单详情</div>
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
                lockStatusArr: ['未锁定', '已锁定', '无需锁定'], // 锁定状态: 0.未锁定 1.已锁定 2.无需锁定
                warehouseArr: ['自建仓', '加盟仓', '供应商仓', '虚拟仓'], // 仓库类型: 0. 1.自建仓 2.加盟仓，3.供应商仓
                tableData: [],
                pageLoading: false,
                data: {},
                statusArr: ['待付款', '已付款', '已发货', '交易完成', '交易关闭'],
                pushStatusArr: ['无需推送', '未推送', '推送失败', '推送成功'], // 0.无需推送 1.未推送 2.推送失败 3.推送成功
                warehouseOrderNos: []
            };
        },
        methods: {
            // 提交表单
            getList(val) {
                this.data.page = val;
                this.data.pageSize = this.page.pageSize;
                this.tableData = [];
                this.pageLoading = true;
                this.page.currentPage = val;
                request.queryOrderPageList(this.data).then(res => {
                    this.pageLoading = false;
                    for (const i in res.data.data) {
                        res.data.data[i].warehouseOrder.starColor =
                            this.markArr[res.data.data[i].warehouseOrder.markStar - 1] == undefined
                                ? '#ccc'
                                : this.markArr[res.data.data[i].warehouseOrder.markStar - 1].label;
                        res.data.data[i].productOrders.forEach((v, k) => {
                            const tempTitle = v.specTitle.split(',');
                            const tempValue = v.specValues.split(',');
                            v.spec = [];
                            tempTitle.forEach((v1, k1) => {
                                const temp = v1 + ':' + tempValue[k1] + '    ';
                                v.spec.push(temp);
                            });
                            v.spec = v.spec.join('  ');
                        });
                    }
                    this.tableData = res.data.data;
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
            // 推送云仓
            pushCloud(row) {
                const data = {
                    warehouseOrderNos: ''
                };
                if (row) {
                    data.warehouseOrderNos = row.warehouseOrder.warehouseOrderNo;
                } else {
                    data.warehouseOrderNos = this.warehouseOrderNos.join(',');
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
                    this.warehouseOrderNos.push(row.warehouseOrder.warehouseOrderNo);
                } else {
                    this.warehouseOrderNos.forEach((v, k) => {
                        if (v == row.warehouseOrder.warehouseOrderNo) {
                            this.warehouseOrderNos.splice(k, 1);
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
            },
            // 取消订单
            cancelOrder(id) {
                const data = {
                    warehouseOrderId: id
                };
                request.cancelOrder(data).then(res => {
                    this.$message.success(res.msg);
                    this.getList(1);
                }).catch(err => {

                });
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
                background: #eee;
                color: #000;
                font-size: 14px;
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
