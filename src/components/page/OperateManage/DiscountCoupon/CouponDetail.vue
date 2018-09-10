<template>
    <div class="coupon-detail">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card>
            <div class="item">
                <div class="main">
                    <div class="limit">
                        <div class="money">¥{{detail.value}}</div>
                        <div class="detail"><p>优惠券</p>
                            <p>订单满{{detail.useConditions}}元可用</p></div>
                    </div>
                    <div class="time">可用周期：领券日 - 次月领券当天失效</div>
                </div>
                <div class="info">
                    <div class="tip">
                        <div>优惠券说明：</div>
                        <div>优惠券仅限于但商品购物使用，只有满足消费{{detail.useConditions}}元才可使用</div>
                    </div>
                </div>
            </div>
            <!-- <el-button type="primary">查看券库存</el-button> -->
        </el-card>
    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import * as pApi from '@/privilegeList/OperateManage/DiscountCoupon/index.js';
    import utils from '@/utils/index.js';
    import moment from 'moment';
    import request from '@/http/http.js';

    export default {
        components: {
            vBreadcrumb
        },
        data() {
            return {
                nav: ['运营管理', '优惠券设置', '优惠券管理', '优惠券详情'],
                id: '',
                detail: {}
            };
        },
        activated() {
            this.id = this.$route.query.couponDetail || sessionStorage.getItem('couponDetail');
            this.getDetail();
        },
        methods: {
            getDetail() {
                const data = {
                    id: this.id,
                    url: pApi.getDiscountCouponPageById
                };
                request.getDiscountCouponPageById(data).then(res => {
                    this.detail = res.data.data;
                }).catch(error => {
                    console.log(error);
                });
            }

        }
    };
</script>

<style lang="less" scoped>
    .coupon-detail {
        .item {
            width: 445px;
            height: 250px;
            background-color: #ff6868;
            border-radius: 10px;
            color: #fff;
            margin-bottom: 30px;
            .main{
                .limit{
                    display: flex;
                    padding: 20px;
                    height: 60px;
                    .money{
                        font-size: 80px;
                        margin-right: 20px;
                    }
                    margin-bottom: 20px;
                    .detail{
                        margin-top: 32px;
                    }
                }
                .time{
                    margin:0 20px 20px;
                }
            }
            .info{
                border-top:1px dashed #fff;
                .tip{
                    margin: 20px 20px;
                    font-size: 14px;
                    div:first-child{
                        font-size: 16px;
                        margin-bottom: 5px;
                    }
                }
            }

        }
    }
</style>
