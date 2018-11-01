<template>
    <div>
        <breadcrumb :nav='["首页"]'></breadcrumb>
        <el-row :gutter="20">
            <el-col :span="14">
                <el-card class="top-card clearfix" style='height:450px;overflow:auto'>
                    <div slot="header" class="clearfix">
                        <span class="card-title-rect"></span>
                        <span>数据类模块</span>
                    </div>
                    <div class="top-wrap">
                        <div class="top-card-content">
                            <div class="otitle"><icon class="icon" ico='icon-zhucedengluyonghuming' /> 今日会员注册</div>
                            <div class="ocontent">{{info.sign}}</div>
                        </div>
                        <div class="top-card-content">
                            <div class="otitle"><icon class="icon" ico='icon-huiyuan' /> 今日晋升会员</div>
                            <div class="ocontent">{{info.up}}</div>
                        </div>
                        <div class="top-card-content">
                            <div class="otitle"><icon class="icon" ico='icon-huiyuanjifenshixiaobaobiao' /> 今日会员激活数</div>
                            <div class="ocontent">{{info.activation}}</div>
                        </div>
                        <div class="top-card-content">
                            <div class="otitle"><icon class="icon" ico='icon-huiyuanjifenshixiaobaobiao' /> 今日拼店交易总额</div>
                            <div class="ocontent">{{info.storeTotal}}</div>
                        </div>
                        <div class="top-card-content">
                            <div class="otitle"><icon class="icon" ico='icon-yubeifeiyong'/>今日分红次数</div>
                            <div class="ocontent">{{info.bonusCount}}</div>
                        </div>
                        <div class="top-card-content">
                            <div class="otitle"><icon class="icon" ico='icon-yubeifeiyong'/>今日订单数</div>
                            <div class="ocontent">{{info.orderNum}}</div>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="10">
                <el-card class="top-card clearfix" style='height:450px'>
                    <div slot="header" class="clearfix">
                        <span class="card-title-rect"></span>
                        <span>会员层级分布图</span>
                    </div>
                    <div class="left-wrap">
                       <div style="color:#9e9e9e;font-size:14px;width:100%">会员用户总数:{{userNum}}人</div>
                       <div ref="memberDistr" :style="{width: '450px', height: '350px',margin:'0 auto'}"></div>
                    </div>
                </el-card>
            </el-col>
        </el-row >
        <el-row :gutter="20" style="margin-top:20px;">
            <el-col :span="14">
                <el-card class="top-card clearfix">
                    <div slot="header" class="clearfix">
                        <span class="card-title-rect"></span>
                        <span>快捷操作模块</span>
                    </div>
                    <div class="right-wrap">
                        <router-link to="/releaseProduct" tag="div">
                            <div class="right-content">
                                <div class="r-ico-wrap"><icon ico='icon-chanpin1' /></div>
                                <span class="r-content">发布产品</span>
                            </div>
                        </router-link>
                        <router-link to="/addBrand" tag="div">
                            <div class="right-content">
                                <div class="r-ico-wrap"><icon ico='icon-chanpin1' /></div>
                                <span class="r-content">添加品牌</span>
                            </div>
                        </router-link>
                        <router-link to="/addGift" tag="div">
                            <div class="right-content">
                                <div class="r-ico-wrap"><icon ico='icon-chanpin1' /></div>
                                <span class="r-content">发布礼包</span>
                            </div>
                        </router-link>
                        <router-link to="/addNoticeInform" tag="div">
                            <div class="right-content">
                                <div class="r-ico-wrap"><icon ico='icon-tongzhi' /></div>
                                <span class="r-content">发布公告/通知</span>
                            </div>
                        </router-link>
                        <router-link to="/sendInvite" tag="div">
                            <div class="right-content">
                                <div class="r-ico-wrap"><icon ico='icon-huiyuantianjiakehu' /></div>
                                <span class="r-content">会员邀请</span>
                            </div>
                        </router-link>
                        <router-link to="/memberManage" tag="div">
                            <div class="right-content">
                                <div class="r-ico-wrap"><icon ico='icon-huiyuantianjiakehu' /></div>
                                <span class="r-content">会员搜索</span>
                            </div>
                        </router-link>
                        <router-link to="" tag="div">
                            <div class="right-content">
                                <div class="r-ico-wrap"><icon ico='icon-chanpin1' /></div>
                                <span class="r-content">实名认证查看</span>
                            </div>
                        </router-link>
                        <router-link to="/addSupplier" tag="div">
                            <div class="right-content">
                                <div class="r-ico-wrap"><icon ico='icon-chanpin1' /></div>
                                <span class="r-content">添加供应商</span>
                            </div>
                        </router-link>
                        <router-link to="" tag="div">
                            <div class="right-content">
                                <div class="r-ico-wrap"><icon ico='icon-chaxun' /></div>
                                <span class="r-content">防伪码查询</span>
                            </div>
                        </router-link>
                        <router-link to="/advertisingManage" tag="div">
                            <div class="right-content">
                                <div class="r-ico-wrap"><icon ico='icon-chanpin1' /></div>
                                <span class="r-content">广告位管理</span>
                            </div>
                        </router-link>
                        <router-link to="" tag="div">
                            <div class="right-content">
                                <div class="r-ico-wrap"><icon ico='icon-chanpin1' /></div>
                                <span class="r-content">推荐位管理</span>
                            </div>
                        </router-link>
                        <router-link to="/sensitiveLibrary" tag="div">
                            <div class="right-content">
                                <div class="r-ico-wrap"><icon ico='icon-chanpin1' /></div>
                                <span class="r-content">敏感词库管理</span>
                            </div>
                        </router-link>
                        <router-link to="/addManger" tag="div">
                            <div class="right-content">
                                <div class="r-ico-wrap"><icon ico='icon-huiyuan' /></div>
                                <span class="r-content">创建管理员账号</span>
                            </div>
                        </router-link>
                        <router-link to="/accountRecharge" tag="div">
                            <div class="right-content">
                                <div class="r-ico-wrap"><icon ico='icon-chanpin1' /></div>
                                <span class="r-content">账户充值</span>
                            </div>
                        </router-link>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="10">
                <el-card class="top-card clearfix">
                    <div slot="header" class="clearfix">
                        <span class="card-title-rect"></span>
                        <span>待处理模块</span>
                    </div>
                    <div class="left-wrap">
                        <div class='left-content'>
                            <div class="ico-wrap"><img src="../../assets/images/icon-1.png" alt=""></div>
                            <span class='l-title'>待发货订单</span>
                            <span class="l-content">{{info.unSendOrderNum}}</span>
                        </div>
                        <div class='left-content'>
                            <div class="ico-wrap"><img src="../../assets/images/icon-1.png" alt=""></div>
                            <span class='l-title'>待反馈问题</span>
                            <span class="l-content">{{info.unanswered}}</span>
                        </div>
                        <div class='left-content'>
                            <div class="ico-wrap"><img src="../../assets/images/icon-1.png" alt=""></div>
                            <span class='l-title'>提现审核</span>
                            <span class="l-content">{{info.pending}}</span>
                        </div>
                        <div class='left-content'>
                            <div class="ico-wrap"><img src="../../assets/images/icon-1.png" alt=""></div>
                            <span class='l-title'>账户充值审核</span>
                            <span class="l-content">{{info.accountChange}}</span>
                        </div>
                        <div class='left-content'>
                            <div class="ico-wrap"><img src="../../assets/images/icon-1.png" alt=""></div>
                            <span class='l-title'>产品审核</span>
                            <span class="l-content">{{info.productCheck}}</span>
                        </div>
                        <div class='left-content'>
                            <div class="ico-wrap"><img src="../../assets/images/icon-1.png" alt=""></div>
                            <span class='l-title'>礼包审核</span>
                            <span class="l-content">{{info.packageCheck}}</span>
                        </div>
                        <div class='left-content'>
                            <div class="ico-wrap"><img src="../../assets/images/icon-1.png" alt=""></div>
                            <span class='l-title'>优惠套餐审核</span>
                            <span class="l-content">{{info.discountPackageCheck}}</span>
                        </div>
                        <div class='left-content'>
                            <div class="ico-wrap"><img src="../../assets/images/icon-1.png" alt=""></div>
                            <span class='l-title'>退款审核</span>
                            <span class="l-content">{{info.refund}}</span>
                        </div>
                        <div class='left-content'>
                            <div class="ico-wrap"><img src="../../assets/images/icon-1.png" alt=""></div>
                            <span class='l-title'>退货退款审核</span>
                            <span class="l-content">{{info.refunds}}</span>
                        </div>
                        <div class='left-content'>
                            <div class="ico-wrap"><img src="../../assets/images/icon-1.png" alt=""></div>
                            <span class='l-title'>换货审核</span>
                            <span class="l-content">{{info.exchange}}</span>
                        </div>
                        <div class='left-content'>
                            <div class="ico-wrap"><img src="../../assets/images/icon-1.png" alt=""></div>
                            <span class='l-title'>退货退款确认</span>
                            <span class="l-content">{{info.refundsCheck}}</span>
                        </div>
                        <div class='left-content'>
                            <div class="ico-wrap"><img src="../../assets/images/icon-1.png" alt=""></div>
                            <span class='l-title'>换货确认</span>
                            <span class="l-content">{{info.exchangeCheck}}</span>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
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
            info: {},
            userLevelName: [],
            userLevelMsg: [],
            userNum: ''
        };
    },
    created() {
        if (localStorage.getItem('ms_hadFirstLogin') == 1) {
            this.isShowActAccCode = true;
        }
    },
    activated() {
        this.getDashboardInfo();
    },
    mounted() {
        this.getUserLevel();
    },
    methods: {
        //  获取首页数据
        getDashboardInfo() {
            request.homeData({}).then(res => {
                this.info = res.data;
            }).catch(err => {
                console.log(err);
            });
        },
        // 获取会员层级
        getUserLevel() {
            this.userLevelName = [];
            this.userLevelMsg = [];
            this.userNum = 0;
            const colorArr = ['#33b4ff', '#ff908f', '#63d1e2', '#f2c56e', '#56cf88', '#ffa51e', '#ff908f', '#63d1e2', '#f2c56e'];
            request.queryLevelGroupUserCount({}).then(res => {
                res.data.forEach((v, k) => {
                    this.userLevelName.push(`${v.name}用户`);
                    this.userLevelMsg.push({
                        value: v.count,
                        name: `${v.name}用户`,
                        itemStyle: { color: colorArr[k] }
                    });
                    this.userNum += v.count;
                });
                this.echartsInit();
            }).catch(err => {
                console.log(err);
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
                    data: this.userLevelName,
                    show: false
                },
                series: [
                    {
                        name: '用户人数',
                        type: 'pie',
                        radius: '65%',
                        data: this.userLevelMsg,
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
