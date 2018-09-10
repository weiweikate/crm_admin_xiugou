<template>
  <div class="member-manage">
    <v-breadcrumb :nav='nav'></v-breadcrumb>
    <el-card :body-style="{ padding: '20px 60px' }">
        <el-table border :data="tableData">
            <el-table-column prop="nickname" label="用户名" align="center"></el-table-column>
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
                    <template>{{scope.row.storeBonusDto.totalBonus}}</template>
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
            nav: ['拼店店铺管理', '店铺管理', '店铺详情', '成员贡献值'],
            tableData: [],
            page: {
                currentPage: 1,
                totalPage: 0
            },
            shopId: ''
        };
    },
    activated() {
        this.shopId =
            this.$route.query.recruitShopId ||
            sessionStorage.getItem('recruitShopId');
        this.groupMoney =
            this.$route.query.groupMoney ||
            sessionStorage.getItem('groupMoney');
        this.getList(this.page.currentPage);
    },
    methods: {

        // 获取数据
        getList(val) {
            const data = {
                page: val,
                id: this.shopId
            };
            request.getStoreMembers(data).then((res) => {
                this.tableData = [];
                for (const i in res.data.data.data) {
                    const item = res.data.data.data[i];
                    if (item.thisTimeBonus) {
                        item.preBonus = Math.floor(item.storeBonusDto.thisTimeBonus / this.groupMoney);
                        item.totalBonus = Math.floor(item.storeBonusDto.bonus / item.storeBonusDto.totalBonus);
                    } else {
                        item.preBonus = '';
                    }
                }
                this.tableData = res.data.data.data;
                this.page.totalPage = res.data.data.resultCount;
            }).cache((err) => {
                console.log(err);
            });
        },
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
