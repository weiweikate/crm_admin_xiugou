<template>
    <div class="tab-content">
        <el-table v-loading="tableLoading" border :data="tableData">
            <el-table-column prop="id" label="ID" align="center" width="50"></el-table-column>
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
            <el-table-column prop="userLevelIds" label="可使用用户" align="center"></el-table-column>
            <el-table-column label="领取人/次" align="center">
                <template slot-scope="scope">
                    {{scope.row.receiverNum?scope.row.receiverNum:'0'}}/{{scope.row.receiveNum?scope.row.receiveNum:'0'}}
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
                    <template v-if='scope.row.cycleFlag == 0'>否</template>
                    <template v-else-if='scope.row.status == 1'>是</template>
                </template>
            </el-table-column>
            <el-table-column prop="" label="状态" align="center">
                <template slot-scope="scope">
                    <template v-if='scope.row.status == 1'>未开始</template>
                    <template v-if='scope.row.status == 2'>进行中</template>
                    <template v-else-if='scope.row.status == 0'>已结束</template>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                        <template>
                            <div style="float: left">
                                <el-button @click="editCoupon(scope.row)" type="primary" v-auth="'yunying.discountCoupon.bj'">编辑</el-button>
                                <br>
                                <el-button @click="loseDiscountCoupon(scope.row)" v-if="scope.row.status!=0" type="danger" v-auth="'yunying.discountCoupon.sx'">失效</el-button>
                            </div>
                            <div style="float: left">
                                <div class="blue" @click="couponData(scope.row)" v-auth="'yunying.discountCoupon.qsj'">券数据
                                </div>
                                <div class="blue" @click="couponDetail(scope.row)" v-auth="'yunying.discountCoupon.ckxq'">查看详情
                                </div>
                                <div class="blue"  v-if="scope.row.status!=0&&scope.row.totalNumber!=-1" @click="addInventory(scope.row)" v-auth="'yunying.discountCoupon.zjqkc'">增加券库存
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
                :page-size="page.pageSize"
                layout="total, prev, pager, next, jumper"
                :total="page.totalPage">
            </el-pagination>
        </div>
        <div class="mask" v-if="addMask">
            <div class="content">
                <div class="item"><span>剩余库存：</span>{{left}}份</div>
                <div class="item"><span>券值：</span>{{value}}</div>
                <div class="item"><span>追加数量：</span><el-input v-model="num"></el-input></div>
                <div style="text-align: center;margin-top: 30px">
                    <el-button type="primary" btnLoading="false" @click="addRepertory">确定</el-button>
                    <el-button @click="addMask=false">取消</el-button>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
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
            num: '', // 库存
            id: '', // 优惠券id
            btnLoading: false
        };
    },
    created() {
    },
    activated() {
        this.getList(this.page.currentPage);
    },

    mounted() {
        const n = this.name;
        if (n === 'allCoupon') {
            this.status = '';
        } else if (n === 'notStart') {
            this.status = '1';
        } else if (n === 'start') {
            this.status = '2';
        } else if (n === 'ended') {
            this.status = '0';
        }
        this.getList(this.page.currentPage);
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
                if (!res.data) return;
                this.tableData = [];
                for (const i in res.data.data) {
                    if (res.data.data[i].couponUserLevelList) {
                        const userLevelIds = [];
                        for (const j in res.data.data[i].couponUserLevelList) {
                            userLevelIds.push('V' + res.data.data[i].couponUserLevelList[j].level);
                        }
                        res.data.data[i].userLevelIds = userLevelIds.join(',');
                    }
                    // this.tableData.push(res.data.data[i])
                }
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
            sessionStorage.setItem('couponDataId', row.id);
            this.$router.push({
                name: 'couponData',
                query: { couponDataId: row.id }
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
            this.num = '';
            this.left = row.totalNumber;
            this.id = row.id;
            if (row.type === 3) {
                this.value = row.value / 10 + '折';
            } else {
                this.value = row.value + '元';
            }
        },
        addRepertory() {
            const data = {
                id: this.id,
                num: this.num
            };
            if (!this.num) {
                this.$message.warning('请输入库存!');
                return;
            }
            this.btnLoading = true;
            request.addCouponStock(data).then(res => {
                this.$message.success(res.msg);
                this.addMask = false;
                this.getList(this.page.currentPage);
                this.btnLoading = false;
            }).catch(error => {
                console.log(error);
                this.btnLoading = false;
            });
        },
        // 失效
        loseDiscountCoupon(row) {
            const data = {
                id: row.id
            };
            request.deleteCouponById(data).then(res => {
                this.$message.success(res.msg);
                this.getList(this.page.currentPage);
            }).catch(error => {
                console.log(error);
                this.tableLoading = false;
            });
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
