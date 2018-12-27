<template>
    <div>
        <breadcrumb :nav='["首页"]'></breadcrumb>
        <el-row :gutter="20">
            <el-col :span="14">
                <el-card class="top-card clearfix over-auto" style="height: 450px" v-auth="'dashboard.data'">
                    <div slot="header" class="clearfix">
                        <span class="card-title-rect"></span>
                        <span>数据类模块</span>
                    </div>
                    <div class="top-wrap">
                        <div class="top-card-content">
                            <div class="otitle"><icon class="icon" ico='icon-zhucedengluyonghuming' /> 今日会员注册</div>
                            <div class="ocontent">{{info.sign || 0}}</div>
                        </div>
                        <div class="top-card-content">
                            <div class="otitle"><icon class="icon" ico='icon-huiyuan' /> 今日晋升会员</div>
                            <div class="ocontent">{{info.up || 0}}</div>
                        </div>
                        <div class="top-card-content" style="cursor: pointer" @click="getOldUserActNum">
                            <div class="otitle"><icon class="icon" ico='icon-huiyuanjifenshixiaobaobiao' /> 今日会员激活数</div>
                            <div class="ocontent">{{info.activation || 0}}</div>
                        </div>
                        <div class="top-card-content">
                            <div class="otitle"><icon class="icon" ico='icon-huiyuanjifenshixiaobaobiao' /> 今日拼店交易总额</div>
                            <div class="ocontent">{{info.storeTotal || 0}}</div>
                        </div>
                        <div class="top-card-content">
                            <div class="otitle"><icon class="icon" ico='icon-yubeifeiyong'/>今日分红次数</div>
                            <div class="ocontent">{{info.bonusCount || 0}}</div>
                        </div>
                        <div class="top-card-content">
                            <div class="otitle"><icon class="icon" ico='icon-74wodedingdan'/>今日订单数</div>
                            <div class="ocontent">{{info.orderNum || 0}}</div>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="10">
                <el-card class="top-card clearfix over-auto" style="height: 450px" v-auth="'dashboard.member'">
                    <div slot="header" class="clearfix">
                        <span class="card-title-rect"></span>
                        <span>会员层级分布图</span>
                    </div>
                    <div class="left-wrap">
                       <!--<div style="color:#9e9e9e;font-size:14px;width:100%">会员用户总数:{{userNum}}人</div>-->
                       <div ref="memberDistr" :style="{width: '100%', height: '350px',margin:'0 auto'}"></div>
                    </div>
                </el-card>
            </el-col>
        </el-row >
        <el-row :gutter="20" style="margin-top:20px;">
            <el-col :span="14">
                <el-card class="top-card clearfix over-auto" v-auth="'dashboard.shortcut'">
                    <div slot="header" class="clearfix">
                        <span class="card-title-rect"></span>
                        <span>快捷操作模块</span>
                    </div>
                    <div class="right-wrap">
                        <router-link to="/releaseProduct" tag="div" v-auth="'dashboard.shortcut.fbcp'">
                            <div class="right-content">
                                <div class="r-ico-wrap"><icon ico='icon-chanpin1' /></div>
                                <span class="r-content">发布产品</span>
                            </div>
                        </router-link>
                        <router-link to="/addBrand" tag="div" v-auth="'dashboard.shortcut.tjpp'">
                            <div class="right-content">
                                <div class="r-ico-wrap"><icon ico='icon-pinpai' /></div>
                                <span class="r-content">添加品牌</span>
                            </div>
                        </router-link>
                        <router-link to="/Gift" tag="div" v-auth="'dashboard.shortcut.fblb'">
                            <div class="right-content">
                                <div class="r-ico-wrap"><icon ico='icon-libao' /></div>
                                <span class="r-content">发布礼包</span>
                            </div>
                        </router-link>
                        <router-link to="/addNoticeInform" tag="div" v-auth="'dashboard.shortcut.fbggtx'">
                            <div class="right-content">
                                <div class="r-ico-wrap"><icon ico='icon-tongzhi' /></div>
                                <span class="r-content">发布公告/通知</span>
                            </div>
                        </router-link>
                        <router-link to="/sendInvite" tag="div" v-auth="'dashboard.shortcut.hyyq'">
                            <div class="right-content">
                                <div class="r-ico-wrap"><icon ico='icon-huiyuantianjiakehu' /></div>
                                <span class="r-content">会员邀请</span>
                            </div>
                        </router-link>
                        <router-link to="/memberManage" tag="div" v-auth="'dashboard.shortcut.hyss'">
                            <div class="right-content">
                                <div class="r-ico-wrap"><icon ico='icon-sousuo' /></div>
                                <span class="r-content">会员搜索</span>
                            </div>
                        </router-link>
                        <router-link to="/realNameAuthentication" tag="div" v-auth="'dashboard.shortcut.smrzck'">
                            <div class="right-content">
                                <div class="r-ico-wrap"><icon ico='icon-shouquanfuwu' /></div>
                                <span class="r-content">实名认证查看</span>
                            </div>
                        </router-link>
                        <router-link to="/addSupplier" tag="div" v-auth="'dashboard.shortcut.tjgys'">
                            <div class="right-content">
                                <div class="r-ico-wrap"><icon ico='icon-huiyuanzhanghaoguanli' /></div>
                                <span class="r-content">添加供应商</span>
                            </div>
                        </router-link>
                        <router-link to="/rootsCodeQuery" tag="div" v-auth="'dashboard.shortcut.fwmcx'">
                            <div class="right-content">
                                <div class="r-ico-wrap"><icon ico='icon-chaxun' /></div>
                                <span class="r-content">防伪码查询</span>
                            </div>
                        </router-link>
                        <router-link to="/advertisingManage" tag="div" v-auth="'dashboard.shortcut.ggwgl'">
                            <div class="right-content">
                                <div class="r-ico-wrap"><icon ico='icon-fenlei' /></div>
                                <span class="r-content">广告位管理</span>
                            </div>
                        </router-link>
                        <router-link to="/advertisingManage" tag="div" v-auth="'dashboard.shortcut.tjwgl'">
                            <div class="right-content">
                                <div class="r-ico-wrap"><icon ico='icon-fenlei' /></div>
                                <span class="r-content">推荐位管理</span>
                            </div>
                        </router-link>
                        <router-link to="/sensitiveLibrary" tag="div" v-auth="'dashboard.shortcut.mgckgl'">
                            <div class="right-content">
                                <div class="r-ico-wrap"><icon ico='icon-yduipaibanleixingliebiao' /></div>
                                <span class="r-content">敏感词库管理</span>
                            </div>
                        </router-link>
                        <router-link to="/addManger" tag="div" v-auth="'dashboard.shortcut.cjglyzh'">
                            <div class="right-content">
                                <div class="r-ico-wrap"><icon ico='icon-zhucedengluyonghuming' /></div>
                                <span class="r-content">创建管理员账号</span>
                            </div>
                        </router-link>
                        <router-link to="/accountRecharge" tag="div" v-auth="'dashboard.shortcut.zhcz'">
                            <div class="right-content">
                                <div class="r-ico-wrap"><icon ico='icon-zhanghuchongzhi-xiugai' /></div>
                                <span class="r-content">账户充值</span>
                            </div>
                        </router-link>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="10">
                <el-card class="top-card clearfix over-auto" v-auth="'dashboard.todo'">
                    <div slot="header" class="clearfix">
                        <span class="card-title-rect"></span>
                        <span>待处理模块</span>
                    </div>
                    <div class="left-wrap">
                        <router-link tag="div" to="/orderList" class='left-content' v-auth="'dashboard.todo.dfhdd'">
                            <div class="ico-wrap"><icon ico='icon-daifahuo' /></div>
                            <span class='l-title'>待发货订单</span>
                            <span class="l-content">{{info.unSendOrderNum}}</span>
                        </router-link>
                        <router-link tag="div" to="/feedBack" class='left-content' v-auth="'dashboard.todo.dfkwt'">
                            <div class="ico-wrap"><icon ico='icon-wentifankui' /></div>
                            <span class='l-title'>待反馈问题</span>
                            <span class="l-content">{{info.unanswered}}</span>
                        </router-link>
                        <router-link tag="div" to="/withdrawalAudit" class='left-content' v-auth="'dashboard.todo.txsh'">
                            <div class="ico-wrap"><icon ico='icon-tixian' /></div>
                            <span class='l-title'>提现审核</span>
                            <span class="l-content">{{info.pending}}</span>
                        </router-link>
                        <router-link tag="div" to="/showValReCharge" class='left-content' v-auth="'dashboard.todo.zhczsh'">
                            <div class="ico-wrap"><icon ico='icon-zhanghuchongzhi-xiugai' /></div>
                            <span class='l-title'>账户充值审核</span>
                            <span class="l-content">{{info.accountChange}}</span>
                        </router-link>
                        <router-link tag="div" to="/productList" class='left-content' v-auth="'dashboard.todo.cpsh'">
                            <div class="ico-wrap"><icon ico='icon-shangpin' /></div>
                            <span class='l-title'>产品审核</span>
                            <span class="l-content">{{info.productCheck}}</span>
                        </router-link>
                        <router-link tag="div" to="/giftManage" class='left-content' v-auth="'dashboard.todo.lbsh'">
                            <div class="ico-wrap"><icon ico='icon-libao' /></div>
                            <span class='l-title'>礼包审核</span>
                            <span class="l-content">{{info.packageCheck}}</span>
                        </router-link>
                        <router-link tag="div" to="/giftManage" class='left-content' v-auth="'dashboard.todo.yhtcsh'">
                            <div class="ico-wrap"><icon ico='icon-zhanghuchongzhi-xiugai' /></div>
                            <span class='l-title'>优惠套餐审核</span>
                            <span class="l-content">{{info.discountPackageCheck}}</span>
                        </router-link>
                        <router-link tag="div" to="/orderList" class='left-content' v-auth="'dashboard.todo.tkss'">
                            <div class="ico-wrap"><icon ico='icon-tuikuan' /></div>
                            <span class='l-title'>退款审核</span>
                            <span class="l-content">{{info.refund}}</span>
                        </router-link>
                        <router-link tag="div" to="/orderList" class='left-content' v-auth="'dashboard.todo.tkthss'">
                            <div class="ico-wrap"><icon ico='icon-dulituihuodingdan' /></div>
                            <span class='l-title'>退货退款审核</span>
                            <span class="l-content">{{info.refunds}}</span>
                        </router-link>
                        <router-link tag="div" to="/orderList" class='left-content' v-auth="'dashboard.todo.hhss'">
                            <div class="ico-wrap"><icon ico='icon-tuihuanhuodingdan' /></div>
                            <span class='l-title'>换货审核</span>
                            <span class="l-content">{{info.exchange}}</span>
                        </router-link>
                        <router-link tag="div" to="/orderList" class='left-content' v-auth="'dashboard.todo.tkthqr'">
                            <div class="ico-wrap"><icon ico='icon-chaxun' /></div>
                            <span class='l-title'>退货退款确认</span>
                            <span class="l-content">{{info.refundsCheck}}</span>
                        </router-link>
                        <router-link tag="div" to="/orderList" class='left-content' v-auth="'dashboard.todo.hhqr'">
                            <div class="ico-wrap"><icon ico='icon-dingdan' /></div>
                            <span class='l-title'>换货确认</span>
                            <span class="l-content">{{info.exchangeCheck}}</span>
                        </router-link>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <act-account-code @status='isShowCode' v-if="isShowActAccCode"></act-account-code>
        <act-account-pwd @status='isShowPwd' v-if="isShowActAccPwd"></act-account-pwd>
        <!--老用户数据激活弹窗-->
        <el-dialog
            title="用户激活数量"
            :visible.sync="oldUserNumMask"
            :before-close="closeMask"
            width="800px">
            <el-date-picker type="daterange" v-model="activeDate" start-placeholder="开始时间" end-placeholder="结束时间" class="vam"></el-date-picker>
            <el-button type="primary" @click="getOldUserActNum">搜索</el-button>
            <el-button @click="()=>{activeDate = [];getOldUserActNum()}">重置</el-button>
            <el-table v-loading="tableLoading" :data="oldUserActiveNum" class="mt10" border stripe>
                <el-table-column fixed="left" prop="level" label="用户层级" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.level !== null && scope.row.level !== '总计'">{{`v${scope.row.level}`}}</span>
                        <span v-else-if="scope.row.level !== null && scope.row.level === '总计'">{{scope.row.level}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="num" label="新老用户总计" align="center"></el-table-column>
                <el-table-column width="120px" v-for="(v, k) in dateNum" :key="k" :prop="v.day" :label="v.day" align="center"></el-table-column>
                <el-table-column fixed="right" prop="total" label="老用户总计" align="center"></el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="closeMask">确 定</el-button>
                <el-button @click="closeMask">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import icon from '../common/ico';
import breadcrumb from '../common/Breadcrumb';
import actAccountPwd from './Dashboard/actAccountPwd';
import actAccountCode from './Dashboard/actAccountCode';
import request from '@/http/http.js';
import { mapGetters } from 'vuex';

export default {
    components: {
        icon,
        breadcrumb,
        actAccountPwd,
        actAccountCode
    },
    computed: {
        ...mapGetters([
            'user'
        ]),
        dateNum() {
            return this.oldUserActiveNum.length === 0 ? [] : !this.oldUserActiveNum[0].counts || this.oldUserActiveNum[0].counts.length === 0 ? [] : this.oldUserActiveNum[0].counts;
        }
    },
    data() {
        return {
            isShowActAccPwd: false,
            isShowActAccCode: false,
            oldUserNumMask: false,
            info: {},
            userLevelName: [],
            userLevelMsg: [],
            userNum: '',
            activeDate: [], // 老用户激活时间
            tableLoading: false,
            // 老用户激活列表
            oldUserActiveNum: []
        };
    },
    created() {
        if (this.user.hadFirstLogin == 1) {
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
                    this.userLevelName.push(`v${v.level}用户`);
                    this.userLevelMsg.push({
                        value: v.count,
                        name: `v${v.level}用户`,
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
            const option = {
                title: {
                    text: `会员用户总数:${this.userNum || 0}人`,
                    textStyle: {
                        color: '#9e9e9e'
                    },
                    x: 'left'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    top: '30px',
                    data: this.userLevelName,
                    show: true
                },
                series: [
                    {
                        name: '用户人数',
                        type: 'pie',
                        radius: '100px',
                        center: ['55%', '55%'],
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
                                    return `${params.name}\n${params.percent}%`;
                                }
                            }
                        },
                        labelLine: {
                            length: 10,
                            length2: 20,
                            smooth: 0.2
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
        },
        // 获取老用户激活数据
        getOldUserActNum() {
            this.oldUserNumMask = true;
            this.activeDate = this.activeDate ? this.activeDate : [];
            const data = {
                startTime: this.activeDate.length === 0 ? '' : this.$utils.formatTime(this.activeDate[0], 1),
                endTime: this.activeDate.length === 0 ? '' : this.$utils.formatTime(this.activeDate[1], 1)
            };
            this.tableLoading = true;
            request.countSignUsers(data).then(res => {
                this.tableLoading = false;
                const arr = res.data || [];
                if (arr.length !== 0) {
                    arr.forEach(v => {
                        if (v.counts && v.counts.length !== 0) {
                            v.counts.forEach(ele => {
                                v[ele.day] = ele.num;
                            });
                        }
                    });
                }
                // 统计人数
                const totalObj = {
                    level: '总计',
                    num: 0,
                    total: 0
                };
                if (arr.length !== 0) {
                    const count = arr[0].counts || [];
                    const len = count.length;
                    arr[0].counts.forEach(v => {
                        totalObj[v.day] = 0;
                    });
                    arr.forEach(v => {
                        totalObj.num += v.num || 0;
                        totalObj.total += v.total || 0;
                        if (v.counts && v.counts.length !== 0) {
                            v.counts.forEach(ele => {
                                totalObj[ele.day] += ele.num || 0;
                            });
                        }
                    });
                }
                arr.push(totalObj);
                this.oldUserActiveNum = arr;
            }).catch(err => {
                this.tableLoading = false;
                console.log(err);
            });
        },
        // 关闭用户激活数量显示弹窗
        closeMask() {
            this.activeDate = [];
            this.oldUserNumMask = false;
        }
    }
};
</script>


<style scoped>
@import "../../assets/css/dashboard/dashboard.css";
</style>
