<template>
    <div class="apply-opr">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card :body-style="{ padding: '28px 50px' }">
            <!-- 订单状态 -->
            <div class="order-status">
                <div :class="{'s-block':true,'s-block-bgcolor':boolFirst}">
                    <div class="s-block-content">买家申请仅退款</div>
                </div>
                <div :class="{'s-block':true,'s-block-bgcolor':boolsec}">
                    <div class="s-block-content">卖家处理退款申请</div>
                </div>
                <div :class="{'s-block':true,'s-block-bgcolor':boolThr}">
                    <div class="s-block-content">退款完毕</div>
                </div>
            </div>
            <div>
                <div class="left">
                    <div class="info-area">
                        <div class="title red" v-if="status==1">请等待买家退货还剩{{day}}天{{time}}</div>
                        <div class="title red" v-if="status==2">请处理退款申请</div>
                        <div class="title red" v-if="status==3">退款完毕</div>
                        <div v-if="status==3">
                            <div class="tips">退款成功时间：2018-06-12 00:04:25</div>
                            <div class="tips">退款余额：￥2.00</div>
                            <div class="tips">退款代币：2代币</div>
                            <div class="tips">退还积分：23积分</div>
                            <div class="tips">退还金额：￥90.00元</div>
                        </div>
                        <div v-else>
                            <div class="tips">提示：如果未发货，请点击同意退款给买家</div>
                            <div class="tips" style="margin-left: 40px">如果实际已发货，请主动与买家联系</div>
                            <div style="margin-top: 30px" v-if="status==2">
                                <el-button type="danger" @click="btnClick(1)">同意退款</el-button>
                                <el-button type="primary" @click="btnClick(2)">拒绝退款</el-button>
                            </div>
                        </div>

                    </div>
                    <div class="info-other" v-if="status==3">
                        <div class="recode-item">
                            <span>{{name}}</span><span>发起了退款申请</span><span>2018-12-12 12:12:12</span></div>
                        <div class="recode-item">
                            <span>{{name}}</span><span>发起了退货申请</span><span>2018-12-12 12:12:12</span></div>
                        <div class="recode-item">
                            <span>{{name}}</span><span>发起了退货申请</span><span>2018-12-12 12:12:12</span></div>
                        <div class="recode-item">
                            <span>{{name}}</span><span>发起了退货申请</span><span>2018-12-12 12:12:12</span></div>
                    </div>
                    <div class="info-other" v-else>
                        <span>{{name}}</span><span>发起了退款申请</span><span>2018-12-12 12:12:12</span>
                    </div>
                </div>
                <div class="right">
                    <div>
                        <div class="title">退款详情</div>
                        <div>
                            <img src="../../../../assets/images/avatar.jpg" alt="" class="img">
                            <div class="goods-info">
                                <div><p class="">苹果8xApple/苹果 iPhone X 4G手机</p>
                                    <p>phonex苹果x屏</p></div>
                                <div>iphone X 金色 128G</div>
                            </div>
                            <div class="item">买家：{{name}}</div>
                            <div class="item">订单编号：{{orderNum}}</div>
                            <div class="item">成交时间：2018-12-12 12:12:12</div>
                            <div class="item">单价：¥80.50*1(数量)</div>
                            <div class="item">邮费：¥8.00</div>
                            <div class="item">商品总价：¥88.50</div>
                            <div class="item">退款编号：{{orderNum}}</div>
                            <div class="item">退款金额：¥88.50</div>
                            <div class="item">原因：我不想买了</div>
                            <div class="item">要求：换货</div>
                            <div class="item">买家说明：我是刷单的.....</div>
                            <div class="item">图片：</div>
                            <div>
                                <img src="../../../../assets/images/avatar.jpg" alt="" class="img">
                                <img src="../../../../assets/images/avatar.jpg" alt="" class="img">
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </el-card>
        <!--同意退款弹窗-->
        <el-dialog title="确认退款金额" class="agreeMask" :visible.sync="agreeMask">
            <el-form v-model="form" label-width="110px">
                <el-form-item label="买家支付方式：">第三方支付+余额支付+代币支付</el-form-item>
                <div class="row">
                    <el-form-item label="退还代币">
                        <el-input v-model="form.remark" auto-complete="off" placeholder="请输入退还代币"></el-input><span class="mar-left5">枚</span>
                    </el-form-item>
                    <el-form-item label="退还余额">
                        <el-input v-model="form.remark" auto-complete="off" placeholder="请输入退还余额"></el-input><span class="mar-left5">元</span>
                    </el-form-item>
                </div>
                <div class="row">
                    <el-form-item label="退还积分">
                        <el-input v-model="form.remark" auto-complete="off" placeholder="请输入退还积分"></el-input><span class="mar-left5">分</span>
                    </el-form-item>
                    <el-form-item label="退还金额">
                        <el-input v-model="form.remark" auto-complete="off" placeholder="请输入退还金额"></el-input><span class="mar-left5">元</span>
                    </el-form-item>
                </div>
                <div class="row">
                    <el-form-item label="支付手续费">
                        <el-input v-model="form.remark" auto-complete="off" placeholder="请输入支付手续费"></el-input><span class="mar-left5">元</span>
                    </el-form-item>
                    <el-form-item label="退款手续费">
                        <el-input v-model="form.remark" auto-complete="off" placeholder="请输入退款手续费"></el-input><span class="mar-left5">元</span>
                    </el-form-item>
                </div>
                <el-form-item label="退款账户：">支付宝 中国建设银行 6212***********1203</el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submit(1)">确认退款金额</el-button>
            </div>
        </el-dialog>
        <!--拒绝退款弹窗-->
        <el-dialog title="拒绝退款" :visible.sync="rejectMask">
            <el-form v-model="form" label-width="100px">
                <el-form-item label="拒绝原因">
                    <el-select v-model="form.reason" placeholder="请选择报损原因">
                        <el-option label="影响产品二次销售" value="1"></el-option>
                        <el-option label="产品并非出售产品" value="2"></el-option>
                        <el-option label="其他" value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="拒绝说明">
                    <el-input type="textarea" v-model="form.remark" auto-complete="off" placeholder="请输入说明文字"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submit(2)">确认提交</el-button>
                <el-button @click="rejectMask=false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import vBreadcrumb from "@/components/common/Breadcrumb.vue";

    export default {
        components: {vBreadcrumb},

        data() {
            return {
                nav: ["订单管理", "申请操作"],
                boolFirst: true,
                boolsec: false,
                boolThr: false,
                orderStatus: '1', //订单状态
                name: '张三',
                day: 1,
                time: '23:15:45',
                orderNum: '6652498468464646',
                status: 2,
                info: '',
                btnInf: '',
                agreeMask: false,
                btnLoading: false,
                rejectMask: false,
                form: {
                    reason: '',
                    remark: ''
                }
            };
        },

        activated() {
            this.getInfo();
        },

        methods: {
            getInfo() {

            },
            btnClick(num) {
                let that = this;
                if (num == 1) {//同意
                    that.agreeMask = true
                } else {//拒绝
                    that.rejectMask = true;
                }
            },
            //是否同意退款
            submit(num) {
                let that = this;
                if(num==1){
                    that.agreeMask = false
                }else{
                    that.rejectMask = false
                }
            }
        }
    }

