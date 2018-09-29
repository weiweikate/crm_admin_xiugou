<template>
  <div class="member-manage">
    <v-breadcrumb :nav='nav'></v-breadcrumb>
    <el-card :body-style="{ padding: '20px 60px' }">
        <el-table border :data="tableData">
            <el-table-column prop="nickName" label="用户名" align="center"></el-table-column>
            <el-table-column prop="bonus" label="贡献度（本次）" align="center">
                <template slot-scope="scope">
                    <template>{{scope.row.preBonus}}</template>
                </template>
            </el-table-column>
            <el-table-column prop="totalBonus" label="贡献度（总体）" align="center">
                <template slot-scope="scope">
                    <template>{{scope.row.totalBonus}}</template>
                </template>
            </el-table-column>
            <el-table-column label="店铺累计所得分红金" align="center">
                <template slot-scope="scope">
                    <template>{{scope.row.dealerTotalBonus}}</template>
                </template>
            </el-table-column>
        </el-table>
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
        this.getList();
    },
    methods: {

        // 获取数据
        getList() {
            const data = {
                storeId: this.shopId
            };
            request.getStoreMembers(data).then((res) => {
                this.tableData = [];
                for (const i in res.data) {
                    const item = res.data[i];
                    if (!item.storeThisTimeBonus) {
                        item.preBonus = '';
                    } else {
                        item.preBonus = Math.floor(item.dealerThisTimeBonus ? item.dealerThisTimeBonus : 0 / item.storeThisTimeBonus);
                    }
                    if (!item.storeTotalBonus) {
                        item.totalBonus = '';
                    } else {
                        item.totalBonus = Math.floor(item.dealerTotalBonus ? item.dealerTotalBonus : 0 / item.storeTotalBonus);
                    }
                }
                this.tableData = res.data;
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
