<template>
    <div class="card-mange">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card>
            <el-form :model="form" :rules="rules" ref="form" label-width="120px">
                <el-form-item prop="name" label="活动名称:">
                    <span>{{form.name}}</span>
                </el-form-item>
                <el-form-item prop="prize" label="刮刮卡奖品:">
                    <el-table :data="tableData" border stripe class="mt10">
                        <el-table-column type="index" label="编号" align="center"></el-table-column>
                        <el-table-column prop="name" label="奖品名称" align="center"></el-table-column>
                        <el-table-column prop="num" label="赠送值" align="center">
                            <template slot-scope="scope">
                                {{scope.row.type == 1?'/':scope.row.num}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="type" label="类型" align="center">
                            <template slot-scope="scope">
                                {{scope.row.type == 1?'优惠券':'秀豆'}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="prizeNum" label="奖品发放数" align="center">
                            <template slot-scope="scope">
                                <template :disabled="status == 2">{{cope.row.prizeNum}}</template>
                            </template>
                        </el-table-column>
                        <el-table-column v-if="status == 2" prop="id" label="剩余数量" align="center"></el-table-column>
                        <el-table-column prop="stock" label="库存数量" align="center">
                            <template slot-scope="scope">
                                {{scope.row.stock == -1?'不限量':scope.row.stock}}
                            </template>
                        </el-table-column>
                        <el-table-column v-if="status == 2" prop="addNum" label="增加发放数" align="center">
                            <template slot-scope="scope">
                                <template>{{scope.row.addNum}}</template>
                            </template>
                        </el-table-column>
                        <el-table-column prop="ratio" label="中奖概率" align="center">
                            <template slot-scope="scope">
                                <template>{{scope.row.ratio}}</template>
                            </template>
                        </el-table-column>
                        <el-table-column label="状态" align="center">
                            <template slot-scope="scope">
                                <template v-if="scope.row.status==1">正常</template>
                                <template v-if="scope.row.status==2">已停用</template>
                            </template>
                        </el-table-column>
                    </el-table>
                    <p>总中奖概率：{{totalRatio}}</p>
                </el-form-item>
                <el-form-item prop="tip" label="总中奖概率:">
                    <span>{{form.tip}}</span>
                </el-form-item>
                <el-form-item prop="tip" label="未中奖提示语:">
                    <span>{{form.tip}}</span>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="back">返回列表</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import request from '@/http/http';
    export default {
        components: { vBreadcrumb },
        data() {
            return {
                nav: ['运营管理', '营销工具管理', '刮刮卡', '详情'],
                id: '',
                url: '',
                form: {
                    name: '',
                    prize: '',
                    tip: ''
                },
                tableData: [],
            };
        },
        activated() {
            this.id = this.$route.query.cardInfoId || sessionStorage.getItem('cardInfoId');
            this.getDetail();
        },
        methods: {
            getDetail() {
                const data = {
                    id: this.id
                };
                request.findScratchCardById(data).then(res => {
                    this.form = res.data;
                }).catch(err => {
                    console.log(err);
                });
            },
            back() {
                this.$router.push('/scratchCardsList');
            }
        }
    };
</script>

<style lang="less" scoped>
.card-mange{
    /deep/.el-dialog {
        border-radius: 10px;
        overflow: auto;
        .el-dialog__header {
            border-bottom: 1px solid #eee;
            padding: 20px 20px 10px 50px;
            .el-dialog__title {
                color: #ff6868;
            }
        }
    }
    .inp{
        width: 210px;
    }
    .selected-coupon{
        display: block;
        float: left;
        width: 300px;
        height: 30px;
        line-height: 30px;
        border: 1px solid #ccc;
        padding-left: 10px;
        border-radius: 10px;
        margin-right: 10px;
        cursor: pointer;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }
    .active-selected{
        background-color: #33b4ff;
        color: #fff;
        border: 1px solid skyblue;
    }
}
</style>
