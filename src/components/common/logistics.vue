<template>
    <div class="logistics-mask">
        <div class="logistics">
            <div class="mask-title">查看物流信息<i class="el-icon-close" @click="close"></i></div>
            <div class="area">
                <div class="source">
                    <img src="../../assets/images/icon_03@2x.png" alt=""> <span>本数据由<span class="blue">百世汇通</span>提供</span>
                </div>
                <div class="number">圆通速递：784518465465622212</div>
                <div class="detail-area">
                    <ul>
                        <li>
                            <span>06-01 07:15</span>
                            <span class="spec"><img src="../../assets/images/logistics-3.png" alt=""></span>
                            <span>
                            <p class="status">已完成</p>
                            <p class="special">【杭州市】快件已到达 杭州萧山</p>
                        </span>
                        </li>
                        <li>
                            <span>05-31 20:15</span>
                            <span class="spec"><img src="../../assets/images/logistics-2.png" alt=""></span>
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
                            <span class="spec"><img src="../../assets/images/logistics-1.png" alt=""></span>
                            <span>
                            <p class="status">已发货</p>
                            <p class="special">包裹正在等待揽件</p>
                        </span>
                        </li>
                        <li class="line"></li>
                    </ul>

                </div>

                <div>
                    <div class="info">收货信息： 浙江省杭州市滨江区 西兴街道 新洲花苑东区3栋2单元，310051，王小明</div>
                    <div class="info">发货信息： 浙江省杭州市余杭区 南苑街道 ，311100，王大锤， 13186974854</div>
                    <div class="info">退货信息： 浙江省杭州市余杭区 南苑街道 ，311100，王大锤， 13186974854</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import vBreadcrumb from "@/components/common/Breadcrumb.vue";
    import icon from "./ico";
    export default {
        components: {vBreadcrumb,icon},
        data() {
            return {
                nav: ["订单管理", "物流详情"],
            }
        },
        methods: {
            close(){
                this.$emit("msg", false);
            }
        }
    }
</script>

<style lang="less" scoped>
    .logistics-mask {
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
        .logistics {
            width: 710px;
            border-radius: 10px;
            height: 560px;
            background: #fff;
            .mask-title {
                width: 94%;
                height: 60px;
                border-bottom: 1px solid #ccc;
                margin-left: 6%;
                box-sizing: border-box;
                line-height: 60px;
                color: #ff6868;
                font-weight: 700;
                position: relative;
                i{
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    font-size: 20px;
                    color: #dcdcdc;
                    cursor: pointer;
                }
            }
            .area {
                height:500px;
                overflow-y: auto;
                overflow-x: hidden;
                margin-left: 6%;
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
                width: 94%;
                height: 50px;
                line-height: 50px;
                padding: 0 20px 0 0;
                font-size: 18px;
                color: #222222;
                img{
                    vertical-align: middle;
                }
            }
            .detail-area {
                padding: 20px 20px 20px 0;
                ul{
                    position: relative;
                    li{
                        list-style: none;
                        height: 70px;
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
        }
    }

</style>
