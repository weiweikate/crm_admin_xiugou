<template>
    <div class="logistics">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card v-loading="loading" class="area">
            <div class="info mar-left20">物流公司：{{exName}}</div>
            <div class="number mar-left20">运单号码：{{exNo}}</div>
            <div v-if='progressList.length != 0' class="detail-area mar-left40">
                <ul>
                    <li v-for="(v,k) in progressList" :key="k">
                        <span>{{v.time | formatOrderTime}}</span>
                        <span v-if='k != 0 ' class="spec"><span class="circle"></span></span>
                        <span v-else class="spec"><img src="@/assets/images/logistics-2.png" alt=""></span>
                        <span>
                            <p v-if='status == 1 && k == 0' class="status">快递收件</p>
                            <p v-else-if='status == 2 && k == 0' class="status">运输中</p>
                            <p v-else-if='status == 3 && k == 0' class="status">派送中</p>
                            <p v-else-if='status == 4 && k == 0' class="status">已签收</p>
                            <p v-else-if='status == 5 && k == 0' class="status">用户拒签</p>
                            <p v-else-if='status == 6 && k == 0' class="status">疑难件</p>
                            <p v-else-if='status == 7 && k == 0' class="status">无效单</p>
                            <p v-else-if='status == 8 && k == 0' class="status">超时单</p>
                            <p v-else-if='status == 9 && k == 0' class="status">签收失败</p>
                            <p v-else-if='status == 10 && k == 0' class="status">退回</p>
                            <p v-else-if='status == 0 && k == 0' class="status">暂无轨迹</p>
                            <p v-else class="status">已发出</p>
                            <p class="special">{{v.context}}</p>
                        </span>
                    </li>
                    <!--<li v-if='progressList.length != 0'>-->
                        <!--<span>05-30 20:15</span>-->
                        <!--<span class="spec"><img src="@/assets/images/logistics-1.png" alt=""></span>-->
                        <!--<span>-->
                            <!--<p class="status">已发货</p>-->
                            <!--<p class="special">包裹正在等待揽件</p>-->
                        <!--</span>-->
                    <!--</li>-->
                    <li class="line"></li>
                </ul>

            </div>
            <div v-if='progressList.length == 0' class="detail-area mar-left40">
                暂无物流信息
            </div>
            <div class="source">
                <img src="@/assets/images/icon_03@2x.png" alt=""> <span>本数据由<span class="blue">{{exName}}</span>提供</span>
            </div>
            <!--<div class="mar-left40">-->
                <!--<div class="info">收货信息： 这是假的</div>-->
                <!--<div class="info">发货信息： 这是假的</div>-->
                <!--<div class="info">退货信息： 这是假的</div>-->
            <!--</div>-->
        </el-card>
    </div>
</template>

<script>
import vBreadcrumb from '@/components/common/Breadcrumb.vue';
import request from '@/http/http';
import moment from 'moment';

export default {
    components: { vBreadcrumb },
    data() {
        return {
            nav: ['订单管理', '订单详情', '物流信息'],
            loading: false,
            orderId: '', // 订单id
            status: '', // 订单状态
            progressList: [], // 物流
            exName: '', // 物流公司名称
            exNo: '' // 物流单号
        };
    },

    filters: {
        formatOrderTime(time) {
            return moment(time).format('MM-DD HH:mm');
        }
    },

    activated() {
        // this.orderId = this.$route.query.findExpressId || sessionStorage.getItem('findExpressId');
        this.getLogisticsInfo();
    },
    methods: {
        getLogisticsInfo() {
            this.loading = true;
            request.findLogisticsDetail({ orderId: 1 }).then(res => {
                this.exName = res.data.showapi_res_body.expTextName;
                this.exNo = res.data.showapi_res_body.mailNo;
                this.progressList = res.data.showapi_res_body.data;
                this.status = res.data.showapi_res_body.status;
                this.loading = false;
            }).catch(err => {
                this.loading = false;
                console.log(err);
            });
        }
    }
};
</script>

<style lang="less" scoped>
    .logistics {
        .area {
            padding: 20px 40px 40px;
        }
        .info {
            font-size: 16px;
            color: #ff4e4e;
            height: 40px;
            line-height: 40px;
        }
        .number {
            font-size: 16px;
            height: 36px;
            line-height: 36px;
            color: #ff6868;
        }
        .blue {
            color: #0186f5;
        }
        .source {
            width: 96%;
            height: 80px;
            line-height: 80px;
            border: solid 1px #eeeeee;
            padding: 0 20px;
            margin-bottom: 20px;
            font-size: 18px;
            color: #222222;
            img{
                vertical-align: middle;
            }
        }
        .detail-area {
            padding: 80px 20px;
            ul{
                position: relative;
                li{
                    list-style: none;
                    height: 100px;
                    line-height: 44px;
                    display: flex;
                    color: #999999;
                    font-size: 14px;

                    .status{
                        font-size: 16px;
                        color: #222222;
                        line-height: 24px;
                    }
                    .special{
                        line-height: 24px;
                    }
                    .spec{
                        margin:0 10px;
                        width: 44px;
                        height: 44px;
                        background: #fff;
                        z-index: 2;
                        text-align: center;
                        img{
                            width:40px;
                            height: 40px;
                            vertical-align: middle;
                        }
                        .circle{
                            width: 10px;
                            height: 10px;
                            border-radius: 50%;
                            background-color: #cccccc;
                            display: inline-block;
                        }
                    }

                }
                .special-li{
                    height: 44px;
                }
                .line{
                    width: 2px;
                    background-color: #dddddd;
                    height: 85%;
                    position: absolute;
                    top:0;
                    left: 106px;
                }
            }

        }
        .mar-left20 {
            margin-left: 20px;
        }
        .mar-left40 {
            margin-left: 40px;
        }
    }
</style>
