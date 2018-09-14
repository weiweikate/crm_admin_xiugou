<template>
    <div class="tab-content">
        <el-table v-loading="tableLoading" border :data="tableData">
            <el-table-column type="index" label="编号" align="center" width="50"></el-table-column>
            <el-table-column prop="name" label="券名称" align="center"></el-table-column>
            <el-table-column label="券类型" align="center">
                <template slot-scope="scope">
                   <template v-if="scope.row.type==1">满减</template>
                   <template v-if="scope.row.type==2">抵价</template>
                   <template v-if="scope.row.type==3">折扣</template>
                   <template v-if="scope.row.type==4">抵扣</template>
                </template>
            </el-table-column>
            <el-table-column label="券值" align="center">
                <template slot-scope="scope">
                    <template v-if="scope.row.type==3">{{Number(scope.row.value)/10}}折</template>
                    <template v-else>{{scope.row.value}}元</template>
                </template>
            </el-table-column>
            <el-table-column label="限制" align="center">
                <template slot-scope="scope">
                    <template v-if="scope.row.type==3||scope.row.type==1">满{{scope.row.useConditions}}</template>
                </template>
            </el-table-column>
            <el-table-column label="可用周期" align="center">
                <template slot-scope="scope">/</template>
            </el-table-column>
            <el-table-column prop="dealerLevelIds" label="可使用用户" align="center"></el-table-column>
            <el-table-column label="领取人/次" align="center">
                <template slot-scope="scope">
                    {{scope.row.hadReceivePerson}}/{{scope.row.hadReceiveCount}}
                </template>
            </el-table-column>
            <el-table-column label="优惠券库存" align="center">
                <template slot-scope="scope">
                    <template v-if='scope.row.totalNumber == -1'>无限制</template>
                    <template v-else>{{scope.row.totalNumber}}</template>
                </template>
            </el-table-column>
            <el-table-column prop="hasUsed" label="已使用" align="center"></el-table-column>
            <el-table-column prop="" label="是否礼包周期券" align="center">
                <template slot-scope="scope">
                    <template v-if='scope.row.hadPeriod == 0'>否</template>
                    <template v-else-if='scope.row.status == 1'>是</template>
                </template>
            </el-table-column>
            <el-table-column prop="" label="状态" align="center">
                <template slot-scope="scope">
                    <template v-if='scope.row.status == 1'>进行中</template>
                    <template v-else-if='scope.row.status == 0'>已结束</template>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                        <template>
                            <div style="float: left">
                                <el-button @click="editCoupon(scope.row)" type="primary">编辑</el-button>
                                <br>
                                <el-button @click="loseDiscountCoupon(scope.row)" v-if="scope.row.status==1" type="danger">失效</el-button>
                            </div>
                            <div style="float: left">
                                <div class="blue" @click="couponData(scope.row)">券数据
                                </div>
                                <div class="blue" @click="couponDetail(scope.row)">查看详情
                                </div>
                                <div class="blue"  v-if="scope.row.status==1&&scope.row.totalNumber != -1" @click="addInventory(scope.row)">增加券库存
                                </div>
                            </div>
                            <div style="clear: both"></div>
                        </template>
                </template>
            </el-table-column>
        </el-table>
        <div class="block">
            <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page.currentPage"
                layout="total, prev, pager, next, jumper"
                :total="page.totalPage">
            </el-pagination>
        </div>
        <div class="mask" v-if="addMask">
            <div class="content">
                <div class="item"><span>剩余库存：</span>{{left}}份</div>
                <div class="item"><span>券值：</span>{{value}}</div>
                <div class="item"><span>追加数量：</span><el-input v-model="repertoryNumber"></el-input></div>
                <div style="text-align: center;margin-top: 30px">
                    <el-button type="primary" @click="addRepertory">确定</el-button>
                    <el-button @click="addMask=false">取消</el-button>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import utils from '@/utils/index.js';
import { myMixinTable } from '@/JS/commom';
import request from '@/http/http.js';

