<template>
    <div class="product-order-list" v-loading="pageLoading">
        <el-table v-if="tableData.length==0" border>
            <el-table-column label="商品信息" align="center"></el-table-column>
            <el-table-column label="单价  数量" align="center"></el-table-column>
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
                    <td>单价<span class="marl20">数量</span></td>
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
                        <div style="width:300px">
                            <el-checkbox @change="orderCheckBox(v)" v-model="v.checked"></el-checkbox><span class="marl20">平台订单号 </span><span class="marl20">{{v.warehouseOrder.platformOrderNo}}</span>
                        </div>
                        <div style="width:300px">仓库订单号 <span class="marl20">{{v.warehouseOrder.warehouseOrderNo}}</span></div>
                        <div>下单时间 <span class="marl20">{{v.warehouseOrder.createTime|formatDateAll}}</span></div>
                        <div>
                            <el-popover v-auth="'order.orderList.bj'" placement="bottom" width="150" v-model="v.isShowPop" trigger="hover">
                                <span slot="reference" style="cursor:pointer">标记 &nbsp <span class="star" :style="{color:v.warehouseOrder.starColor}">★</span></span>
                                <span v-for="(v1,k1) in markArr" :key="k1" @click="changeColor(v1,v)" :style="{color:v1.label,fontSize:'22px',cursor:'pointer',marginRight:'5px'}">★</span>
                                <el-input v-model="v.warehouseOrder.remark" placeholder="请输入备注"></el-input>
                            </el-popover>
                            <el-button v-if="v.warehouseOrder.status==2" v-auth="'xnfh'" type="primary" @click="sendGoods(v)">虚拟发货</el-button>
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
                        <span>{{value.unitPrice | formatMoney}}</span>
                        <span class="num">{{value.quantity}}</span>
                    </td>
                    <td class="text-left" :rowspan="v.productOrders.length" v-if="index==0">
                        <div>应付金额：{{v.warehouseOrder.dueAmount | formatMoney}}</div>
                        <div v-if="v.warehouseOrder.status!=1">实付金额：{{v.warehouseOrder.payAmount | formatMoney}}</div>
                    </td>
                    <td class="text-left" :rowspan="v.productOrders.length" v-if="index==0">
                        <div>用户账号：{{v.warehouseOrder.userPhone}}</div>
                        <div>收货人姓名：{{v.warehouseOrder.receiver}}</div>
                        <div v-if="v.warehouseOrder.message">用户留言：{{v.warehouseOrder.message}}</div>
                        <div v-if="v.warehouseOrder.platformRemarks">平台备注：{{v.warehouseOrder.platformRemarks}}</div>
                    </td>
                    <td class="text-left" :rowspan="v.productOrders.length" v-if="index==0">
                        <div v-if="v.warehouseOrder.warehouseType>2">供应商：{{v.warehouseOrder.supplierName}}</div>
                        <div>发货仓库：{{warehouseArr[v.warehouseOrder.warehouseType-1]}}</div>
                        <div v-if="v.warehouseOrder.status==2||v.warehouseOrder.status==3">推送状态：{{pushStatusArr[v.warehouseOrder.subStatus]}}</div>
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
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="page.pageSize" :current-page="page.currentPage" layout="total, prev, pager, next, jumper" :total="page.totalPage">
            </el-pagination>
        </div>
        <!--虚拟发货-->
        <el-dialog title="虚拟发货" :visible.sync="mask">
            <el-form :model="form">
                <el-form-item label="物流单号">
                    <el-input v-model="form.expressNo" placeholder="请输入物流单号"></el-input>
                </el-form-item>
                <el-form-item label="物流公司">
                    <el-select v-model="form.expressCode">
                        <el-option value="">请选择</el-option>
                        <el-option v-for="(v,k) in logicList" :key="k" :label="v.name" :value="v.code"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="btnLoading" @click="sendSure('form')">确 认</el-button>
                <el-button @click="mask=false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import request from '@/http/http.js';
import { myMixinTable } from '@/JS/commom';

