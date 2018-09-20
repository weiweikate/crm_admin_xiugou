<template>
    <div>
        <breadcrumb :nav='["首页"]'></breadcrumb>
        <!--<el-row :gutter="20">-->
            <!--<el-col :span="14">-->
                <!--<el-card class="top-card clearfix" style='height:450px;overflow:auto'>-->
                    <!--<div slot="header" class="clearfix">-->
                        <!--<span class="card-title-rect"></span>-->
                        <!--<span>数据类模块</span>-->
                    <!--</div>-->
                    <!--<div class="top-wrap">-->
                        <!--<div class="top-card-content">-->
                            <!--<div class="otitle"><icon class="icon" ico='icon-zhucedengluyonghuming' /> 今日会员注册</div>-->
                            <!--<div class="ocontent">{{info.RegisterTodayAmount}}</div>-->
                        <!--</div>-->
                        <!--<div class="top-card-content">-->
                            <!--<div class="otitle"><icon class="icon" ico='icon-huiyuan' /> 今日晋升会员</div>-->
                            <!--<div class="ocontent">无</div>-->
                        <!--</div>-->
                        <!--<div class="top-card-content">-->
                            <!--<div class="otitle"><icon class="icon" ico='icon-huiyuanjifenshixiaobaobiao' /> 会员激活数</div>-->
                            <!--<div class="ocontent">{{info.ActivateAmount}}</div>-->
                        <!--</div>-->
                        <!--<div class="top-card-content">-->
                            <!--<div class="otitle"><icon class="icon" ico='icon-huiyuanjifenshixiaobaobiao' /> 今日拼店交易总额</div>-->
                            <!--<div class="ocontent">无</div>-->
                        <!--</div>-->
                        <!--<div class="top-card-content">-->
                            <!--<div class="otitle"><icon class="icon" ico='icon-yubeifeiyong'/>今日分红次数</div>-->
                            <!--<div class="ocontent">{{info.DividendTodayAmount}}</div>-->
                        <!--</div>-->
                        <!--<div class="top-card-content">-->
                            <!--<div class="otitle"><icon class="icon" ico='icon-yubeifeiyong'/>今日订单数</div>-->
                            <!--<div class="ocontent">{{info.OrderTodayAmount}}</div>-->
                        <!--</div>-->
                    <!--</div>-->
                <!--</el-card>-->
            <!--</el-col>-->
            <!--<el-col :span="10">-->
                <!--<el-card class="top-card clearfix" style='height:450px'>-->
                    <!--<div slot="header" class="clearfix">-->
                        <!--<span class="card-title-rect"></span>-->
                        <!--<span>会员层级分布图</span>-->
                    <!--</div>-->
                    <!--<div class="left-wrap">-->
                       <!--<div style="color:#9e9e9e;font-size:14px;width:100%">会员用户总数:{{info.DealerLevelData.V1+info.DealerLevelData.V2+info.DealerLevelData.V3+info.DealerLevelData.V4}}人</div>-->
                       <!--<div ref="memberDistr" :style="{width: '450px', height: '350px',margin:'0 auto'}"></div>-->
                    <!--</div>-->
                <!--</el-card>-->
            <!--</el-col>-->
        <!--</el-row >-->
        <!--<el-row :gutter="20" style="margin-top:20px;">-->
            <!--<el-col :span="14">-->
                <!--<el-card class="top-card clearfix">-->
                    <!--<div slot="header" class="clearfix">-->
                        <!--<span class="card-title-rect"></span>-->
                        <!--<span>快捷操作模块</span>-->
                    <!--</div>-->
                    <!--<div class="right-wrap">-->
                        <!--<router-link to="/memberManage" tag="div">-->
                            <!--<div class="right-content">-->
                                <!--<div class="r-ico-wrap"><icon ico='icon-chanpin1' /></div>-->
                                <!--<span class="r-content">经销商会员搜索</span>-->
                            <!--</div>-->
                        <!--</router-link>-->
                        <!--<router-link to="/addNoticeInform" tag="div">-->
                            <!--<div class="right-content">-->
                                <!--<div class="r-ico-wrap"><icon ico='icon-tongzhi' /></div>-->
                                <!--<span class="r-content">发布公告/通知</span>-->
                            <!--</div>-->
                        <!--</router-link>-->
                        <!--&lt;!&ndash; <router-link to="/addNoticeInform" tag="div"> &ndash;&gt;-->
                            <!--<div class="right-content">-->
                                <!--<div class="r-ico-wrap"><icon ico='icon-tongzhi' /></div>-->
                                <!--<span class="r-content">发布问卷调查</span>-->
                            <!--</div>-->
                        <!--&lt;!&ndash; </router-link> &ndash;&gt;-->
                        <!--<router-link to="/sendInvite" tag="div">-->
                            <!--<div class="right-content">-->
                                <!--<div class="r-ico-wrap"><icon ico='icon-huiyuantianjiakehu' /></div>-->
                                <!--<span class="r-content">会员邀请</span>-->
                            <!--</div>-->
                        <!--</router-link>-->
                        <!--<router-link to="/addManger" tag="div">-->
                            <!--<div class="right-content">-->
                                <!--<div class="r-ico-wrap"><icon ico='icon-huiyuan' /></div>-->
                                <!--<span class="r-content">创建管理员账号</span>-->
                            <!--</div>-->
                        <!--</router-link>-->
                        <!--<router-link to="/rootsCodeQuery" tag="div">-->
                            <!--<div class="right-content">-->
                                <!--<div class="r-ico-wrap"><icon ico='icon-chaxun' /></div>-->
                                <!--<span class="r-content">防伪码查询</span>-->
                            <!--</div>-->
                        <!--</router-link>-->
                        <!--<router-link to="/releaseProduct" tag="div">-->
                            <!--<div class="right-content">-->
                                <!--<div class="r-ico-wrap"><icon ico='icon-chanpin1' /></div>-->
                                <!--<span class="r-content">发布产品</span>-->
                            <!--</div>-->
                        <!--</router-link>-->
                        <!--<router-link to="/addBrand" tag="div">-->
                            <!--<div class="right-content">-->
                                <!--<div class="r-ico-wrap"><icon ico='icon-chanpin1' /></div>-->
                                <!--<span class="r-content">添加品牌</span>-->
                            <!--</div>-->
                        <!--</router-link>-->
                        <!--<router-link to="/advertisingManage" tag="div">-->
                            <!--<div class="right-content">-->
                                <!--<div class="r-ico-wrap"><icon ico='icon-chanpin1' /></div>-->
                                <!--<span class="r-content">广告位管理</span>-->
                            <!--</div>-->
                        <!--</router-link>-->
                        <!--<router-link to="/addGift" tag="div">-->
                            <!--<div class="right-content">-->
                                <!--<div class="r-ico-wrap"><icon ico='icon-chanpin1' /></div>-->
                                <!--<span class="r-content">发布礼包</span>-->
                            <!--</div>-->
                        <!--</router-link>-->
                        <!--<router-link to="" tag="div">-->
                            <!--<div class="right-content">-->
                                <!--<div class="r-ico-wrap"><icon ico='icon-chanpin1' /></div>-->
                                <!--<span class="r-content">实名认证查看</span>-->
                            <!--</div>-->
                        <!--</router-link>-->
                        <!--<router-link to="/addSupplier" tag="div">-->
                            <!--<div class="right-content">-->
                                <!--<div class="r-ico-wrap"><icon ico='icon-chanpin1' /></div>-->
                                <!--<span class="r-content">添加供应商</span>-->
                            <!--</div>-->
                        <!--</router-link>-->
                        <!--<router-link to="/featured" tag="div">-->
                            <!--<div class="right-content">-->
                                <!--<div class="r-ico-wrap"><icon ico='icon-chanpin1' /></div>-->
                                <!--<span class="r-content">推荐位管理</span>-->
                            <!--</div>-->
                        <!--</router-link>-->
                        <!--<router-link to="/accountRecharge" tag="div">-->
                            <!--<div class="right-content">-->
                                <!--<div class="r-ico-wrap"><icon ico='icon-chanpin1' /></div>-->
                                <!--<span class="r-content">账户充值</span>-->
                            <!--</div>-->
                        <!--</router-link>-->
                    <!--</div>-->
                <!--</el-card>-->
            <!--</el-col>-->
            <!--<el-col :span="10">-->
                <!--<el-card class="top-card clearfix">-->
                    <!--<div slot="header" class="clearfix">-->
                        <!--<span class="card-title-rect"></span>-->
                        <!--<span>待处理模块</span>-->
                    <!--</div>-->
                    <!--<div class="left-wrap">-->
                        <!--<div class='left-content'>-->
                            <!--<div class="ico-wrap"><img src="../../assets/images/icon-1.png" alt=""></div>-->
                            <!--<span class='l-title'>待发货订单</span>-->
                            <!--<span class="l-content">{{info.WaitSendOrderAmount}}</span>-->
                        <!--</div>-->
                        <!--<div class='left-content'>-->
                            <!--<div class="ico-wrap"><img src="../../assets/images/icon-1.png" alt=""></div>-->
                            <!--<span class='l-title'>退款申请</span>-->
                            <!--<span class="l-content">{{info.RefundAmount}}</span>-->
                        <!--</div>-->
                        <!--<div class='left-content'>-->
                            <!--<div class="ico-wrap"><img src="../../assets/images/icon-1.png" alt=""></div>-->
                            <!--<span class='l-title'>退货申请</span>-->
                            <!--<span class="l-content">{{info.ReturnAmount}}</span>-->
                        <!--</div>-->
                        <!--<div class='left-content'>-->
                            <!--<div class="ico-wrap"><img src="../../assets/images/icon-1.png" alt=""></div>-->
                            <!--<span class='l-title'>换货申请</span>-->
                            <!--<span class="l-content">{{info.ExchangeGoodsAmount}}</span>-->
                        <!--</div>-->
                        <!--<div class='left-content'>-->
                            <!--<div class="ico-wrap"><img src="../../assets/images/icon-1.png" alt=""></div>-->
                            <!--<span class='l-title'>待反馈问题</span>-->
                            <!--<span class="l-content">{{info.ToFeedBackAmount}}</span>-->
                        <!--</div>-->
                        <!--<div class='left-content'>-->
                            <!--<div class="ico-wrap"><img src="../../assets/images/icon-1.png" alt=""></div>-->
                            <!--<span class='l-title'>提现审核</span>-->
                            <!--<span class="l-content">{{info.WithdrawalAuditAmount}}</span>-->
                        <!--</div>-->
                    <!--</div>-->
                <!--</el-card>-->
            <!--</el-col>-->
        <!--</el-row>-->
        <act-account-code @status='isShowCode' v-if="isShowActAccCode"></act-account-code>
        <act-account-pwd @status='isShowPwd' v-if="isShowActAccPwd"></act-account-pwd>
    </div>
