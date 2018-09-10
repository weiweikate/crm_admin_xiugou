<template>
    <div class="apply-opr">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card :body-style="{ padding: '28px 50px' }">
            <!-- 订单状态 -->
            <div class="order-status">
                <div :class="{'s-block':true,'s-block-bgcolor':boolFirst}">
                    <div class="s-block-content">买家申请换货</div>
                </div>
                <div :class="{'s-block':true,'s-block-bgcolor':boolsec}">
                    <div class="s-block-content">买家退货</div>
                </div>
                <div :class="{'s-block':true,'s-block-bgcolor':boolThr}">
                    <div class="s-block-content">换货完毕</div>
                </div>
            </div>
            <div>
                <div class="left">
                    <div class="info-area">
                        <div class="title red" v-if="status==1">请等待买家退货还剩{{day}}天{{time}}</div>
                        <div class="title red" v-if="status==2">买家已发货</div>
                        <div class="title red" v-if="status==3">换货完毕</div>
                        <div v-if="status==3">
                            <div class="tips">交易完成</div>
                            <div class="tips" style="margin-top: 30px"><span>买家已寄出</span><span>物流公司：邮政小包</span><span>物流单号：465165464164651</span><span
                                class="blue">查看物流</span></div>
                            <div class="tips" style="margin-top: 10px"><span>商家已寄出</span><span>物流公司：邮政小包</span><span>物流单号：465165464164651</span><span
                                class="blue">查看物流</span></div>
                        </div>
                        <div v-else>
                            <div class="tips">提示：收到买家退货时，请验货后同意退款</div>
                            <div class="tips" style="margin-left: 40px">如果买家再超时结束前未退货，退货申请将自动关闭</div>
                            <div class="tips" style="margin-top: 10px" v-if="status==2"><span>买家已寄出</span><span>物流公司：邮政小包</span><span>物流单号：465165464164651</span><span
                                class="blue">查看物流</span></div>
                            <div style="margin-top: 30px" v-if="status==2">
                                <el-button type="danger" @click="btnClick(1)">同意换货</el-button>
                                <el-button type="primary" @click="btnClick(2)">变更退货</el-button>
                                <el-button type="warning" @click="btnClick(3)">产品报损</el-button>
                            </div>
                        </div>

                    </div>
                    <div class="info-other" v-if="status==3">
                        <div class="recode-item">
                            <span>{{name}}</span><span>发起了换货申请</span><span>2018-12-12 12:12:12</span></div>
                        <div class="recode-item">
                            <span>{{name}}</span><span>发起了换货申请</span><span>2018-12-12 12:12:12</span></div>
                        <div class="recode-item">
                            <span>{{name}}</span><span>发起了换货申请</span><span>2018-12-12 12:12:12</span></div>
                        <div class="recode-item">
                            <span>{{name}}</span><span>发起了换货申请</span><span>2018-12-12 12:12:12</span></div>
                    </div>
                    <div class="info-other" v-else>
                        <span>{{name}}</span><span>发起了换货申请</span><span>2018-12-12 12:12:12</span>
                    </div>
                </div>
                <div class="right">
                    <div>
                        <div class="title">换货详情</div>
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
                            <div class="item">原因：我不想买了</div>
                            <div class="item">要求：换货</div>
                            <div class="item">更换型号：32G，黑色，全网通 数量*1</div>
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
        <!--消息确认弹窗-->
        <div class="pwd-mask" v-if="tipsMask">
            <div class="box">
                <div class="mask-title">
                    <icon class="ico" ico='icon-jinggao'/>
                    温馨提示
                </div>
                <div class="mask-content">
                    <span class="del-tip">{{info}}</span>
                    <div class="del-btn-group">
                        <el-button :loading="btnLoading" @click="oprSure(true)" class="del-btn" type="danger">{{btnInf}}
                        </el-button>
                        <el-button @click="tipsMask=false">取消</el-button>
                    </div>
                </div>
            </div>
        </div>
        <!--产品报损弹窗-->
        <el-dialog title="产品报损" :visible.sync="badDebtMask">
            <el-form v-model="form" label-width="100px">
                <el-form-item label="报损原因">
                    <el-select v-model="form.reason" placeholder="请选择报损原因">
                        <el-option label="影响产品二次销售" value="1"></el-option>
                        <el-option label="产品并非出售产品" value="2"></el-option>
                        <el-option label="其他" value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="报损说明">
                    <el-input type="textarea" v-model="form.remark" auto-complete="off" placeholder="请输入说明文字"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submit">确认提交</el-button>
                <el-button @click="badDebtMask=false">取 消</el-button>
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
                tipsMask: false,
                btnLoading: false,
                badDebtMask: false,
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
                if (num == 3) {
                    that.badDebtMask = true
                } else {
                    that.tipsMask = true;
                }
                if (num == 1) {
                    that.info = '请确保产品不影响二次销售';
                    that.btnInf = '确认收货'
                }
            },
            oprSure() {
                this.tipsMask = false
            },
            //报损提交
            submit() {
                this.badDebtMask = false
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
        .pwd-mask {
            display: flex;
            align-items: center;
            justify-content: center;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 99;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.2);
            .box {
                position: relative;
                width: 530px;
                height: 305px;
                background-color: #fff;
                border-radius: 10px;
                overflow: hidden;
                .mask-title {
                    width: 100%;
                    height: 56px;
                    border-bottom: 1px solid #ccc;
                    padding-left: 45px;
                    box-sizing: border-box;
                    text-align: center;
                    line-height: 56px;
                    color: #ff6868;
                    font-weight: 700;
                    .ico {
                        position: absolute;
                        top: 16px;
                        left: 228px;
                        color: red;
                        font-size: 20px;
                    }
                }
                .mask-content {
                    position: relative;
                    width: 100%;
                    height: 248px;
                    overflow: hidden;
                    padding: 30px 45px 0 45px;
                    box-sizing: border-box;
                    .del-tip {
                        position: absolute;
                        top: 30%;
                        left: 50%;
                        transform: translateX(-50%);
                        font-size: 22px;
                    }
                    .del-btn-group {
                        width: 180px;
                        display: flex;
                        justify-content: space-between;
                        position: absolute;
                        left: 50%;
                        transform: translateX(-50%);
                        bottom: 15%;
                        .del-btn {
                            background-color: #ff6868;
                        }
                    }
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
    }
</style>