export default {
    mixins: [myMixinTable],
    data() {
        return {
            starArr: [{ label: '红色标记', value: '1' }, { label: '蓝色标记', value: '2' }, { label: '绿色标记', value: '3' }, { label: '黄色标记', value: '4' }, { label: '紫色标记', value: '5' }],
            markArr: [{ label: 'red', value: '1' }, { label: 'skyblue', value: '2' }, { label: 'lightgreen', value: '3' }, { label: 'orange', value: '4' }, { label: 'purple', value: '5' }],
            lockStatusArr: ['未锁定', '已锁定', '无需锁定'], // 锁定状态: 0.未锁定 1.已锁定 2.无需锁定
            warehouseArr: ['自建仓', '加盟仓', '虚拟仓', '供应商仓'], // 仓库类型: 1.自建仓 2.加盟仓，3.虚拟仓，4.供应商仓
            tableData: [],
            pageLoading: false,
            data: {},
            statusArr: ['待付款', '已付款', '已发货', '交易完成', '交易关闭'],
            pushStatusArr: ['无需推送', '等待推送', '推送失败', '推送成功'], // 0.无需推送 1.未推送 2.推送失败 3.推送成功
            warehouseOrderNos: [],
            // 虚拟发货
            warehouseOrderNo: '',
            mask: false,
            btnLoading: false,
            form: {
                expressNo: '',
                expressCode: ''
            },
            logicList: []
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
            request
                .queryOrderPageList(this.data)
                .then(res => {
                    this.pageLoading = false;
                    for (const i in res.data.data) {
                        res.data.data[i].warehouseOrder.starColor = this.markArr[res.data.data[i].warehouseOrder.markStar - 1] === undefined || null ? '#ccc' : this.markArr[res.data.data[i].warehouseOrder.markStar - 1].label;
                        res.data.data[i].warehouseOrder.remark = res.data.data[i].warehouseOrder.platformRemarks;
                        res.data.data[i].productOrders.forEach((v, k) => {
                            const tempTitle = v.specTitle.split('@');
                            const tempValue = v.specValues.substring(1, v.specValues.length - 1).split('@');
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
                })
                .catch(err => {
                    this.pageLoading = false;
                    console.log(err);
                });
        },
        // 物流公司查询
        getLogic() {
            request.sysExpressQuery({ page: 1, pageSize: 10000 }).then(res => {
                this.logicList = [];
                this.logicList = res.data.data || [];
            });
        },
        // 修改星级
        changeColor(v1, v) {
            const data = {};
            data.warehouseOrderNo = v.warehouseOrder.warehouseOrderNo;
            data.markStatus = v1.value;
            data.platformRemarks = v.warehouseOrder.remark;
            request
                .orderSign(data)
                .then(res => {
                    this.$message.success(res.msg);
                    v.warehouseOrder.starColor = v1.label;
                    v.isShowPop = false;
                    v.warehouseOrder.platformRemarks = v.warehouseOrder.remark;
                })
                .catch(err => {
                    console.log(err);
                });
        },
        // 推送云仓
        pushCloud() {
            const data = this.warehouseOrderNos;
            for (let i = 0; i < this.tableData.length; i++) {
                for (let j = 0; j < this.warehouseOrderNos.length; j++) {
                    if (this.warehouseOrderNos[j] === this.tableData[i].warehouseOrder.warehouseOrderNo) {
                        if (this.tableData[i].warehouseOrder.status!==2||this.tableData[i].warehouseOrder.warehouseType!==2||this.tableData[i].warehouseOrder.subStatus === 3) {
                            return this.$message.warning('请选择已付款的加盟仓订单');
                        }
                    }
                }
            }
            request
                .orderSendOut(data)
                .then(res => {
                    this.$message.success(res.msg);
                    this.warehouseOrderNos = [];
                    this.getList(this.page.currentPage);
                })
                .catch(err => {
                    console.log(err);
                });
        },
        // 订单详情
        orderInfo(row) {
            sessionStorage.setItem('orderInfoId', row.id);
            this.$router.push({ name: 'orderInfo', query: { orderInfoId: row.id } });
        },
        // 订单多选框
        orderCheckBox(row) {
            if (row.checked) {
                this.warehouseOrderNos.push(row.warehouseOrder.warehouseOrderNo);
            } else {
                this.warehouseOrderNos.forEach((v, k) => {
                    if (v === row.warehouseOrder.warehouseOrderNo) {
                        this.warehouseOrderNos.splice(k, 1);
                    }
                });
            }
        },
        // 取消订单
        cancelOrder(id) {
            const data = {
                warehouseOrderId: id
            };
            request
                .cancelOrder(data)
                .then(res => {
                    this.$message.success(res.msg);
                    this.getList(1);
                })
                .catch(err => {
                    console.log(err);
                });
        },
        // 虚拟发货
        sendGoods(row) {
            this.mask = true;
            this.form.expressNo = '';
            this.form.expressCode = '';
            this.warehouseOrderNo = row.warehouseOrder.warehouseOrderNo;
            this.getLogic();
        },
        sendSure(formName) {
            const data = this[formName];
            data.warehouseOrderNo = this.warehouseOrderNo;
            if (!data.expressCode || !data.expressNo) {
                return this.$message.warning('请输入物流单号和物流公司');
            }
            this.logicList.forEach((v, k) => {
                if (this.form.expressCode === v.code) {
                    data.expressName = v.name;
                }
            });
            this.btnLoading = true;
            request
                .fictitiousDelivery(data)
                .then(res => {
                    this.$message.success(res.msg);
                    this.mask = false;
                    this.btnLoading = false;
                    this.getList(this.page.currentPage);
                })
                .catch(err => {
                    console.log(err);
                    this.btnLoading = false;
                    this.mask = false;
                });
        }
    }
};
</script>

<style lang='less' scoped>
.product-order-list {
    .order-list-table {
        font-size: 12px;
        width: 100%;
        color: #606266;
        border: 1px solid #ebeef5;
        border-collapse: collapse;
        margin-bottom: 20px;
        line-height: 23px;
        td {
            border: 1px solid #ebeef5;
            padding: 8px;
            text-align: center;
        }
        .head {
            background: #eee;
            color: #000;
            font-size: 14px;
            text-align: left;
            div {
                display: inline-block;
                width: 20%;
            }
        }
        .marl20 {
            margin-left: 20px;
        }
        .name {
            float: left;
            position: relative;
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
                bottom: 5px;
                width: 270px;
            }
        }
        .num {
            margin-left: 20px;
        }
        .order-status {
            margin-bottom: 10px;
        }
        .color-blue {
            color: #33b4ff;
            cursor: pointer;
        }
        .text-left {
            text-align: left;
        }
    }
    .block {
        margin: 20px 0;
    }
    /deep/.el-dialog {
        .el-input {
            display: inline;
            .el-input__inner {
                width: 300px;
            }
        }
        .el-input__suffix {
            top: -5px;
        }
    }
}
</style>
