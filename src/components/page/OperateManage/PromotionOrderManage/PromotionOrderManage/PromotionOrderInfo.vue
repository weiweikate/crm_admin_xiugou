<template>
    <div class="promotion-info">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card :body-style="{ padding: '20px 45px',color:'#666' }">
            <el-form label-width="100px">
                <el-form-item label="编号">
                    <span>{{detail.packageId}}</span>
                </el-form-item>
                <el-form-item label="套餐名称">
                    <span>{{detail.packageName}}</span>
                </el-form-item>
                <el-form-item label="推广人">
                    <span>{{detail.nickname}}</span>
                </el-form-item>
                <el-form-item label="开始时间">
                    <span>{{detail.startTime|formatDateAll}}</span>
                </el-form-item>
                <el-form-item label="结束时间">
                    <span>{{detail.endTime|formatDateAll}}</span>
                </el-form-item>
                <el-form-item label="状态">
                    <el-table :data="countArr" border style="width: 500px">
                        <el-table-column prop="" label="红包总数/金额" align="center">
                            <template slot-scope="scope">
                                {{scope.row.count}}/{{scope.row.total}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="" label="已分发数/金额" align="center">
                            <template slot-scope="scope">
                                {{scope.row.sold}}/{{scope.row.sold*scope.row.price}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="" label="剩余数/金额" align="center">
                            <template slot-scope="scope">
                                {{scope.row.remain}}/{{scope.row.remain*scope.row.price}}
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <el-form-item label="成功分享">
                    <el-table :data="shareArr" border>
                        <el-table-column prop="nickname" label="推广人员昵称" align="center"></el-table-column>
                        <el-table-column prop="" label="领取时间" align="center">
                            <template slot-scope="scope">
                                {{scope.row.createTime|formatDateAll}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="level" label="会员层级" align="center"></el-table-column>
                        <el-table-column prop="price" label="获得红包金额(现金)" align="center">
                            <template slot-scope="scope">
                                {{scope.row.price}}元
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="block">
                        <el-pagination
                            background
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="page.currentPage"
                            :page-size="page.pageSize"
                            layout="total, prev, pager, next, jumper"
                            :total="page.totalPage">
                        </el-pagination>
                    </div>
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
    import { myMixinTable } from '@/JS/commom';

    export default {
        components: {
            vBreadcrumb,
            icon
        },
        mixins: [myMixinTable],
        data() {
            return {
                nav: ['运营管理', '营销工具管理', '降价拍', '降价拍详情'],
                detail: {},
                countArr: [],
                shareArr: [],
                id: ''
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
                this.countArr = [];
                this.shareArr = [];
                request.findPromotionPromoterDetailById(data).then(res => {
                    this.detail = res.data;
                    const temp = {
                        count: res.data.count,
                        total: res.data.total,
                        price: res.data.price,
                        sold: res.data.sold,
                        remain: res.data.remain
                    };
                    this.countArr.push(temp);
                }).catch(err => {
                    this.btnLoading = false;
                });
                const param = {
                    page: this.page.currentPage,
                    pageSize: this.page.pageSize,
                    packageId: this.id
                };
                request.queryPromotionReceiveRecordPageList(param).then(res => {
                    this.shareArr = res.data.data;
                    this.page.totalPage = res.data.totalNum;
                }).catch(err => {
                    this.btnLoading = false;
                });
            }
        }
    };
</script>
<style lang='less'>

</style>
