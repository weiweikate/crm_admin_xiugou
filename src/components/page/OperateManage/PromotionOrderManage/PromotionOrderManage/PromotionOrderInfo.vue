<template>
    <div class="add-depreciate">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card :body-style="{ padding: '20px 45px',color:'#666' }">
            <div class="pro-title">新建降价拍</div>
            <el-form :model="form" ref="form" label-width="100px">
                <el-form-item label="编号">
                    <span>{{form.activityCode}}</span>
                </el-form-item>
                <el-form-item label="套餐名称">
                    <span>{{form.activityCode}}</span>
                </el-form-item>
                <el-form-item label="推广人">
                    <span>{{form.productName}}</span>
                </el-form-item>
                <el-form-item label="开始时间">
                    <span>{{form.startTime|formatDateAll}}</span>
                </el-form-item>
                <el-form-item label="结束时间">
                    <span>{{form.endTime|formatDateAll}}</span>
                </el-form-item>
                <el-form-item label="状态">

                </el-form-item>
                <el-form-item label="成功分享">
                    <el-table>
                        <el-table-column prop="" label="推广人员昵称"></el-table-column>
                        <el-table-column prop="" label="领取时间">
                            <template slot-scope="scope">
                                {{scope.row.time|formatDateAll}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="" label="会员层级"></el-table-column>
                        <el-table-column prop="" label="获得红包金额(现金)">
                            <template slot-scope="scope">
                                {{scope.row.price}}元
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>


                <el-button @click="backToList" type="primary">返回列表</el-button>
            </el-form>
        </el-card>
    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import icon from '@/components/common/ico';
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
            this.id = this.$route.query.promotionOrderId || sessionStorage.getItem('promotionOrderId');
            this.getDetail();
        },

        methods: {
            // 返回列表
            backToList() {
                this.$router.push('/promotionOrderList');
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