export default {
    props: ['name'],
    components: {},
    mixins: [myMixinTable],

    data() {
        return {

            status: '',
            tableData: [],
            tableLoading: false,
            // 新增库存对应参数
            addMask: false,
            left: '', // 剩余数量
            value: '', // 券值
            repertoryNumber: '', // 库存
            id: ''// 优惠券id
        };
    },

    activated() {
        this.getList(1);
    },

    mounted() {
        const n = this.name;
        if (n == 'allCoupon') {
            this.status = '';
        } else if (n == 'notStart') {
            this.status = '5';
        } else if (n == 'start') {
            this.status = '1';
        } else if (n == 'ended') {
            this.status = '0';
        }
        this.getList(1);
    },
    methods: {
        //  提交表单
        getList(val) {
            const data = {
                page: val,
                status: this.status,
                pageSize: this.page.pageSize
            };
            data.page = val;
            data.status = this.status;
            this.page.currentPage = val;
            this.tableLoading = true;
            request.queryCouponList(data).then(res => {
                if (!res.data.data) return;
                this.tableData = [];
                this.tableData = res.data.data;
                this.page.totalPage = res.data.totalNum;
                this.tableLoading = false;
            }).catch(error => {
                console.log(error);
                this.tableLoading = false;
            });
        },

        // 编辑优惠券
        editCoupon(row) {
            sessionStorage.setItem('couponId', row.id);
            this.$router.push({
                name: 'editCoupon',
                query: { couponId: row.id }
            });
        },
        // 券数据
        couponData(row) {
            let status;
            if (row.type === 3) { // 折扣
                status = 0;
            } else {
                status = 1;
            }
            const left = row.totalNumber - row.hadUseNumber;// 剩余数量
            const params = {
                id: row.id,
                left: left,
                status: status
            };
            sessionStorage.setItem('couponData', JSON.stringify(params));
            this.$router.push({
                name: 'couponData',
                query: { id: row.id, left: left, status: status }
            });
        },
        // 券详情
        couponDetail(row) {
            sessionStorage.setItem('couponDetail', row.id);
            this.$router.push({
                name: 'couponDetail',
                query: { couponDetail: row.id }
            });
        },
        // 添加券库存
        addInventory(row) {
            this.addMask = true;
            this.left = row.totalNumber - row.hadUseNumber;
            this.id = row.id;
            if (row.type === 4) {
                this.value = row.value + '折';
            } else {
                this.value = row.value + '元';
            }
        },
        addRepertory() {
            const data = {
                id: this.id,
                repertoryNumber: this.repertoryNumber
            };
            if (!this.repertoryNumber) {
                this.$message.warning('请输入库存!');
                return;
            }
            request.addRepertory(data).then(res => {
                this.addMask = false;
                this.getList(1);
            }).catch(error => {
                console.log(error);
                this.tableLoading = false;
            });
        },
        // 失效
        loseDiscountCoupon(row) {
            const data = {
                id: row.id
            };
            request.loseDiscountCoupon(data).then(res => {
                this.getList(1);
            }).catch(error => {
                console.log(error);
                this.tableLoading = false;
            });
        }
    },
    filters: {
        formatPrice(val) {
            return `￥${val}`;
        }
    }
};
</script>
<style lang='less'>
    .tab-content {
        .search-pane {
            width: 100%;
            padding: 30px 0 0 0;
            margin-bottom: 20px;
            background-color: #f7f7f7;
            box-sizing: border-box;
        }
        .el-input-group__append,
        .el-input-group__prepend {
            padding: 0 4px;
        }
        .operate {
            button {
                margin-right: 10px;
                margin-top: 5px;
            }
            button:nth-child(3) {
                margin-right: 0px;
            }
        }
        .operate-table {
            margin-top: 10px;
        }
        .el-button + .el-button {
            margin-left: 0px;
        }
        .block {
            float: right;
            margin-top: 10px;
        }
        .product-img {
            display: inline-block;
            float: left;
            width: 80px;
            height: 80px;
            border: 1px solid #ddd;
            overflow: hidden;
            img {
                width: 60px;
                height: 60px;
                margin: 10px;
            }
        }
        .product-name {
            float: left;
            width: 75%;
            height: auto;
            margin: 5px 0 0 20px;
        }
        .product-id {
            float: left;
            width: 75%;
            height: auto;
            margin: 20px 0 0 20px;
        }
        .mask{
            width: 100%;
            height:100%;
            background: rgba(0,0,0,.3);
            position: fixed;
            top:0;
            left: 0;
            z-index: 2;
            .content{
                margin: 300px auto;
                background: #fff;
                padding:30px;
                width: 400px;
                border-radius: 10px;
                .item{
                    line-height: 40px;
                    span{
                        width: 80px;
                        display: inline-block;
                        margin-left: 50px;
                    }
                    .el-input{
                        width: 210px;
                    }
                }
                .el-button:first-child{
                    margin-right: 30px;
                }
            }
        }
        .blue{
            color: #33b4ff;
            cursor: pointer;
        }
    }
</style>
