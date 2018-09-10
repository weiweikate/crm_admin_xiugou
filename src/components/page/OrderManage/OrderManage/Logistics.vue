<template>
    <div class="logistics">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card class="area">
            <div class="info mar-left20">物流公司：{{exName}}</div>
            <div class="number mar-left20">运单号码：{{exNo}}</div>
            <div v-if='progressList.length != 0' class="detail-area mar-left40">
                <ul>
                    <li v-for="(v,k) in progressList" :key="k">
                        <span>{{v.time | formatOrderTime}}</span>
                        <span v-if='k != 0' class="spec"><span class="circle"></span></span>
                        <span v-else class="spec"><img src="@/assets/images/logistics-2.png" alt=""></span>
                        <span>
                            <p v-if='v.status == 1 && k == 0' class="status">快递收件</p>
                            <p v-else-if='v.status == 2' class="status">运输中</p>
                            <p v-else-if='v.status == 3' class="status">已签收</p>
                            <p v-else-if='v.status == 4' class="status">问题件</p>
                            <p v-else-if='v.status == 0' class="status">暂无轨迹</p>
                            <p class="special">{{v.context}}</p>
                        </span>
                    </li>
                    <li v-if='v.status'>
                        <span>05-30 20:15</span>
                        <span class="spec"><img src="@/assets/images/logistics-1.png" alt=""></span>
                        <span>
                            <p class="status">已发货</p>
                            <p class="special">包裹正在等待揽件</p>
                        </span>
                    </li>
                    <li class="line"></li>
                </ul>

            </div>
            <div v-if='progressList.length == 0' class="detail-area mar-left40">
                暂无物流信息
            </div>
            <div class="source">
                <img src="@/assets/images/icon_03@2x.png" alt=""> <span>本数据由<span class="blue">{{exName}}</span>提供</span>
            </div>
            <div class="mar-left40">
                <div class="info">收货信息： 这是假的</div>
                <div class="info">发货信息： 这是假的</div>
                <div class="info">退货信息： 这是假的</div>
            </div>
        </el-card>
    </div>
</template>

<script>
import vBreadcrumb from "@/components/common/Breadcrumb.vue";
import * as api from '@/api/api.js';
import moment from 'moment';

export default {
    components: {vBreadcrumb},
    data() {
        return {
            nav: ["订单管理", "订单详情","物流信息"],
            orderId:'', // 订单id
            progressList:[], // 物流
            exName:'', // 物流公司名称
            exNo:'', // 物流单号
        }
    },

    filters:{
        formatOrderTime(time){
            return moment(time).format('MM-DD HH:mm')
        }
    },

    activated(){
        this.orderId = this.$route.query.findExpressId || sessionStorage.getItem('findExpressId');
        this.getLogisticsInfo();
    },
    methods: {
        getLogisticsInfo(){
            this.$axios.post(api.findExpress,{orderId:this.orderId}).then(res=>{
                this.progressList = res.data.data.showapi_res_body.data;
                this.exName = res.data.data.showapi_res_body.expTextName;
                this.exNo = res.data.data.showapi_res_body.mailNo;
            })
        }
    }
}
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
                    height: 100%;
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