</template>

<script>
import icon from '../common/ico';
import breadcrumb from '../common/Breadcrumb';
import actAccountPwd from './Dashboard/actAccountPwd';
import actAccountCode from './Dashboard/actAccountCode';
import request from '@/http/http.js';

export default {
    components: {
        icon,
        breadcrumb,
        actAccountPwd,
        actAccountCode
    },
    data() {
        return {
            isShowActAccPwd: false,
            isShowActAccCode: false,
            info: {}
        };
    },
    created() {
        if (localStorage.getItem('ms_hadFirstLogin') == 1) {
            this.isShowActAccCode = true;
        }
    },

    activated() {
        // this.getDashboardInfo();
    },
    mounted() {
        // this.getDashboardInfo();
    },
    methods: {
    //  获取首页数据
        getDashboardInfo() {
            request.indexData().then(res => {
                this.info = res.data.data;
                this.echartsInit();
            }).catch(err => {

            });
        },
        //  会员层级分布图
        echartsInit() {
            const myChart = this.$echarts.init(this.$refs.memberDistr);
            const that = this;
            const option = {
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: ['V1用户', 'V2用户', 'V3用户', 'V4用户'],
                    show: false
                },
                series: [
                    {
                        name: '用户人数',
                        type: 'pie',
                        radius: '65%',
                        data: [
                            {
                                value: this.info.DealerLevelData.V1,
                                name: 'V1用户',
                                itemStyle: { color: '#63d1e2' }
                            },
                            {
                                value: this.info.DealerLevelData.V2,
                                name: 'V2用户',
                                itemStyle: { color: '#FF7E00' }
                            },
                            {
                                value: this.info.DealerLevelData.V3,
                                name: 'V3用户',
                                itemStyle: { color: '#FF908F' }
                            },
                            {
                                value: this.info.DealerLevelData.V4,
                                name: 'V4用户',
                                itemStyle: { color: '#56CF88' }
                            }
                        ],
                        label: {
                            // 饼图图形上的文本标签
                            normal: {
                                show: true,
                                position: 'outside', // 标签的位置
                                textStyle: {
                                    fontWeight: 300,
                                    fontSize: 14
                                },
                                formatter(params) {
                                    return `${params.name}\n\n${params.percent}%`;
                                }
                            }
                        }
                    }
                ]
            };
            myChart.setOption(option);
        },
        //  激活账号弹窗
        isShowCode(msg) {
            this.isShowActAccCode = msg;
            this.isShowActAccPwd = !msg;
        },
        isShowPwd(msg) {
            this.isShowActAccPwd = false;
        }
    }
};
</script>


<style scoped>
@import "../../assets/css/dashboard/dashboard.css";
</style>
