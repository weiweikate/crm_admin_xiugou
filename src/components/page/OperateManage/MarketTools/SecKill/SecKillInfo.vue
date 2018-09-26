<template>
    <div class="add-secKill">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card :body-style="{ padding: '20px 45px',color:'#666' }">
            <div class="pro-title">新建秒杀</div>
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
                    <span>{{form.productSpec}}</span>
                </el-form-item>
                <el-form-item label="商品原价">
                    <span class="color-red">{{form.productPrice}}</span>
                </el-form-item>
                <el-form-item label="商品库存">
                    <span>--</span>
                </el-form-item>
                <el-form-item label="秒杀价" style="margin-top: 30px">
                    ￥
                    <el-input disabled v-model="form.seckillPrice"></el-input>
                </el-form-item>
                <el-form-item label="开始时间" prop="startTime">
                    <el-date-picker
                        type="datetime"
                        v-model="form.beginTime"
                        placeholder="选择开始时间" disabled>
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间" prop="endTime">
                    <el-date-picker
                        type="datetime"
                        v-model="form.endTime"
                        placeholder="选择结束时间" disabled>
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="设置关闭订单">
                    <el-input class="small" disabled v-model="form.orderCloseTime"></el-input>
                    <span>分钟未付款自动关闭订单</span>
                </el-form-item>
                <el-form-item label="商品发放数量">
                    <el-input class="small" disabled v-model="form.totalNumber"></el-input>
                </el-form-item>
                <el-form-item label="每人限购">
                    <span>{{form.limitNumber}}件(每场)</span><span class="tip">(同一用户只能购买一次)</span>
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
                nav: ['运营管理', '营销工具管理', '秒杀', '秒杀详情'],
                form: {
                },
                productDetail: {}// 选择的商品的商品信息
            };
        },

        activated() {
            this.id = this.$route.query.id || sessionStorage.getItem('id');
            this.getDetail();
        },

        methods: {
            // 返回列表
            backToList() {
                this.$router.push('/secKill');
            },
            // 详情
            getDetail() {
                const data = {
                    activityCode: this.id
                };
                request.findActivitySeckillByActivityCode(data).then(res => {
                    this.form = res.data.data;
                }).catch(err => {
                    this.btnLoading = false;
                });
            }
        }
    };
</script>
<style lang='less'>
    .add-secKill {
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
