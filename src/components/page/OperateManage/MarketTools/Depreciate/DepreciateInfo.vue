<template>
    <div class="add-depreciate">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card :body-style="{ padding: '20px 45px',color:'#666' }">
            <div class="pro-title">新建降价拍</div>
            <el-form :model="form" ref="form" label-width="100px">
                <el-form-item label="活动编号">
                    <span>{{form.activityCode}}</span>
                </el-form-item>
                <el-form-item label="选择商品">
                    <el-button type="primary" disabled="">+添加商品</el-button>
                </el-form-item>
                <el-form-item label="商品名称">
                    <span>{{form.productName}}</span>
                </el-form-item>
                <el-form-item label="商品规格">
                    <span>{{form.spec}}</span>
                </el-form-item>
                <el-form-item label="商品原价">
                    <span class="color-red">¥{{form.originalPrice}}</span>
                </el-form-item>
                <el-form-item label="商品库存">
                    <span>--</span>
                </el-form-item>
                <el-form-item label="起拍价格" style="margin-top: 30px">
                    ￥
                    <el-input disabled v-model="form.startPrice"></el-input>
                </el-form-item>
                <el-form-item label="最低价格">
                    ￥
                    <el-input v-model="form.floorPrice" disabled></el-input>
                </el-form-item>
                <el-form-item label="开始时间" prop="startTime">
                    <el-date-picker
                        type="datetime"
                        format="yyyy-MM-dd HH:mm"
                        v-model="form.beginTime"
                        placeholder="选择开始时间" disabled>
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="设置关闭订单">
                    <el-input class="small" disabled v-model="form.orderCloseTime"></el-input>
                    <span>分钟未付款自动关闭订单</span>
                </el-form-item>
                <el-form-item label="降价幅度">
                    <span>每</span>
                    <el-input class="small" disabled v-model="form.intervalTime"></el-input>
                    <span>分钟下降</span> <span>￥</span>
                    <el-input class="small" disabled v-model="form.downPrice"></el-input>
                </el-form-item>
                <el-form-item label="持续时间">
                    <el-button type="primary" disabled="">计算持续时间</el-button>
                    <!--<div v-if="showDuration">{{duration}}</div>-->
                </el-form-item>
                <el-form-item label="底价持续时间">
                    <span>降到底价还允许</span>
                    <el-input class="small" disabled v-model="form.floorPriceTime"></el-input>
                    <span>分钟购买时间</span>
                </el-form-item>
                <el-form-item label="结束时间">
                    <span>{{form.endTime|formatDateToMinute}}</span>
                </el-form-item>
                <el-form-item label="降价拍发放数量">
                    <el-input class="small" disabled v-model="form.totalNumber"></el-input>
                </el-form-item>
                <el-form-item label="每人限购">
                    <span>{{form.limitNumber==-1?'不限':form.limitNumber}}件(每场)</span><span class="tip">(同一用户ID视为同一人)</span>
                </el-form-item>
                <el-button @click="backToList" type="primary">返回列表</el-button>
            </el-form>
        </el-card>
    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import icon from '@/components/common/ico';
    import utils from '@/utils/index.js';
    import moment from 'moment';
    import request from '@/http/http.js';

    export default {
        components: {
            vBreadcrumb,
            icon
        },

        data() {
            return {
                nav: ['运营管理', '营销工具管理', '降价拍', '降价拍详情'],
                form: {
                    originPrice: '', // 商品原价
                    minPrice: '', // 最低价格
                    startTime: '', // 开始时间
                    minute: '', // 降价幅度 分钟数
                    price: '', // 降价幅度 金额
                    addTime: ''// 降到底价还允许购买的时间

                },
                productDetail: {}, // 选择的商品的商品信息
                endTime: '', // 结束时间
                durationTime: ''// 持续分钟数
            };
        },

        activated() {
            this.id = this.$route.query.id || sessionStorage.getItem('id');
            this.getDetail();
        },

        methods: {
            // 返回列表
            backToList() {
                this.$router.push('/depreciate');
            },
            // 详情
            getDetail() {
                const data = {
                    id: this.id
                };
                request.operatorfindById(data).then(res => {
                    this.form = res.data;
                }).catch(err => {
                    this.btnLoading = false;
                });
            }
        }
    };
</script>
<style lang='less'>
    .add-depreciate {
        color: #666;
        .pro-title {
            width: 100%;
            height: 60px;
            background-color: #f7f7f7;
            line-height: 60px;
            padding: 0 25px;
            box-sizing: border-box;
            margin-bottom: 20px;
        }
        /deep/ .el-input {
            width: 220px;
        }
        /deep/ .small.el-input {
            width: 140px;
        }
        .tip {
            color: #dddddd;
        }
        .color-red {
            color: #e60012;
        }
    }
</style>
