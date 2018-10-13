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
                            <div class="title red"
                                 v-if="status==1&&(!returnProduct.ecExpressNo)&&(!returnProduct.expressNo)">
                                请等待买家退货还剩{{time}}
                            </div>
                            <div class="title red"
                                 v-if="status==1&&returnProduct.expressNo">买家已发货
                            </div>
                            <div class="title red"
                                 v-if="status==2">已同意换货
                            </div>
                            <div class="title red" v-if="status==4">换货完毕</div>
                            <div v-if="status==4">
                                <div class="tips">交易完成</div>
                                <div class="tips" style="margin-top: 30px" v-if="returnProduct.expressNo">
                                    <span>买家已寄出</span><span>物流公司：{{returnProduct.expressName}}</span><span>物流单号：{{returnProduct.expressNo}}</span><span
                                    class="blue" @click="watchLogistics">查看物流</span></div>
                                <div class="tips" style="margin-top: 10px" v-if="returnProduct.ecExpressNo">
                                    <span>商家已寄出</span><span>物流公司：{{returnProduct.ecExpressName}}</span><span>物流单号：{{returnProduct.ecExpressNo}}</span><span
                                    class="blue" @click="watchLogistics">查看物流</span></div>
                            </div>
                            <div v-else>
                                <div v-if="!returnProduct.expressNo&&!returnProduct.ecExpressNo">
                                    <div class="tips">提示：收到买家退货时，请验货后同意退款</div>
                                    <div class="tips" style="margin-left: 40px">如果买家再超时结束前未退货，退货申请将自动关闭</div>
                                </div>
                                <div class="tips" style="margin-top: 10px" v-if="returnProduct.expressNo">
                                    <span>买家已寄出</span><span>物流公司：{{returnProduct.expressName}}</span><span>物流单号：{{returnProduct.expressNo}}</span><span
                                    class="blue" @click="watchLogistics">查看物流</span></div>
                                <div class="tips" style="margin-top: 10px" v-if="returnProduct.ecExpressNo"><span>卖家已寄出</span><span>物流公司：{{returnProduct.ecExpressName}}</span><span>物流单号：{{returnProduct.ecExpressNo}}</span><span
                                    class="blue" @click="watchLogistics">查看物流</span></div>
                                <div style="margin-top: 30px"
                                     v-if="status==1&&returnProduct.expressNo">
                                    <el-button type="danger" @click="reGoodsClick(1)">已收货并同意换货</el-button>
                                    <el-button type="primary" @click="reGoodsClick(2)">变更退货</el-button>
                                    <!--<el-button type="warning" @click="reGoodsClick(3)">产品报损</el-button>-->
                                </div>
                            </div>
                            <el-button type="danger" style="margin-top:10px" @click="orderSendOut">云仓发货</el-button>
                        </div>
                        <div class="info-other">
                            <div class="recode-item" v-if="returnProduct.agreeTime">
                                <span>{{returnProduct.adminName}}</span>
                                <template v-if="returnAmountsRecord.id">
                                    <span>同意换货</span>
                                </template>
                                <template v-else>
                                    <span>拒绝换货</span>
                                </template>
                                <span>{{returnProduct.agreeTime|formatDateAll}}</span>
                            </div>
                            <div class="recode-item" v-if="returnProduct.sendTime">
                                <span>{{returnProduct.adminName}}</span><span>云仓发货</span><span>{{returnProduct.sendTime|formatDateAll}}</span>
                            </div>
                            <div class="recode-item" v-if="returnProduct.applyTime">
                                <span>{{returnProduct.nickname}}</span><span>发起了换货申请</span><span>{{returnProduct.applyTime|formatDateAll}}</span>
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
                                <div class="item">买家：{{returnProduct.nickname}}</div>
                                <div class="item">订单编号：{{returnProduct.orderNum}}</div>
                                <div class="item">成交时间：{{returnProduct.payTime|formatDateAll}}</div>
                                <div class="item">单价：¥{{returnProduct.price}}*{{returnProduct.num}}(数量)</div>
                                <!--<div class="item">邮费：¥8.00</div>-->
                                <div class="item">商品总价：¥{{returnProduct.price*returnProduct.num}}</div>
                                <div class="item">原因：{{returnProduct.returnReason}}</div>
                                <div class="item">要求：换货</div>
                                <!--<div class="item">更换型号：32G，黑色，全网通 数量*1</div>-->
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
                            <div class="title red" v-if="status==1&&!returnProduct.expressNo">
                                请等待买家退货还剩{{time}}
                            </div>
                            <div class="title red" v-if="status==1&&returnProduct.expressNo">买家已发货</div>
                            <div class="title red" v-if="status!=1&&returnAmountsRecord.id">退款成功</div>
                            <div class="title red" v-if="status!=1&&!returnAmountsRecord.id">拒绝退款</div>
                            <div v-if="status==1">
                                <div class="tips">提示：收到买家退货时，请验货后同意退款</div>
                                <div class="tips" style="margin-left: 40px">如果买家再超时结束前未退货，退货申请将自动关闭</div>
                                <div v-if="returnProduct.expressNo">
                                    <div class="tips" style="margin-top: 10px">
                                        <span>买家已寄出</span><span>物流公司：{{returnProduct.expressName}}</span><span>物流单号：{{returnProduct.expressNo}}</span><span
                                        class="blue" @click="watchLogistics">查看物流</span></div>
                                    <div style="margin-top: 30px">
                                        <el-button type="danger" @click="refundClick(1)">同意退款
                                        </el-button>
                                        <el-button type="primary" @click="refundClick(2)">拒绝退款
                                        </el-button>
                                        <!--<el-button type="warning" @click="reGoodsClick(3)">产品报损</el-button>-->
                                    </div>
                                </div>
                            </div>
                            <div v-if="status!=1&&returnAmountsRecord.id">
                                <div class="tips">退款成功时间：{{returnAmountsRecord.refundTime|formatDateAll}}</div>
                                <div class="tips">退款余额：￥{{returnAmountsRecord.actualBalance}}</div>
                                <div class="tips">退款代币：{{returnAmountsRecord.actualTokenCoin}}代币</div>
                                <div class="tips">退还积分：{{returnAmountsRecord.actualUserScore}}积分</div>
                                <div class="tips">退还金额：￥{{returnAmountsRecord.actualAmounts}}</div>
                                <div class="tips" style="margin-top: 10px">
                                    <span>买家已寄出</span><span>物流公司：{{returnProduct.expressName}}</span><span>物流单号：{{returnProduct.expressNo}}</span><span
                                    class="blue" @click="watchLogistics">查看物流</span></div>
                            </div>
                            <div v-if="status!=1">
                                <div class="tips" v-if='returnProduct.refusal_reason'>拒绝理由：{{returnProduct.refusal_reason}}</div>
                                <div class="tips" v-if="returnProduct.scrap_reason">
                                    报损原因：{{returnProduct.scrap_reason}}
                                </div>
                            </div>

                        </div>
                        <div class="info-other">
                            <div class="recode-item" v-if="returnProduct.agreeTime">
                                <span>{{returnProduct.adminName}}</span>
                                <template v-if="returnAmountsRecord.id">
                                    <span>同意退货退款</span>
                                </template>
                                <template v-else>
                                    <span>拒绝退货退款</span>
                                </template>
                                <span>{{returnProduct.agreeTime|formatDateAll}}</span>
                            </div>
                            <div class="recode-item" v-if="returnProduct.applyTime">
                                <span>{{returnProduct.nickname}}</span><span>发起了退货退款申请</span><span>{{returnProduct.applyTime|formatDateAll}}</span>
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
                                <div class="item">买家：{{returnProduct.nickname}}</div>
                                <div class="item">订单编号：{{returnProduct.orderNum}}</div>
                                <div class="item">成交时间：{{returnProduct.payTime|formatDateAll}}</div>
                                <div class="item">单价：¥{{returnProduct.price}}*{{returnProduct.num}}(数量)</div>
                                <!--<div class="item">邮费：¥8.00</div>-->
                                <div class="item">商品总价：¥{{returnProduct.price*returnProduct.num}}</div>
                                <div class="item">退款编号：{{returnProduct.refund_no}}</div>
                                <!--<div class="item">退款金额：¥88.50</div>-->
                                <div class="item">应退现金：¥{{returnProduct.returnAmounts}}</div>
                                <div class="item">应退余额：¥{{returnProduct.returnBalance}}</div>
                                <div class="item">应退代币：{{returnProduct.returnTokenCoin}}代币</div>
                                <div class="item">应退积分：{{returnProduct.returnUserScore}}积分</div>
                                <div class="item">原因：{{returnProduct.returnReason}}</div>
                                <div class="item">要求：换货</div>
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
                                <div class="title red" v-if="returnAmountsRecord.id">退款完毕</div>
                                <div class="title red" v-else>拒绝退款</div>
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
                            <template v-else>
                                <div v-if="returnAmountsRecord.id">
                                    <div class="tips">退款成功时间：{{returnAmountsRecord.refundTime|formatDateAll}}</div>
                                    <div class="tips">退款余额：￥{{returnAmountsRecord.actualBalance}}</div>
                                    <div class="tips">退款代币：{{returnAmountsRecord.actualTokenCoin}}代币</div>
                                    <div class="tips">退还积分：{{returnAmountsRecord.actualUserScore}}积分</div>
                                    <div class="tips">退还金额：￥{{returnAmountsRecord.actualAmounts}}</div>
                                </div>
                                <div v-else>
                                    <div class="tips">拒绝理由：{{returnProduct.refusal_reason}}</div>
                                </div>
                            </template>
                        </div>
                        <div class="info-other">
                            <div class="recode-item" v-if="returnProduct.agreeTime">
                                <span>{{returnProduct.adminName}}</span>
                                <template v-if="returnAmountsRecord.id">
                                    <span>同意退款</span>
                                </template>
                                <template v-else>
                                    <span>拒绝退款</span>
                                </template>
                                <span>{{returnProduct.agreeTime|formatDateAll}}</span>
                            </div>
                            <div class="recode-item" v-if="returnProduct.applyTime">
                                <span>{{returnProduct.nickname}}</span><span>发起了退款申请</span><span>{{returnProduct.applyTime|formatDateAll}}</span>
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
                                <div class="item">买家：{{returnProduct.nickname}}</div>
                                <div class="item">订单编号：{{returnProduct.orderNum}}</div>
                                <div class="item">成交时间：{{returnProduct.payTime|formatDateAll}}</div>
                                <div class="item">单价：¥{{returnProduct.price}}*{{returnProduct.num}}(数量)</div>
                                <!--<div class="item">邮费：¥8.00</div>-->
                                <div class="item">商品总价：¥{{returnProduct.price*returnProduct.num}}</div>
                                <div class="item">退款编号：{{returnProduct.refund_no}}</div>
                                <!--<div class="item">退款金额：¥88.50</div>-->
                                <div class="item">应退现金：¥{{returnProduct.returnAmounts}}</div>
                                <div class="item">应退余额：¥{{returnProduct.returnBalance}}</div>
                                <div class="item">应退代币：¥{{returnProduct.returnTokenCoin}}</div>
                                <div class="item">应退积分：¥{{returnProduct.returnUserScore}}</div>
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
            <el-form v-model="form" label-width="100px">
                <el-form-item label="报损原因">
                    <el-select v-model="form.badReason" @change="chooseBadReason" placeholder="请选择报损原因">
                        <el-option label="请选择报损原因" value=""></el-option>
                        <el-option v-for="(v,k) in reasonList" :key="k" :label="v.dValue" :value="v.dValue"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="报损说明">
                    <el-input type="textarea" v-model="form.scrapReason" auto-complete="off"
                              placeholder="请输入说明文字"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submit('form')">确认提交</el-button>
                <el-button @click="badDebtMask=false">取 消</el-button>
            </div>
        </el-dialog>
        <!--同意退款弹窗-->
        <el-dialog title="确认退款金额" class="agreeMask" :visible.sync="agreeMask">
            <el-form v-model="form" label-width="110px">
                <el-form-item label="买家支付方式：">{{payTime}}</el-form-item>
                <div class="row">
                    <el-form-item label="退还代币">
                        <el-input v-model="form.tokenCoin" type="number" @blur="changeMoney('0',form.tokenCoin)"
                                  auto-complete="off" placeholder="请输入退还代币"></el-input>
                        <span class="mar-left5">枚</span>
                    </el-form-item>
                    <el-form-item label="退还余额">
                        <el-input v-model="form.balance" type="number" @blur="changeMoney('1',form.balance)"
                                  auto-complete="off" placeholder="请输入退还余额"></el-input>
                        <span class="mar-left5">元</span>
                    </el-form-item>
                </div>
                <div class="row">
                    <el-form-item label="退还积分">
                        <el-input v-model="form.userScore" type="number" @blur="changeMoney('2',form.userScore)"
                                  auto-complete="off" placeholder="请输入退还积分"></el-input>
                        <span class="mar-left5">分</span>
                    </el-form-item>
                    <el-form-item label="退还金额">
                        <el-input v-model="form.amounts" type="number" @blur="changeMoney('3',form.amounts)"
                                  auto-complete="off" placeholder="请输入退还金额"></el-input>
                        <span class="mar-left5">元</span>
                    </el-form-item>
                </div>
                <div class="row">
                    <el-form-item label="支付手续费">
                        <el-input readonly auto-complete="off" placeholder="0"></el-input>
                        <span class="mar-left5">元</span>
                    </el-form-item>
                    <el-form-item label="退款手续费">
                        <el-input readonly auto-complete="off" placeholder="0"></el-input>
                        <span class="mar-left5">元</span>
                    </el-form-item>
                </div>
                <!--<el-form-item label="退款账户：">支付宝 交易号 6212***********1203</el-form-item>-->
                <el-form-item label="报损原因">
                    <el-select v-model="form.badReason" @change="chooseBadReason" placeholder="请选择报损原因">
                        <el-option label="请选择报损原因" value=""></el-option>
                        <el-option v-for="(v,k) in reasonList" :key="k" :label="v.dValue" :value="v.dValue"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="报损说明">
                    <el-input type="textarea" v-model="form.scrapReason" auto-complete="off"
                              placeholder="请输入说明文字"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="refundSubmit(1,'form')">确认退款金额</el-button>
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
                <el-form-item label="报损原因">
                    <el-select v-model="form.badReason" @change="chooseBadReason" placeholder="请选择报损原因">
                        <el-option label="请选择报损原因" value=""></el-option>
                        <el-option v-for="(v,k) in reasonList" :key="k" :label="v.dValue" :value="v.dValue"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="报损说明">
                    <el-input type="textarea" v-model="form.scrapReason" auto-complete="off"
                              placeholder="请输入说明文字"></el-input>
                </el-form-item>
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
                productId: '',
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
                // 详情
                returnProduct: {},
                // 退款类型
                payTime: '',
                imgList: [],
                returnAmountsRecord: {},
                id: '',
                value: [],
                // 报损原因
                reasonList: []
            };
        },

        activated() {
            this.productId = this.$route.query.afterSaleOprId || sessionStorage.getItem('afterSaleOprId');
            this.getDictionaryData();
            this.getInfo();
        },
        methods: {
            // 获取详情
            getInfo() {
                request.lookDetail({ returnProductId: this.productId }).then(res => {
                    this.returnProduct = res.data;
                    this.imgList = res.data.imgList;
                    if (res.data.returnAmountsRecord) {
                        this.returnAmountsRecord = res.data.returnAmountsRecord;
                        this.orderId = res.data.returnAmountsRecord.orderId;
                    }
                    this.opr = this.returnProduct.type;
                    this.status = this.returnProduct.status;
                    this.id = this.returnProduct.id;
                    let tmpType = '';
                    if ((res.data.payType & 1) != 0) {
                        tmpType += `平台支付`;
                    }
                    if ((res.data.payType & 2) != 0) {
                        tmpType += `+微信小程序支付`;
                    }
                    if ((res.data.payType & 4) != 0) {
                        tmpType += `+APP支付`;
                    }
                    if ((res.data.payType & 8) != 0) {
                        tmpType += `+支付宝支付`;
                    }
                    if ((res.data.payType & 16) != 0) {
                        tmpType += `+银联支付`;
                    }
                    this.payTime = tmpType;
                    this.getProgressStu(this.status, this.returnProduct.expressNo, this.returnProduct.ecExpressNo, this.opr);
                    if (this.returnProduct.outTime) {
                        this.getDistanceTime(this.returnProduct.outTime);
                    }
                    this.value.push(this.returnProduct.returnTokenCoin, this.returnProduct.returnBalance, this.returnProduct.returnUserScore, this.returnProduct.returnAmounts);
                }).catch(err => {
                    console.log(err);
                });
            },
            changeMoney(num, pre) {
                if (pre > this.value[num]) {
                    if (num == 0) {
                        this.$message.warning('超过最大可退还代币值!');
                        this.form.tokenCoin = this.value[0];
                    } else if (num == 1) {
                        this.$message.warning('超过最大可退还余额!');
                        this.form.balance = this.value[1];
                    } else if (num == 2) {
                        this.$message.warning('超过最大可退还积分!');
                        this.form.userScore = this.value[2];
                    } else {
                        this.$message.warning('超过最大可退还金额!');
                        this.form.amounts = this.value[3];
                    }
                }
            },
            // 判断进度条状态,s状态  num1买家退货单号  num2卖家单号
            getProgressStu(s, num1, num2, type) {
                if (s == 1) {
                    this.boolFirst = true;
                    this.boolSec = true;
                    if (num1) {
                        this.boolThr = true;
                    } else {
                        this.boolThr = false;
                    }
                    if (num2) {
                        this.boolFor = true;
                        this.boolFif = true;
                    } else {
                        this.boolFor = false;
                        this.boolFif = false;
                    }
                } else {
                    this.boolFirst = true;
                    this.boolSec = true;
                    this.boolThr = true;
                    this.boolFor = true;
                    if (type == 1) {
                        if (s > 3) {
                            this.boolFif = true;
                        }
                    }
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
                request.exchangeChangeRefund({ returnProductId: this.id }).then(res => {
                    if (res.data.code == 200) {
                        this.getInfo();
                    } else {
                        this.$message.warning(res.data.msg);
                    }
                }).catch(err => {
                    console.log(err);
                });
            },
            // 是否同意退款按钮
            refundClick(num) {
                const that = this;
                // this.form.badReason = '';
                // this.form.scrapReason = '';
                if (num == 1) { // 同意
                    that.agreeMask = true;
                    this.form.tokenCoin = this.returnProduct.returnTokenCoin;
                    this.form.balance = this.returnProduct.returnBalance;
                    this.form.amounts = this.returnProduct.returnAmounts;
                    this.form.userScore = this.returnProduct.returnUserScore;
                } else { // 拒绝
                    that.rejectMask = true;
                }
            },
            // 已收货并同意换货提交
            submit(form) {
                this.badDebtMask = false;
                const data = {
                    returnProductId: this.id,
                    scrapReason: this[form].scrapReason,
                    hadScrap: this.form.badReason ? 1 : 2
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
                const that = this;
                const data = this[form];
                data.hadScrap = this[form].badReason ? 1 : 2;
                data.returnProductId = this.id;
                let url;
                if (num == 1) {
                    url = 'makeSureRefund';
                } else {
                    if (!data.reason) {
                        this.$message.warning('请选择拒绝原因!');
                        return;
                    }
                    url = 'refuse';
                }
                request[url](data).then(res => {
                    that.$message.success(res.data.msg);
                    that.agreeMask = false;
                    that.rejectMask = false;
                    that.getInfo();
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
                this.form.scrapReason = this.form.badReason;
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
                        that.status = 6;
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
                    returnProductId: this.id,
                    ecExpressName: '中通快递',
                    ecExpressNo: '221286279559'
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
            .el-form-item--small.el-form-item {
                display: inline-block;
            }
            .mar-left5 {
                margin-left: 5px;
            }
        }
        .tips-area {
            margin: -20px 0 10px 30px;
            color: #ff6868;
        }
    }
</style>
