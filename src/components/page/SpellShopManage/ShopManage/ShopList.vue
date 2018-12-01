<template>
    <div class="shop-list">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card :body-style="{ padding: '20px 40px' }">
            <el-form :model="form" ref="form" inline label-width="100px">
                <el-form-item prop="name" label="店铺名称">
                    <el-input v-model="form.name" placeholder="请输入店铺名称"></el-input>
                </el-form-item>
                <el-form-item prop="showNumber" label="店铺ID">
                    <el-input v-model="form.showNumber" placeholder="请输入店铺ID"></el-input>
                </el-form-item>
                <el-form-item prop="bonusCount" label="分红次数">
                    <el-input v-model="form.bonusCount" placeholder="请输入分红次数"></el-input>
                </el-form-item>
                <el-form-item prop="storeStarId" label="店铺等级">
                    <el-select v-model="form.storeStarId" placeholder="请选择店铺等级">
                        <el-option value="">全部</el-option>
                        <el-option
                            v-for="item in shopLevelArr"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="date" label="创建时间">
                    <el-date-picker
                        v-model="form.date"
                        type="datetimerange"
                        format="yyyy-MM-dd"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item prop="minTradeMoney" label="交易额">
                    <el-input v-model="form.minTradeMoney" placeholder="请输入交易额"></el-input>
                </el-form-item>
                <el-form-item prop="maxTradeMoney" label="-" label-width="17px">
                    <el-input v-model="form.maxTradeMoney" placeholder="请输入交易额"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" @click="getList(1)">搜索</el-button>
                    <el-button @click="resetForm('form')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card :body-style="{ padding: '20px 40px' }" style='margin-top:20px'>
            <el-table :data="tableData" border>
                <el-table-column type="index" label="编号" align="center"></el-table-column>
                <el-table-column prop="name" label="店铺名称" align="center"></el-table-column>
                <el-table-column prop="showNumber" label="店铺ID" align="center"></el-table-column>
                <el-table-column prop="starName" label="店铺等级" align="center"></el-table-column>
                <el-table-column prop="storeUserName" label="店长" align="center"></el-table-column>
                <el-table-column label="成员数" align="center">
                    <template slot-scope="scope">
                        <template><span @click="toUserList(scope.row)" class="color-blue">{{scope.row.storeUserNum||0}}</span></template>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" align="center">
                    <template slot-scope="scope">
                        <template>{{scope.row.createTime|formatDateAll}}</template>
                    </template>
                </el-table-column>
                <el-table-column prop="totalTradeBalance" label="交易总额" align="center">
                    <template slot-scope="scope">
                        <template>{{scope.row.totalTradeBalance||0}}</template>
                    </template>
                </el-table-column>
                <el-table-column prop="bonusCount" label="分红次数" align="center">
                    <template slot-scope="scope">
                        <template>{{scope.row.bonusCount||0}}</template>
                    </template>
                </el-table-column>
                <el-table-column prop="tradeBalance" label="现交易额" align="center">
                    <template slot-scope="scope">
                        <template>{{scope.row.tradeBalance||0}}</template>
                    </template>
                </el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        <template v-if="scope.row.status==0">关闭</template>
                        <template v-if="scope.row.status==1">正常</template>
                        <template v-if="scope.row.status==2">已缴纳保证金</template>
                        <template v-if="scope.row.status==3">招募中</template>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button @click="showInfo(scope.row)" type="primary" v-auth="'pindian.shopList.ckxq'">查看详情</el-button>
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
        </el-card>

    </div>
</template>

<script>
import vBreadcrumb from '@/components/common/Breadcrumb.vue';
import moment from 'moment';
import * as pApi from '@/privilegeList/SpellShopManage/index';
import utils from '@/utils/index.js';
import { myMixinTable } from '@/JS/commom';
import request from '@/http/http.js';

export default {
    components: { vBreadcrumb },

    mixins: [myMixinTable],

    data() {
        return {
            nav: ['拼店管理', '店铺管理'],
            shopLevelArr: [],
            tableData: [],
            form: {}
        };
    },
    activated() {
        this.getList(this.page.currentPage);
        this.getAllStoreStar();
    },
    methods: {
        // 获取店铺等级
        getAllStoreStar() {
            request
                .getAllStoreStar({})
                .then(res => {
                    this.shopLevelArr = [];
                    this.shopLevelArr = res.data;
                })
                .catch(error => {
                    console.log(error);
                });
        },
        // 获取数据
        getList(val) {
            const data = {
                name: this.form.name,
                bonusCount: this.form.bonusCount,
                showNumber: this.form.showNumber,
                storeStarId: this.form.storeStarId,
                maxMoney: this.form.maxTradeMoney,
                minMoney: this.form.minTradeMoney,
                startTime: this.form.date
                    ? moment(this.form.date[0]).format('YYYY-MM-DD 00:00:00')
                    : '',
                endTime: this.form.date
                    ? moment(this.form.date[1]).format('YYYY-MM-DD 00:00:00')
                    : '',
                page: val,
                size: this.page.pageSize
            };
            this.page.currentPage = val;
            request
                .getStoreList(data)
                .then(res => {
                    this.tableData = [];
                    if (!res.data) return;
                    this.tableData = res.data.data;
                    this.page.totalPage = res.data.totalNum;
                })
                .catch(error => {
                    console.log(error);
                });
        },
        // 查看店铺详情
        showInfo(row) {
            sessionStorage.setItem('shopInfoId', row.id);
            this.$router.push({
                name: 'shopInfo',
                query: { shopInfoId: row.id}
            });
        },
        // 重置表单
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.form.date = '';
            this.getList(this.page.currentPage);
        },
        // 跳到成员列表
        toUserList(row) {
            sessionStorage.setItem('recruitShopId', row.id);
            this.$router.push({
                name: 'shopMemberManage',
                query: { recruitShopId: row.id }
            });
        }
    }
};
</script>
<style lang='less' scoped>
.shop-list {
    .block {
        margin: 10px 0;
    }
    .color-blue {
        color: #33b4ff;
        cursor: pointer;
    }
}
</style>
