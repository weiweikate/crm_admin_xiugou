<template>
  <div class="member-manage">
    <v-breadcrumb :nav='nav'></v-breadcrumb>
    <el-card :body-style="{ padding: '20px 60px' }">
        <el-table border :data="tableData">
            <el-table-column prop="nickName" label="用户名" align="center"></el-table-column>
            <el-table-column label="贡献度（本次）" align="center">
                <template slot-scope="scope">
                    <template>{{scope.row.monthContribution||0}}</template>
                </template>
            </el-table-column>
            <el-table-column prop="totalBonus" label="贡献度（总体）" align="center">
                <template slot-scope="scope">
                    <template>{{scope.row.yearContribution||0}}</template>
                </template>
            </el-table-column>
            <el-table-column label="店铺累计所得分红金" align="center">
                <template slot-scope="scope">
                    <template>{{scope.row.dividendBonus||0}}</template>
                </template>
            </el-table-column>
        </el-table>
        <div class="block">
            <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :page-size="page.pageSize"
                :current-page="page.currentPage"
                layout="total, prev, pager, next, jumper"
                :total="page.totalPage">
            </el-pagination>
        </div>
    </el-card>
  </div>
</template>

<script>
import vBreadcrumb from '@/components/common/Breadcrumb.vue';
import * as pApi from '@/privilegeList/SpellShopManage/index';
import request from '@/http/http.js';
import { myMixinTable } from '@/JS/commom';

export default {
    components: { vBreadcrumb },
    mixins: [myMixinTable],

    data() {
        return {
            nav: ['拼店管理', '店铺管理', '店铺详情', '成员贡献值'],
            tableData: [],
            shopId: ''
        };
    },
    activated() {
        this.shopId =
            this.$route.query.recruitShopId ||
            sessionStorage.getItem('recruitShopId');
        this.getList(1);
    },
    methods: {

        // 获取数据
        getList(val) {
            const data = {
                storeCode: this.shopId,
                page: val,
                pageSize: this.page.pageSize
            };
            this.page.currentPage = val;
            request.getStoreMembers(data).then((res) => {
                this.tableData = [];
                if (!res.data) return;
                this.tableData = res.data.data;
                this.page.totalPage = res.data.totalNum;
            }).catch((err) => {
                console.log(err);
            });
        }
    }
};
</script>
<style lang='less' scoped>
.member-manage {
  .block{
      margin: 10px 0;
  }
}
</style>
