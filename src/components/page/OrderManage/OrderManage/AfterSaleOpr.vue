<template>
    <div class="apply-opr">
        <!--换货-->
        <div v-if="opr==3">
            <v-breadcrumb :nav='nav'></v-breadcrumb>
            <el-card :body-style="{ padding: '28px 50px' }">
                <!-- 订单状态 -->
                <div class="order-status">
                    <div :class="{'s-block':true,'s-block-bgcolor':boolFirst}">
                        <div class="s-block-content">买家申请换货</div>
                    </div>
                    <div :class="{'s-block':true,'s-block-bgcolor':boolSec}">
                        <div class="s-block-content">卖家处理换货申请</div>
                    </div>
                    <div :class="{'s-block':true,'s-block-bgcolor':boolThr}">
                        <div class="s-block-content">买家寄送</div>
                    </div>
                    <div :class="{'s-block':true,'s-block-bgcolor':boolFor}">
                        <div class="s-block-content">卖家发货</div>
                    </div>
                    <div :class="{'s-block':true,'s-block-bgcolor':boolFif}">
                        <div class="s-block-content">换货完毕</div>
                    </div>
                </div>
                <div>
                    <div class="left">
                        <div class="info-area">
                            <div class="title red" v-if="status==1">
                                商家审核中
                            </div>
                            <div class="title red" v-if="status==2">
                                请等待买家换货还剩{{time}}
                            </div>
                            <div class="title red" v-if="status==3">
                                商家拒绝退货要求
                            </div>
                            <div class="title red" v-if="status==4">
                                买家已发货
                            </div>
                            <div class="title red" v-if="status==5">
                                已同意换货
                            </div>
                            <div class="title red" v-if="status==6">
                                换货完毕
                            </div>

                            <div v-if="status==1">
                                <div class="tips">提示：收到买家换货申请时，请审核换货理由</div>
                                <div style="margin-top: 30px">
                                    <el-button type="danger" @click="checkPass(1)">审核通过
                                    </el-button>
                                    <el-button type="primary" @click="checkPass(2)">审核驳回
                                    </el-button>
                                </div>
                            </div>
                            <div v-if="status==2">
                                <div class="tips">提示：买家将在规定时间内，提交物流信息，不提交视买家自动放弃换货申请</div>
                            </div>
                            <div v-if="status==3">
                                <div class="tips">商家不同意换货申请</div>
                            </div>
                            <div v-if="status==4">
                                <div class="tips">提示：收到买家换货时，请验货后同意换货</div>
                                <div class="tips" style="margin-left: 40px">如果买家在超时结束前未换货，换货申请将自动关闭</div>
                                <div v-if="returnProduct.expressNo">
                                    <div class="tips" style="margin-top: 10px">
                                        <span>买家已寄出</span><span>物流公司：{{returnProduct.expressName}}</span><span>物流单号：{{returnProduct.expressNo}}</span><span
                                        class="blue" @click="watchLogistics">查看物流</span></div>
                                    <div style="margin-top: 30px">
                                        <el-button type="danger" @click="reGoodsClick(1)">已收货并确认换货
                                        </el-button>
                                        <el-button type="primary" @click="reGoodsClick(2)">变更退货
                                        </el-button>
                                    </div>
                                </div>
                            </div>
                            <div v-if="status==5">
                                <div class="recode-item">
                                <el-button @click="orderSendOut">云仓发货</el-button>
                                </div>
                                    <div class="tips" style="margin-top: 10px">
                                        <span>买家已寄出</span><span>物流公司：{{returnProduct.expressName}}</span><span>物流单号：{{returnProduct.expressNo}}</span><span
                                        class="blue" @click="watchLogistics">查看物流</span></div>
                            </div>
                            <div v-if="status==6">
                                <div>
                                    <div class="tips">交易完成</div>
                                </div>
                                <div class="tips" style="margin-top: 30px">
                                    <span>买家已寄出</span><span>物流公司：{{returnProduct.expressName}}</span><span>物流单号：{{returnProduct.expressNo}}</span><span
                                    class="blue" @click="watchLogistics">查看物流</span></div>
                                <div class="tips" style="margin-top: 10px"><span>卖家已寄出</span><span>物流公司：{{returnProduct.ecExpressName}}</span><span>物流单号：{{returnProduct.ecExpressNo}}</span><span
                                    class="blue" @click="watchLogistics">查看物流</span></div>
                            </div>

                            <!--<div class="title red"-->
                                 <!--v-if="status==1&&(!returnProduct.ecExpressNo)&&(!returnProduct.expressNo)">-->
                                <!--请等待买家退货还剩{{time}}-->
                            <!--</div>-->
                            <!--<div class="title red"-->
                                 <!--v-if="status==1&&returnProduct.expressNo">买家已发货-->
                            <!--</div>-->
                            <!--<div class="title red"-->
                                 <!--v-if="status==2">已同意换货-->
                            <!--</div>-->
                            <!--<div class="title red" v-if="status==4">换货完毕</div>-->
                            <!--<div v-if="status==4">-->
                                <!--<div class="tips">交易完成</div>-->
                                <!--<div class="tips" style="margin-top: 30px" v-if="returnProduct.expressNo">-->
                                    <!--<span>买家已寄出</span><span>物流公司：{{returnProduct.expressName}}</span><span>物流单号：{{returnProduct.expressNo}}</span><span-->
                                    <!--class="blue" @click="watchLogistics">查看物流</span></div>-->
                                <!--<div class="tips" style="margin-top: 10px" v-if="returnProduct.ecExpressNo">-->
                                    <!--<span>商家已寄出</span><span>物流公司：{{returnProduct.ecExpressName}}</span><span>物流单号：{{returnProduct.ecExpressNo}}</span><span-->
                                    <!--class="blue" @click="watchLogistics">查看物流</span></div>-->
                            <!--</div>-->
                            <!--<div v-else>-->
                                <!--<div v-if="!returnProduct.expressNo&&!returnProduct.ecExpressNo">-->
                                    <!--<div class="tips">提示：收到买家退货时，请验货后同意退款</div>-->
                                    <!--<div class="tips" style="margin-left: 40px">如果买家再超时结束前未退货，退货申请将自动关闭</div>-->
                                <!--</div>-->
                                <!--<div class="tips" style="margin-top: 10px" v-if="returnProduct.expressNo">-->
                                    <!--<span>买家已寄出</span><span>物流公司：{{returnProduct.expressName}}</span><span>物流单号：{{returnProduct.expressNo}}</span><span-->
                                    <!--class="blue" @click="watchLogistics">查看物流</span></div>-->
                                <!--<div class="tips" style="margin-top: 10px" v-if="returnProduct.ecExpressNo"><span>卖家已寄出</span><span>物流公司：{{returnProduct.ecExpressName}}</span><span>物流单号：{{returnProduct.ecExpressNo}}</span><span-->
                                    <!--class="blue" @click="watchLogistics">查看物流</span></div>-->
                                <!--<div style="margin-top: 30px"-->
                                     <!--v-if="status==1&&returnProduct.expressNo">-->
                                    <!--<el-button type="danger" @click="reGoodsClick(1)">已收货并同意换货</el-button>-->
                                    <!--<el-button type="primary" @click="reGoodsClick(2)">变更退货</el-button>-->
                                    <!--&lt;!&ndash;<el-button type="warning" @click="reGoodsClick(3)">产品报损</el-button>&ndash;&gt;-->
                                <!--</div>-->
                            <!--</div>-->
                            <!--<el-button type="danger" style="margin-top:10px" @click="orderSendOut">云仓发货</el-button>-->
                        </div>
                        <div class="info-other">
                            <div class="recode-item" v-if="status==6">
                                <span>{{returnProduct.adminName}}</span><span>商家已发货</span><span>{{returnProduct.backsendTime|formatDateAll}}</span>
                            </div>

                            <div class="recode-item" v-if="status==5">
                                <span>{{returnProduct.adminName}}</span><span>同意换货</span><span>{{returnProduct.backsendTime|formatDateAll}}</span>
                            </div>
                            <div class="recode-item" v-if="returnProduct.expressNo">
                                <span>{{returnProduct.adminName}}</span><span>提交物流信息</span><span>{{returnProduct.sendTime|formatDateAll}}</span>
                            </div>
                            <div class="recode-item">
                                <span>{{returnProduct.adminName}}</span>
                                <template v-if="status!=1&&returnProduct.agreeTime">
                                    <span>审核通过申请</span>
                                </template>
                                <template v-if="status==3&&!returnProduct.agreeTime">
                                    <span>审核驳回申请</span>
                                </template>
                                <span>{{returnProduct.agreeTime|formatDateAll}}</span>
                            </div>
                            <div class="recode-item">
                                <span>{{returnProduct.buyerName}}</span><span>发起了换货申请</span><span>{{returnProduct.applyTime|formatDateAll}}</span>
                            </div>
                        </div>
                    </div>
                    <div class="right">
                        <div>
                            <div class="title">换货详情</div>
                            <div>
                                <img :src="returnProduct.specImg" alt="" class="img">
                                <div class="goods-info">
                                    <div><p class="">{{returnProduct.productName}}</p></div>
                                    <div>{{returnProduct.spec}}</div>
                                </div>
                                <div class="item">买家：{{returnProduct.buyerName}}</div>
                                <div class="item">订单编号：{{returnProduct.orderNum}}</div>
                                <div class="item">成交时间：{{returnProduct.payTime|formatDateAll}}</div>
                                <div class="item">单价：¥{{returnProduct.price}}*{{returnProduct.num}}(数量)</div>
                                <div class="item">邮费：¥0.00</div>
                                <div class="item">商品总价：¥{{returnProduct.price*returnProduct.num}}</div>
                                <div class="item">更换型号：{{returnProduct.exchangeSpec}} 数量*{{returnProduct.num}}</div>
                                <div class="item">换货原因：{{returnProduct.returnReason}}</div>
                                <div class="item">换货说明：{{returnProduct.remark}}</div>
                                <div class="item">图片：</div>
                                <div>
                                    <img v-for="item in imgList" :src="item.smallImg" alt="" class="img">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </el-card>
        </div>
        <!--退货退款-->
        <div v-if="opr==2">
            <v-breadcrumb :nav='nav'></v-breadcrumb>
            <el-card :body-style="{ padding: '28px 50px' }">
                <!-- 订单状态 -->
                <div class="order-status">
                    <div :class="{'s-block':true,'s-block-bgcolor':boolFirst}">
                        <div class="s-block-content">买家申请退货退款</div>
                    </div>
                    <div :class="{'s-block':true,'s-block-bgcolor':boolSec}">
                        <div class="s-block-content">卖家处理退货退款申请</div>
                    </div>
                    <div :class="{'s-block':true,'s-block-bgcolor':boolThr}">
                        <div class="s-block-content">买家退货</div>
                    </div>
                    <div :class="{'s-block':true,'s-block-bgcolor':boolFor}">
                        <div class="s-block-content">退货退款完毕</div>
                    </div>
                </div>
                <div>
                    <div class="left">
                        <div class="info-area">
                            <div class="title red" v-if="status==1">
                                商家审核中
                            </div>
                            <div class="title red" v-if="status==2">
                                请等待买家退货还剩{{time}}
                            </div>
                            <div class="title red" v-if="status==3&&!returnProduct.agreeTime">
                                商家拒绝退货要求
                            </div>
                            <div class="title red" v-if="status==4">
                                买家已发货
                            </div>
                            <div class="title red" v-if="status==6&&returnProduct.orderReturnAmounts">
                                退款完毕
                            </div>
                            <div class="title red" v-if="status==3&&returnProduct.agreeTime">
                                拒绝退款
                            </div>
                            <div v-if="status==1">
                                <div class="tips">提示：收到买家退货申请时，请审核退货理由</div>
                                <div style="margin-top: 30px">
                                    <el-button type="danger" @click="checkPass(1)">审核通过
                                    </el-button>
                                    <el-button type="primary" @click="checkPass(2)">审核驳回
                                    </el-button>
                                </div>
                            </div>
                            <div v-if="status==2">
                                <div class="tips">提示：收到买家退货时，请验货后同意退款</div>
                                <div class="tips" style="margin-left: 40px">如果买家在超时结束前未退货，退货申请将自动关闭</div>
                            </div>
                            <div v-if="status==3">
                                <div class="tips">商家不同意退货申请</div>
                            </div>

                            <div v-if="status==4">
                                <div class="tips">提示：收到买家退货时，请验货后同意退款</div>
                                <div class="tips" style="margin-left: 40px">如果买家在超时结束前未退货，退货申请将自动关闭</div>
                                <div v-if="returnProduct.expressNo">
                                    <div class="tips" style="margin-top: 10px">
                                        <span>买家已寄出</span><span>物流公司：{{returnProduct.expressName}}</span><span>物流单号：{{returnProduct.expressNo}}</span><span
                                        class="blue" @click="watchLogistics">查看物流</span></div>
                                    <div style="margin-top: 30px">
                                        <el-button type="danger" @click="refundClick(1)">确认退款
                                        </el-button>
                                        <el-button type="primary" @click="refundClick(2)">拒绝退款
                                        </el-button>
                                    </div>
                                </div>
                            </div>
                            <div v-if="status==6&&returnProduct.orderReturnAmounts">
                                <div class="tips">退款成功时间：{{returnAmountsRecord.refundTime|formatDateAll}}</div>
                                <div class="tips">退款金额：￥{{returnAmountsRecord.actualBalance||0}}</div>
                                <div class="tips">退款三方账户：¥{{returnAmountsRecord.actualAmounts||0}}</div>
                                <div class="tips">退还1元现金券：{{returnAmountsRecord.actualTokenCoin||0}}张</div>
                                <div class="reason-tips">产品报损</div>
                                <div class="tips">
                                {{returnProduct.scrapReason}}
                                </div>
                            </div>
                            <div v-if="status==6&&!returnProduct.orderReturnAmounts">
                                <div class="reason-tips">拒绝理由</div>
                                <div class="tips">
                                    {{returnProduct.refuseReason}}
                                </div>
                            </div>
                        </div>
                        <div class="info-other">
                            <div class="recode-item" v-if="status==6&&returnProduct.orderReturnAmounts">
                                <span>{{returnProduct.buyerName}}</span><span>商家确认退款</span><span>{{returnAmountsRecord.refundTime|formatDateAll}}</span>
                            </div>
                            <div class="recode-item" v-if="status==3&&returnProduct.agreeTime">
                                <span>{{returnProduct.buyerName}}</span><span>商家拒绝退款</span><span>{{returnProduct.refuseTime|formatDateAll}}</span>
                            </div>
                            <div class="recode-item" v-if="returnProduct.expressNo">
                                <span>{{returnProduct.buyerName}}</span><span>提交物流信息</span><span>{{returnProduct.sendTime|formatDateAll}}</span>
                            </div>
                            <div class="recode-item">
                                <span>{{returnProduct.adminName}}</span>
                                <template v-if="status!=1&&returnProduct.agreeTime">
                                    <span>审核通过申请</span>
                                </template>
                                <template v-if="status==3&&!returnProduct.agreeTime">
                                    <span>审核驳回申请</span>
                                </template>
                                <span>{{returnProduct.agreeTime|formatDateAll}}</span>
                            </div>
                            <div class="recode-item">
                                <span>{{returnProduct.buyerName}}</span><span>发起了退货退款申请</span><span>{{returnProduct.applyTime|formatDateAll}}</span>
                            </div>
                        </div>
                    </div>
                    <div class="right">
                        <div>
                            <div class="title">退货退款详情</div>
                            <div>
                                <img :src="returnProduct.specImg" alt="" class="img">
                                <div class="goods-info">
                                    <div><p class="">{{returnProduct.productName}}</p></div>
                                    <div>{{returnProduct.spec}}</div>
                                </div>
                                <div class="item">买家：{{returnProduct.buyerName}}</div>
                                <div class="item">订单编号：{{returnProduct.orderNum}}</div>
                                <div class="item">成交时间：{{returnProduct.payTime|formatDateAll}}</div>
                                <div class="item">单价：¥{{returnProduct.price}}*{{returnProduct.num}}(数量)</div>
                                <div class="item">邮费：¥8.00</div>
                                <div class="item">商品总价：¥{{returnProduct.price*returnProduct.num}}</div>
                                <div class="item">退货原因：{{returnProduct.returnReason}}</div>
                                <div class="item">退货说明：{{returnProduct.remark}}</div>
                                <div class="item">图片：</div>
                                <div>
                                    <img v-for="item in imgList" :src="item.smallImg" alt="" class="img">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </el-card>
        </div>
        <!--仅退款-->
        <div v-if="opr==1">
            <v-breadcrumb :nav='nav'></v-breadcrumb>
            <el-card :body-style="{ padding: '28px 50px' }">
                <!-- 订单状态 -->
                <div class="order-status">
                    <div :class="{'s-block':true,'s-block-bgcolor':boolFirst}">
                        <div class="s-block-content">买家申请仅退款</div>
                    </div>
                    <div :class="{'s-block':true,'s-block-bgcolor':boolSec}">
                        <div class="s-block-content">卖家处理退款申请</div>
                    </div>
                    <div :class="{'s-block':true,'s-block-bgcolor':boolThr}">
                        <div class="s-block-content">退款完毕</div>
                    </div>
                </div>
                <div>
                    <div class="left">
                        <div class="info-area">
                            <div class="title red" v-if="status==1">请处理退款申请</div>
                            <template v-else>
                                <div class="title red" v-if="status==6">退款完毕</div>
                                <div class="title red" v-if="status==3">拒绝退款</div>
                            </template>
                            <div v-if="status==1">
                                <div class="tips">提示：如果未发货，请点击同意退款给买家</div>
                                <div class="tips" style="margin-left: 40px">如果实际已发货，请主动与买家联系</div>
                                <div style="margin-top: 30px" v-if="status==1">
                                    <el-button type="danger" @click="refundClick(1)">同意退款
                                    </el-button>
                                    <el-button type="primary" @click="refundClick(2)">拒绝退款
                                    </el-button>
                                </div>
                            </div>
                            <div v-if="status==6">
                                <div class="tips">退款成功时间：{{returnAmountsRecord.refundTime|formatDateAll}}</div>
                                <div class="tips">退款金额：￥{{returnAmountsRecord.actualBalance||0}}</div>
                                <div class="tips">退款三方账户：¥{{returnAmountsRecord.actualAmounts||0}}</div>
                                <div class="tips">退还1元现金券：{{returnAmountsRecord.actualTokenCoin||0}}张</div>
                                <div class="reason-tips" v-if="returnProduct.scrapReason">产品报损</div>
                                <div class="tips">
                                    {{returnProduct.scrapReason}}
                                </div></div>
                            <div v-if="status==3">
                                <div class="tips">拒绝理由：{{returnProduct.refusalReason}}</div>
                            </div>
                        </div>
                        <div class="info-other">
                            <div class="recode-item" v-if="status>1">
                                <span>{{returnProduct.adminName}}</span>
                                <template v-if="status==6&&returnProduct.agreeTime">
                                    <span>同意退款</span>
                                    <span>{{returnProduct.agreeTime|formatDateAll}}</span>
                                </template>
                                <template v-if="status==3">
                                    <span>拒绝退款</span>
                                    <span>{{returnProduct.refuseTime|formatDateAll}}</span>
                                </template>
                            </div>
                            <div class="recode-item">
                                <span>{{returnProduct.buyerName}}</span><span>发起了退款申请</span><span>{{returnProduct.applyTime|formatDateAll}}</span>
                            </div>
                        </div>

                    </div>
                    <div class="right">
                        <div>
                            <div class="title">退款详情</div>
                            <div>
                                <img :src="returnProduct.specImg" alt="" class="img">
                                <div class="goods-info">
                                    <div><p class="">{{returnProduct.productName}}</p></div>
                                    <div>{{returnProduct.spec}}</div>
                                </div>
                                <div class="item">买家：{{returnProduct.buyerName}}</div>
                                <div class="item">订单编号：{{returnProduct.orderNum}}</div>
                                <div class="item">成交时间：{{returnProduct.payTime|formatDateAll}}</div>
                                <div class="item">单价：¥{{returnProduct.price}}*{{returnProduct.num}}(数量)</div>
                                <div class="item">邮费：¥8.00</div>
                                <div class="item">商品总价：¥{{returnProduct.price*returnProduct.num}}</div>
                                <div class="item">退款编号：{{returnProduct.refundNo}}</div>
                                <div class="item">退款金额：¥88.50</div>
                                <div class="item">原因：{{returnProduct.returnReason}}</div>
                                <div class="item">要求：仅退款</div>
                                <div class="item">买家说明：{{returnProduct.remark}}</div>
                                <div class="item">图片：</div>
                                <div>
                                    <img v-for="item in imgList" :src="item.smallImg" alt="" class="img">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </el-card>
        </div>
        <!--变更退货弹窗-->
        <div class="pwd-mask" v-if="tipsMask">
            <div class="box">
                <div class="mask-title">
                    <icon class="ico" ico='icon-jinggao'/>
                    温馨提示
                </div>
                <div class="mask-content">
                    <span class="del-tip">{{info}}</span>
                    <div class="del-btn-group">
                        <el-button :loading="btnLoading" @click="oprSure(true)"
                                   class="del-btn" type="danger">
                            {{btnInf}}
                        </el-button>
                        <el-button @click="tipsMask=false">取消</el-button>
                    </div>
                </div>
            </div>
        </div>
        <!--已收货并同意换货弹窗-->
        <el-dialog title="已收货并同意换货" :visible.sync="badDebtMask">
            <div class="tips-area">
                <div>温馨提示：请确保产品不影响二次销售</div>
            </div>
            <el-form v-model="refundForm" label-width="100px">
                <el-form-item style="margin-left: -84px">
                    <el-checkbox v-model="hadScrap">产品报损</el-checkbox>
                    <el-select v-model="refundForm.badReason" :disabled="!hadScrap" @change="chooseBadReason" placeholder="请选择报损原因">
                        <el-option label="请选择报损原因" value=""></el-option>
                        <el-option v-for="(v,k) in reasonList" :key="k" :label="v.value" :value="v.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="报损说明">
                    <el-input type="textarea" :disabled="!hadScrap" v-model="refundForm.scrapReason" auto-complete="off"
                              placeholder="请输入说明文字"></el-input>
                </el-form-item>
                <!--<el-form-item label="报损原因">-->
                    <!--<el-select v-model="form.badReason" @change="chooseBadReason" placeholder="请选择报损原因">-->
                        <!--<el-option label="请选择报损原因" value=""></el-option>-->
                        <!--<el-option v-for="(v,k) in reasonList" :key="k" :label="v.value" :value="v.value"></el-option>-->
                    <!--</el-select>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="报损说明">-->
                    <!--<el-input type="textarea" v-model="form.scrapReason" auto-complete="off"-->
                              <!--placeholder="请输入说明文字"></el-input>-->
                <!--</el-form-item>-->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submit('refundForm')">确认提交</el-button>
                <el-button @click="badDebtMask=false">取 消</el-button>
            </div>
        </el-dialog>
        <!--同意退款弹窗-->
        <el-dialog title="确认退款金额" class="agreeMask" :visible.sync="agreeMask">
            <el-form v-model="refundForm" label-width="110px">
                 <el-form-item label="买家支付方式：">{{payType}}</el-form-item>
                 <el-form-item label="退还余额">
                        <el-input v-model="refundForm.returnBalance" @blur="changeMoney(0,refundForm.returnBalance)"
                                  auto-complete="off" placeholder="请输入退还余额"></el-input>
                        <span class="mar-left5">元</span>
                 </el-form-item>
                 <el-form-item label="三方账户">
                        <el-input auto-complete="off" v-model="refundForm.returnAmounts" placeholder="0" @blur="changeMoney(1,refundForm.returnAmounts)"></el-input>
                        <span class="mar-left5">元</span>
                 </el-form-item>
                 <el-form-item label="退还1元现金券">
                        <el-input auto-complete="off" v-model="refundForm.returnTokenCoin" placeholder="0" @blur="changeMoney(2,refundForm.returnTokenCoin)"></el-input>
                        <span class="mar-left5">张</span>
                 </el-form-item>
                <el-form-item label="支付交易号">{{refundForm.outTradeNo}}</el-form-item>
                <el-form-item style="margin-left: -84px" v-if="opr!=1">
                    <el-checkbox v-model="hadScrap">产品报损</el-checkbox>
                    <el-select v-model="refundForm.badReason" :disabled="!hadScrap" @change="chooseBadReason" placeholder="请选择报损原因">
                        <el-option label="请选择报损原因" value=""></el-option>
                        <el-option v-for="(v,k) in reasonList" :key="k" :label="v.value" :value="v.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="报损说明"  v-if="opr!=1">
                    <el-input type="textarea" :disabled="!hadScrap" v-model="refundForm.scrapReason" auto-complete="off"
                              placeholder="请输入说明文字"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="refundSubmit(1,'refundForm')">确认退款金额</el-button>
            </div>
        </el-dialog>
        <!--拒绝退款弹窗-->
        <el-dialog title="拒绝退款" :visible.sync="rejectMask">
            <el-form v-model="form" label-width="100px">
                <el-form-item label="拒绝原因">
                    <el-select v-model="form.reason" @change="chooseReason" placeholder="请选择拒绝原因">
                        <el-option label="未退还商品" value="未退还商品"></el-option>
                        <el-option label="未达成一致协商" value="未达成一致协商"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="拒绝说明">
                    <el-input type="textarea" v-model="form.refusalReason" auto-complete="off"
                              placeholder="请输入说明文字"></el-input>
                </el-form-item>
                <!--<el-form-item label="报损原因">-->
                    <!--<el-select v-model="form.badReason" @change="chooseBadReason" placeholder="请选择报损原因">-->
                        <!--<el-option label="请选择报损原因" value=""></el-option>-->
                        <!--<el-option v-for="(v,k) in reasonList" :key="k" :label="v.dValue" :value="v.dValue"></el-option>-->
                    <!--</el-select>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="报损说明">-->
                    <!--<el-input type="textarea" v-model="form.scrapReason" auto-complete="off"-->
                              <!--placeholder="请输入说明文字"></el-input>-->
                <!--</el-form-item>-->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="refundSubmit(2,'form')">确认提交</el-button>
                <el-button @click="rejectMask=false">取 消</el-button>
            </div>
        </el-dialog>
        <!--物流详情弹窗-->
        <v-logistics v-if="isShowLogistics" @msg="logisticsMask"></v-logistics>
    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import vLogistics from '@/components/common/logistics.vue';
    import icon from '@/components/common/ico.vue';
    import { queryDictonary } from '@/JS/commom';
    import request from '@/http/http.js';

    export default {
        components: { vBreadcrumb, icon, vLogistics },
        mixins: [queryDictonary],

        data() {
            return {
                nav: ['订单管理', '申请操作'],
                orderId: '', // 订单id
                returnProductId: '',
                opr: '', // 3换货2退货1仅退款
                boolFirst: true,
                boolSec: false,
                boolThr: false,
                boolFor: false,
                boolFif: false,
                orderStatus: '1', // 订单状态
                name: '张三',
                day: 1,
                time: '',
                status: '', // 3种售后对应的状态值
                info: '', // 温馨提示信息
                btnInf: '变更退货', // 按钮信息
                tipsMask: false,
                btnLoading: false,
                badDebtMask: false,
                agreeMask: false,
                rejectMask: false,
                isShowLogistics: false,
                form: {
                    amounts: '',
                    tokenCoin: '',
                    balance: '',
                    userScore: '',
                    reason: '',
                    badReason: ''
                },
                refundForm: {
                    returnBalance: '',
                    returnAmounts: '',
                    returnTokenCoin: '',
                    outTradeNo: '',
                    badReason: '',
                    scrapReason: ''
                },
                hadScrap: false, // 是否选择产品报损
                // 详情
                returnProduct: {},
                // 退款类型
                payType: '',
                imgList: [],
                returnAmountsRecord: {},
                id: '',
                value: [],
                // 报损原因
                reasonList: []
            };
        },

        activated() {
            this.returnProductId = this.$route.query.afterSaleOprId || sessionStorage.getItem('afterSaleOprId');
            this.getDictionaryData();
            this.getInfo();
        },
        methods: {
            // 获取详情
            getInfo() {
                request.lookDetail({ returnProductId: this.returnProductId }).then(res => {
                    this.returnProduct = res.data;
                    this.imgList = res.data.imgList;
                    if (res.data.orderReturnAmounts) {
                        this.returnAmountsRecord = res.data.orderReturnAmounts;
                        this.orderId = res.data.orderReturnAmounts.orderId;
                    }
                    this.opr = this.returnProduct.type;
                    this.status = this.returnProduct.status;
                    this.id = this.returnProduct.id;
                    let tmpType = '';
                    // if ((res.data.payType & 1) != 0) {
                    //     tmpType += `三方支付`;
                    // }
                    // if ((res.data.payType & 2) != 0) {
                    //     tmpType += `+余额支付`;
                    // }
                    // if ((res.data.payType & 4) != 0) {
                    //     tmpType += `+1元券支付`;
                    // }
                    this.payType = this.getType(res.data.payType);
                    this.getProgressStu(this.status);
                    if (this.status == 2 && this.returnProduct.outTime) {
                        this.getDistanceTime(this.returnProduct.outTime);
                    }
                }).catch(err => {
                    console.log(err);
                });
            },
            getType(value) {
                let result = '';
                switch (value) {
                    case 1:
                        result = '三方支付';
                        break;
                    case 2:
                        result = '余额支付';
                        break;
                    case 3:
                        result = '余额支付+三方支付';
                        break;
                    case 4:
                        result = '1元券支付';
                        break;
                    case 5:
                        result = '余额支付+1元券支付';
                        break;
                    case 7:
                        result = '余额支付+三方支付+1元券支付';
                        break;
                }
                return result;
            },
            changeMoney(num, pre) {
                if (pre > this.value[num]) {
                    if (num === 0) {
                        this.$message.warning('超过最大可退还余额!');
                        this.refundForm.returnBalance = this.value[0];
                    } else if (num === 1) {
                        this.$message.warning('超过最大可退还三方账户金额!');
                        this.refundForm.returnAmounts = this.value[1];
                    } else {
                        this.$message.warning('超过最大可退还退还1元现金券!');
                        this.refundForm.returnTokenCoin = this.value[2];
                    }
                }
            },
            // 判断进度条状态,s状态  num1买家退货单号  num2卖家单号
            // getProgressStu(status, type) {
            // if (status == 1) {
            //     this.boolFirst = true;
            //     this.boolSec = true;
            //     if (num1) {
            //         this.boolThr = true;
            //     } else {
            //         this.boolThr = false;
            //     }
            //     if (num2) {
            //         this.boolFor = true;
            //         this.boolFif = true;
            //     } else {
            //         this.boolFor = false;
            //         this.boolFif = false;
            //     }
            // } else {
            //     this.boolFirst = true;
            //     this.boolSec = true;
            //     this.boolThr = true;
            //     this.boolFor = true;
            //     if (type == 1) {
            //         if (s > 3) {
            //             this.boolFif = true;
            //         }
            //     }
            // }
            // },
            getProgressStu(status) {
                switch (status) {
                    case 1:
                        this.boolFirst = true;
                        this.boolSec = true;
                        this.boolThr = false;
                        this.boolFor = false;
                        this.boolFif = false;
                        break;
                    case 2:
                        this.boolFirst = true;
                        this.boolSec = true;
                        this.boolThr = true;
                        this.boolFor = false;
                        this.boolFif = false;
                        break;
                    case 3:
                        this.boolFirst = true;
                        this.boolSec = true;
                        this.boolThr = true;
                        this.boolFor = true;
                        this.boolFif = true;
                        break;
                    case 4:
                        this.boolFirst = true;
                        this.boolSec = true;
                        this.boolThr = true;
                        this.boolFor = false;
                        this.boolFif = false;
                        break;
                    case 5:
                        this.boolFirst = true;
                        this.boolSec = true;
                        this.boolThr = true;
                        this.boolFor = true;
                        this.boolFif = false;
                        break;
                    case 6:
                        this.boolFirst = true;
                        this.boolSec = true;
                        this.boolThr = true;
                        this.boolFor = true;
                        this.boolFif = true;
                        break;
                }
            },
            // 退换货,产品报损按钮
            reGoodsClick(num) {
                const that = this;
                if (num == 1) {
                    that.badDebtMask = true;
                } else {
                    that.tipsMask = true;
                    that.info = '请确保产品不影响二次销售';
                    that.btnInf = '变更退货';
                }
            },
            // 变更退货
            oprSure() {
                this.tipsMask = false;
                request.exchangeChangeRefund({ returnProductId: this.returnProductId }).then(res => {
                    this.$message.warning(res.msg);
                    this.getInfo();
                }).catch(err => {
                    console.log(err);
                });
            },
            // 获取退款金额详情
            getMoney() {
                const data = {
                    returnProductId: this.returnProductId
                };
                request.makeSureRefund(data).then(res => {
                    this.refundForm = res.data;
                    this.value.push(this.refundForm.returnBalance, this.refundForm.returnAmounts, this.refundForm.returnTokenCoin);
                }).catch(err => {
                    console.log(err);
                });
            },
            // 是否同意退款按钮
            refundClick(num) {
                if (num == 1) { // 同意
                    this.agreeMask = true;
                    this.getMoney();
                } else { // 拒绝
                    this.rejectMask = true;
                }
            },
            // 已收货并同意换货提交
            submit(form) {
                this.badDebtMask = false;
                const data = {
                    returnProductId: this.returnProductId,
                    scrapReason: this[form].scrapReason,
                    hadScrap: this.hadScrap ? 1 : 2
                };
                if (this.form.badReason) {
                    data.hadScrap = 1;
                }
                request.agreeExchange(data).then(res => {
                    this.$message.success(res.msg);
                    this.getInfo();
                }).catch(err => {
                    console.log(err);
                });
            },
            // 是否同意退款提交
            refundSubmit(num, form) {
                const data = this[form];
                data.hadScrap = this[form].hadScrap ? 1 : 2;
                data.returnProductId = this.returnProductId;
                let url;
                if (num == 1) {
                    url = 'refundAmounts';
                } else {
                    if (!data.reason) {
                        this.$message.warning('请选择拒绝原因!');
                        return;
                    }
                    url = 'refuse';
                }
                request[url](data).then(res => {
                    this.$message.success(res.msg);
                    this.agreeMask = false;
                    this.rejectMask = false;
                    this.getInfo();
                }).catch(err => {
                    console.log(err);
                });
            },
            // 选择拒绝原因
            chooseReason() {
                this.form.refusalReason = this.form.reason;
            },
            // 选择报损原因
            chooseBadReason() {
                this.refundForm.scrapReason = this.refundForm.badReason;
            },
            // //查看物流
            // watchLogistics() {
            //     this.isShowLogistics = true
            // },
            // // 关闭物流弹窗
            // logisticsMask(msg) {
            //     this.isShowLogistics = msg;
            // },
            // 查看物流信息
            watchLogistics() {
                sessionStorage.setItem('findExpressId', this.orderId);
                this.$router.push({ name: 'logistics', query: { findExpressId: this.orderId }});
            },
            // 倒计时
            getDistanceTime(time) {
                const that = this;
                let timer;
                clearInterval(timer);
                timer = setInterval(function() {
                    const endTime = new Date(time);
                    const nowTime = new Date();
                    const distance = endTime.getTime() - nowTime.getTime();
                    /* getTime把一个date对象转换成毫秒*/
                    let day = 0;
                    let hour = 0;
                    let minute = 0;
                    let second = 0;
                    if (distance >= 0) {
                        day = Math.floor(distance / 1000 / 60 / 60 / 24);
                        hour = Math.floor(distance / 1000 / 60 / 60 % 24);
                        minute = that.addZero(Math.floor(distance / 1000 / 60 % 60));
                        second = that.addZero(Math.floor(distance / 1000 % 60));
                        that.time = day + '天' + hour + ':' + minute + ':' + second;
                    } else {
                        that.time = '';
                        that.status = 8;
                        clearInterval(timer);
                    }
                }, 1000);
            },
            addZero(num) {
                if (num < 10) {
                    return '0' + num;
                } else {
                    return num;
                }
            },
            // 云仓发货
            orderSendOut() {
                const data = {
                    id: this.returnProductId,
                    expressName: '中通快递',
                    expressNo: '221286279559'
                };
                request.sendOut(data).then(res => {
                    this.$message.success(res.msg);
                    this.getInfo();
                }).catch(err => {
                    console.log(err);
                });
            },
            // 产品报损数据字典
            async getDictionaryData() {
                await this.queryDictonary('CPBS');
                this.reasonList = this.tmpAxiosData;
            },
            // 审核通过。拒绝
            checkPass(num) {
                let url = '';
                if (num == 1) {
                    url = 'agreeApply';
                    const data = {
                        returnProductId: this.returnProductId
                    };
                    request[url](data).then(res => {
                        this.$message.success(res.msg);
                        this.getInfo();
                    }).catch(err => {
                        console.log(err);
                    });
                } else {
                    this.rejectMask = true;
                }
            }
        }
    };

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
            width: 53%;
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
                    height: 40px;
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
        .el-textarea__inner {
            width: 300px;
            height: 90px;
            resize: none;
        }
        .agreeMask {
            .el-dialog {
                width: 530px;
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
            .mar-left5 {
                margin-left: 5px;
            }
        }
        .tips-area {
            margin: -20px 0 10px 30px;
            color: #ff6868;
        }
        .reason-tips{
            margin-top: 20px;
            font-size: 20px;
        }
    }
</style>
