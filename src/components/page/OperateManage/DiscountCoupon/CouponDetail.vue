<template>
    <div class="coupon-detail">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card>
            <!--<div class="item">-->
                <!--<div class="main">-->
                    <!--<div class="limit">-->
                        <!--<div class="money">¥{{detail.value}}</div>-->
                        <!--<div class="detail"><p>优惠券</p>-->
                            <!--<p>订单满{{detail.useConditions}}元可用</p></div>-->
                    <!--</div>-->
                    <!--<div class="time">可用周期：领券日 - 次月领券当天失效</div>-->
                <!--</div>-->
                <!--<div class="info">-->
                    <!--<div class="tip">-->
                        <!--<div>优惠券说明：</div>-->
                        <!--<div>优惠券仅限于单商品购物使用，只有满足消费{{detail.useConditions}}元才可使用</div>-->
                    <!--</div>-->
                <!--</div>-->
            <!--</div>-->
            <!-- <el-button type="primary">查看券库存</el-button> -->
            <el-form>
                <el-form-item label="优惠券名称:" class="name-line">
                    {{detail.name}}
                </el-form-item>
                <el-form-item>
                    <div class="limit">
                        <div class="money" v-if="detail.type!=3">¥{{detail.value}}</div>
                        <div class="money" v-else>{{detail.value/10}}折</div>
                        <div class="detail">
                            <p>{{detail.type==1?'满减券':detail.type==2?'抵价券':detail.type==3?'折扣券':'抵扣券'}}</p>
                            <p v-if="detail.type==1||detail.type==3">订单满{{detail.useConditions}}元可用</p>
                        </div>
                    </div>
                   </el-form-item>
                <el-form-item label="可用周期:">
                   <span v-if="detail.cycleFlag==0">领券当天{{detail.effectiveDays}}天内有效</span>
                   <span v-else>领券当天后{{detail.waitDays}}天，开始生效；{{detail.effectiveDays}}天后开始失效；</span>
                </el-form-item>
                <el-form-item label="到期提醒:" v-if="detail.remindFlag==1">
                    到期前{{detail.remindDays}}天提醒一次
                </el-form-item>
                <el-form-item label="可用品类:">
                    <div style="margin-left: 71px">
                        <div class="classify-item" v-if="detail.firstCategoryNames!='全品类'" :title="detail.firstCategoryNames">一级类目：{{detail.firstCategoryNames}}</div>
                        <div class="classify-item" v-else>{{detail.firstCategoryNames}}</div>
                        <div class="classify-item" v-if="detail.secondCategoryNames" :title="detail.secondCategoryNames">二级类目：{{detail.secondCategoryNames}}</div>
                        <div class="classify-item" v-if="detail.thirdCategoryNames" :title="detail.thirdCategoryNames">三级类目：{{detail.thirdCategoryNames}}</div>
                        <div class="classify-item" v-if="detail.productIds" :title="detail.productIds">产品ID：{{detail.productIds}}</div>
                    </div>
                </el-form-item>
                <el-form-item label="可用层级:" class="role-choose">
                    <span v-if="allUser">全部用户</span>
                    <span v-else>{{users}}</span>
                </el-form-item>
                <el-form-item label="发放数量:">
                    <span v-if="detail.totalNumber==-1">不限制</span>
                    <span v-else>{{detail.totalNumber}}张</span>
                </el-form-item>
                <el-form-item label="每人限额:">
                    <span v-if="detail.getLimit==-1">不限制</span>
                    <span v-else>{{detail.getLimit}}张</span>
                </el-form-item>

                <el-form-item label="优惠券说明:">
                    <span class="remark">{{detail.remarks}}</span>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import request from '@/http/http.js';

    export default {
        components: {
            vBreadcrumb
        },
        data() {
            return {
                nav: ['运营管理', '优惠券设置', '优惠券管理', '优惠券详情'],
                id: '',
                detail: {},
                // 用户层级
                allUser: false,
                users: []
            };
        },
        activated() {
            this.id = this.$route.query.couponDetail || sessionStorage.getItem('couponDetail');
            this.getDetail();
        },
        methods: {
            getDetail() {
                const data = {
                    id: this.id
                };
                request.findCouponById(data).then(res => {
                    this.detail = res.data;
                    const userLevelIds = [];
                    for (const i in res.data.userLevel) {
                        userLevelIds.push(res.data.userLevel[i].userLevelId);
                    }
                    this.showLevel(userLevelIds.join(','));
                }).catch(error => {
                    console.log(error);
                });
            },
            // 加载层级
            showLevel(userLevelId) {
                this.users = [];
                request.getUserLevelList({}).then(res => {
                    let count = 0;
                    const arr = userLevelId.split(',');
                    for (const i in res.data) {
                        const name = res.data[i].name;
                        for (const j in arr) {
                            if (arr[j] == res.data[i].id) {
                                count++;
                                this.users.push(name);
                            }
                        }
                    }
                    this.users = this.users.join(',');
                    if (count == res.data.length) this.allUser = true;
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
        /deep/.el-form{
            width: 300px;
            border: 1px solid #eee;
            border-radius: 10px;
            .el-form-item{
                padding-left: 20px;
                margin-bottom: 0;
            }
           .name-line{
               border-bottom: 1px dashed #eee;
               height: 50px;
               line-height: 50px;
           }

            /deep/.name-line .el-form-item__content, .name-line .el-form-item__label{
                line-height: 50px ;
            }
            .limit{
                display: flex;
                height: 60px;
                padding: 10px 10px 0 0 ;
                .money{
                    font-size: 70px;
                    margin-right: 20px;
                    margin-top: 20px;
                }
                margin-bottom: 20px;
                .detail{
                    margin-top: 5px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
            .classify-item{
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }

        }
        .remark{
            word-break: break-all;
            display: block;
            margin-right: 20px;
        }
    }
</style>