</script>
<style lang='less'>
    .apply-opr {
        .order-status {
            height: 55px;
            min-width: 1000px;
            .s-block {
                float: left;
                width: 200px;
                height: 53px;
                border: 1px solid #eee;
                border-right: none;
                transform: skew(-30deg);
                text-align: center;
                line-height: 53px;
                color: #999;
                .s-block-content {
                    display: inline-block;
                    transform: skew(30deg);
                }
            }
            .s-block:first-child {
                margin-left: 25px;
            }
            .s-block:last-child {
                border-right: 1px solid #eee;
            }
            .s-block-bgcolor {
                background-color: #33b4ff;
                color: #fff;
            }
        }
        .title {
            font-size: 24px;
            height: 40px;
            line-height: 40px;
        }
        .left {
            float: left;
            width: 55%;
            padding: 40px 0 0 40px;
            .red {
                color: #ff6868;
            }
            .tips {
                font-size: 14px;
                color: #999999;
                height: 24px;
                line-height: 24px;
                span:nth-child(2) {
                    margin: 0 40px;
                }
                .blue {
                    color: #33b4ff;
                    margin-left: 40px;
                    cursor: pointer;
                }
            }
            .info-area {
                height: 300px
            }
            .info-other {
                font-size: 14px;
                color: #666666;
                .recode-item {
                    height: 30px;
                    line-height: 30px;
                }
            }
            .info-other span:nth-child(2) {
                margin: 0 40px;
            }
        }
        .right {
            float: right;
            width: 38%;
            padding: 40px 0 40px 40px;
            border-left: 1px solid #dddddd;
            color: #222222;
            .item {
                font-size: 14px;
                height: 30px;
                line-height: 30px;
            }
            .img {
                width: 100px;
                height: 100px;
                background-color: #ffffff;
                border: solid 1px #eeeeee;
                margin-right: 10px;
                vertical-align: top;
            }
            .goods-info {
                display: inline-block;
                font-size: 14px;
                margin-top: 10px;
                div:first-child {
                    height: 60px;
                }
            }
        }
        /*弹窗样式*/
        .el-dialog {
            width: 530px;
            border-radius: 10px;
        }
        .el-dialog__header {
            border-bottom: 1px solid #eee;
            padding: 20px 20px 10px 50px;
        }
        .el-dialog__title {
            color: #ff6868;
        }
        .el-dialog .el-input {
            display: inline;
        }
        .el-dialog .el-input__inner {
            width: 300px;
        }
        .el-select .el-input__inner {
            width: 300px;
        }

        .icon-area .el-input__inner {
            width: 300px;
        }
        .el-input__suffix {
            line-height: 24px;
        }

        .el-dialog__footer {
            margin-right: 30px;
        }
        .el-textarea__inner{
            width: 300px;
            height: 90px;
            resize: none;
        }
        .agreeMask{
            .el-dialog {
                width: 710px;
            }
            .el-dialog .el-input__inner {
                width: 180px;
            }
            .el-select .el-input__inner {
                width: 180px;
            }

            .icon-area .el-input__inner {
                width: 180px;
            }
            .el-dialog__footer {
               text-align: center;
            }
            .el-form-item--small.el-form-item{
                display: inline-block;
            }
            .mar-left5{
                margin-left: 5px;
            }
        }
    }
</style>
