<template>
    <div class="after-info">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card :body-style="{ padding: '28px 50px' }">
            <div class="wrap">
                <div class="item-wrap">
                    <div class="title">订单基础信息</div>
                    <div class="item">
                        <span>平台订单号</span>
                        <span>{{orderMsg.orderNum}}</span>
                    </div>
                    <div class="item">
                        <span>仓库订单号</span>
                        <span>{{orderMsg.orderNum}}</span>
                    </div>
                    <div class="item">
                        <span>订单状态</span>
                        <span>{{orderMsg.orderNum}}</span>
                    </div>
                    <div class="item">
                        <span>售后单号</span>
                        <span>{{orderMsg.orderNum}}</span>
                    </div>
                    <div class="item">
                        <span>供应商名称</span>
                        <span>{{orderMsg.orderNum}}</span>
                    </div>
                    <div class="item">
                        <span>用户账号</span>
                        <span>{{orderMsg.orderNum}}</span>
                    </div>
                </div>
                <div class="item-wrap">
                    <div class="title">售后信息</div>
                    <div class="item">
                        <span>售后类型</span>
                        <span>{{orderMsg.orderNum}}</span>
                    </div>
                    <div class="item" v-if="orderMsg.status==1&&orderMsg.status==2">
                        <span>用户申请退款金额</span>
                        <span>{{orderMsg.orderNum}}</span>
                    </div>
                    <div class="item">
                        <span>售后状态</span>
                        <span>{{orderMsg.orderNum}}</span>
                    </div>
                    <div class="item">
                        <span>售后单创建时间</span>
                        <span>{{orderMsg.orderNum}}</span>
                    </div>
                    <div class="item">
                        <span>申请售后原因</span>
                        <span>{{orderMsg.orderNum}}</span>
                    </div>
                    <div class="item">
                        <span>问题描述</span>
                        <span>{{orderMsg.orderNum}}</span>
                    </div>
                    <div class="item">
                        <span>图片信息</span>
                        <span>
                            <viewer :images="orderMsg.imgList">
                                <img v-for="(item,index) in orderMsg.imgList" :key="index" :src="item" alt="">
                            </viewer>
                        </span>
                    </div>
                </div>
                <div class="item-wrap">
                    <div class="title">协商记录</div>
                    <!--售后关闭-->
                    <div class="item" v-if="orderMsg.status==6">
                        <span>用户申请退款金额</span>
                        <span>{{orderMsg.orderNum}}</span>
                    </div>
                    <div class="item">
                        <span>售后审核结果</span>
                        <span>{{orderMsg.orderNum}}</span>
                    </div>
                    <!--待商品寄回，售后完成-->
                    <div class="item" v-if="orderMsg.status==2&&orderMsg.status==5">
                        <span>审核金额调整</span>
                        <span>{{orderMsg.orderNum}}</span>
                    </div>
                    <div class="item" v-if="orderMsg.status>=2">
                        <span>售后审核说明</span>
                        <span>{{orderMsg.orderNum}}</span>
                    </div>
                    <!--待仓库确认，待平台处理-->
                    <div class="item" v-if="orderMsg.status==2&&orderMsg.status==3&&orderMsg.status==4&&orderMsg.status==5">
                        <span>退货信息</span>
                        <span>{{orderMsg.orderNum}}</span>
                    </div>
                    <div class="item" v-if="orderMsg.status!=1">
                        <span>售后审核者</span>
                        <span>{{orderMsg.orderNum}}</span>
                    </div>
                    <!--待仓库确认-->
                    <div class="item" v-if="orderMsg.status==3&&orderMsg.status==4&&orderMsg.status==5">
                        <span>回寄物流公司</span>
                        <span>{{orderMsg.orderNum}}</span>
                    </div>
                    <div class="item" v-if="orderMsg.status==3&&orderMsg.status==4&&orderMsg.status==5">
                        <span>回寄物流单号</span>
                        <span>{{orderMsg.orderNum}}</span>
                    </div>
                    <!--售后完成-->
                    <div class="item" v-if="orderMsg.status==5&&orderMsg.status==6">
                        <span>售后处理结果</span>
                        <span>{{orderMsg.orderNum}}</span>
                    </div>
                    <div class="item" v-if="orderMsg.status==5&&orderMsg.status==6">
                        <span>售后处理说明</span>
                        <span>{{orderMsg.orderNum}}</span>
                    </div>
                    <div class="item" v-if="orderMsg.status==5&&orderMsg.status==6">
                        <span>售后处理者</span>
                        <span>{{orderMsg.orderNum}}</span>
                    </div>
                </div>
            </div>
            <div class="">
                <div class="title">仓库反馈</div>
                <div class="item">
                    <span>退货仓反馈</span>
                    <span></span>
                </div>
                <div class="item">
                    <span>发货仓反馈</span>
                    <span></span>
                </div>
            </div>
            <div class="goods-info">
                <div class="title">商品信息</div>
                <el-table border :data="tableData">
                    <el-table-column prop="" label="商品订单号"></el-table-column>
                    <el-table-column prop="" label="商品信息">
                        <template slot-scope="scope">
                            <div class="name">
                                <img :src="scope.row.specImg" alt="">
                                <span class="pro-name">{{scope.row.productName}}</span>
                                <span class="pro-spec">{{scope.row.spec}}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="" label="SKU编码"></el-table-column>
                    <el-table-column prop="" label="供应商SKU编码"></el-table-column>
                    <el-table-column prop="" label="实付单价"></el-table-column>
                    <el-table-column prop="" label="售后数量"></el-table-column>
                    <el-table-column prop="" label="一元券"></el-table-column>
                    <el-table-column prop="" label="实付金额"></el-table-column>
                </el-table>
            </div>
            <!--待审核-->
            <div class="opr-area" v-if="orderMsg.status==1">
                <div class="title">操作</div>
                <el-form :model="form">
                    <el-form-item label="售后审核结果">
                        <el-radio-group v-model="form.result">
                            <el-radio label="1">审核通过</el-radio>
                            <el-radio label="2">审核驳回</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="审核金额调整">
                        <el-input v-model="form.price"></el-input><span class="tip">元，请在¥0.00~¥20.00区间内调整，其中含运费¥6。66</span>
                    </el-form-item>
                    <el-form-item label="退货信息" class="back-address">
                        <div class="address-area">
                            <div class="supplier-address">
                                <el-radio label="1" v-model="form.address">供应商退货地址</el-radio>
                                <div>陈奕迅 13333333333</div>
                                <div>浙江省杭州市萧山区望京C3-6楼</div>
                            </div>
                            <div class="plat-address">
                                <el-radio label="2" v-model="form.address">平台退货地址</el-radio>
                                <div>陈奕迅 13333333333</div>
                                <div>浙江省杭州市萧山区望京C3-6楼</div>
                            </div>
                            <div class="tip">如需修改，请联系相关人员修改退货信息后再审核</div>
                        </div>
                    </el-form-item>
                    <el-form-item label="售后审核说明">
                        <el-input v-model="form.remark"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary">提交</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <!--待平台处理-->
            <div class="opr-area" v-if="orderMsg.status==2">
                <div class="title">操作</div>
                <el-form :model="form">
                    <el-form-item label="售后处理结果">
                        <el-radio-group v-model="form.result">
                            <el-radio label="1">审核通过</el-radio>
                            <el-radio label="2">审核驳回</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <!--退款-->
                    <el-form-item label="售后类型">
                        <el-radio-group v-model="form.type">
                            <el-radio label="1">换货</el-radio>
                            <el-radio label="2">退货退款</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="处理金额调整" v-if="status==1">
                        <el-input v-model="form.price"></el-input><span class="tip">元，请在¥0.00~¥20.00区间内调整</span>
                    </el-form-item>
                    <el-form-item label="售后处理说明">
                        <el-input v-model="form.remark"></el-input>
                    </el-form-item>
                    <!--换货-->
                    <el-form-item label="换货物流公司" v-if="status==2">
                        <el-select>
                            <option value="" label="请选择"></option>
                            <option v-for="(v,k) in logicList" :key="k" :value="v.id" :label="v.name"></option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="换货物流单号" v-if="status==2">
                        <el-input v-model="form.remark"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary">提交</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import { queryDictonary } from '@/JS/commom';
    import request from '@/http/http.js';

    export default {
        components: { vBreadcrumb },
        mixins: [queryDictonary],
        data() {
            return {
                nav: ['订单管理', '售后单管理', '售后单列表', '售后单详情'],
                orderId: '',
                orderStatus: '', // 总订单状态: 1:待支付 2:待发货 3:待收货 4:确认收货 5:已完成 6:退货关闭 7:用户关闭 8:超时关闭
                tableData: [],
                warehouseArr: [],
                // 订单信息
                orderMsg: {},
                form: {
                    result: '',
                    price: '',
                    address: '',
                    remark: ''
                },
                status: 1,
                logicList:[]
            };
        },

        created() {
            // 获取订单信息
            this.orderId = this.$route.query.afterSaleOrderInfoId;
            this.getInfo();
        },
        methods: {
            //  获取信息
            getInfo() {
                request.orderDetail({ id: this.orderId }).then(res => {
                    this.orderMsg = res.data;
                    this.tableData = [];
                    res.data.orderPayRecord = res.data.orderPayRecord ? res.data.orderPayRecord : {};
                    res.data.orderProductList.forEach((v, k) => {
                        if (k == 0) {
                            v.returnProductList = [{ id: 1, salesStatus: '11' }, { id: 1, salesStatus: '22' }];
                            v.logicList = [{ id: 1, logicStatus: '11' }];
                        } else {
                            v.returnProductList = [{ id: 2, salesStatus: '11' }];
                            v.logicList = [{ id: 2, logicStatus: '11' }, { id: 2, logicStatus: '22' }];
                        }
                        const length = v.returnProductList.length > v.logicList.length ? v.returnProductList.length : v.logicList.length;
                        v.rows = length;
                        this.tableData.push(v);
                        console.log(this.tableData);
                    });
                }).catch(err => {
                    console.log(err);
                });
            }
        }
    };
</script>
<style lang='less'>
    .after-info {
        .title{
            margin-bottom: 10px;
        }
        .wrap{
            display: flex;
            justify-content: space-between;
            .item-wrap{
                .item{
                    font-size: 14px;
                    color: #666666;
                    line-height: 30px;
                    span:first-child{
                        display: inline-block;
                        width: 115px;
                    }
                    span:nth-child(2){
                        display: inline-block;
                    }
                }
            }
        }
        .goods-info{
            margin-top: 50px;
            .table-area{
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
        }
        .opr-area{
            margin-top: 20px;
            .tip{
                color: #8c939d;
                margin-left: 10px;
            }
            .el-input,.el-input__inner{
                width: 360px;
            }
            .back-address{
                .address-area{
                    display: flex;
                }
                .supplier-address,.plat-address{
                    div{
                        margin-left: 25px;
                    }
                    margin-right: 50px;
                }
                .tip{
                    margin-top: 30px;
                }
            }
        }
    }
</style>
