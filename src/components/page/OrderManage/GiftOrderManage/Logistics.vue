<template>
    <div class="logistics">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card class="area">
            <div class="info mar-left20">物流公司：圆通速递</div>
            <div class="number mar-left20">运单号码：784518465465622212</div>
            <div class="detail-area mar-left40">
                <ul>
                    <li>
                        <span>06-01 07:15</span>
                        <span class="spec"><img src="../../../../assets/images/logistics-3.png" alt=""></span>
                        <span>
                            <p class="status">已完成</p>
                            <p class="special">【杭州市】快件已到达 杭州萧山</p>
                        </span>
                    </li>
                    <li>
                        <span>05-31 20:15</span>
                        <span class="spec"><img src="../../../../assets/images/logistics-2.png" alt=""></span>
                        <span>
                            <p class="status">运输中</p>
                            <p class="special">【杭州市】快件已到达 杭州萧山</p>
                        </span>
                    </li>
                    <li>
                        <span>05-30 20:15</span>
                        <span class="spec"><span class="circle"></span></span>
                        <span>
                            <p>【北京市】快件已从北京朝阳发出，准备发往北京市</p>
                        </span>
                    </li>
                    <li class="special-li">
                        <span>05-30 20:15</span>
                        <span class="spec"><img src="../../../../assets/images/logistics-1.png" alt=""></span>
                        <span>
                            <p class="status">已发货</p>
                            <p class="special">包裹正在等待揽件</p>
                        </span>
                    </li>
                    <li class="line"></li>
                </ul>

            </div>
            <div class="source">
                <img src="../../../../assets/images/icon_03@2x.png" alt=""> <span>本数据由<span class="blue">百世汇通</span>提供</span>
            </div>
            <div class="mar-left40">
                <div class="info">收货信息： 浙江省杭州市滨江区 西兴街道 新洲花苑东区3栋2单元，310051，王小明</div>
                <div class="info">发货信息： 浙江省杭州市余杭区 南苑街道 ，311100，王大锤， 13186974854</div>
                <div class="info">退货信息： 浙江省杭州市余杭区 南苑街道 ，311100，王大锤， 13186974854</div>
            </div>
        </el-card>
    </div>
</template>

<script>
    import vBreadcrumb from "@/components/common/Breadcrumb.vue";

    export default {
        components: {vBreadcrumb},
        data() {
            return {
                nav: ["订单管理", "物流详情"],
            }
        },
        methods: {}
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
