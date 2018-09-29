<template>
  <div class="share-bonus-info">
    <v-breadcrumb :nav='nav'></v-breadcrumb>
    <el-card :body-style="{ padding: '20px 60px' }">
        <el-table :data="tableData" border>
          <el-table-column type="index" label="编号" align="center"></el-table-column>
          <el-table-column label="时间" align="center">
              <template slot-scope="scope">
                  <template>{{scope.row.createTime|formatDate}}</template>
              </template>
          </el-table-column>
          <el-table-column prop="totalBonus" label="分红总额" align="center"></el-table-column>
          <el-table-column prop="storeManageBonus" label="店长分红" align="center"></el-table-column>
          <el-table-column prop="storeUserBonus" label="店员分红金" align="center"></el-table-column>
          <el-table-column prop="countUser" label="参与分红人数" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <!--<el-button @click="ShareBonusComposition" type="primary">分红组成</el-button>-->
                <el-button @click="ShareBonusMemberVal" type="warning">成员贡献值</el-button>
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
            nav: ['拼店管理', '店铺管理', '分红详情'],
            tableData: [],
            page: {
                currentPage: 1,
                totalPage: 0
            },
            shopId: '',
            groupMoney: ''
        };
    },
    activated() {
        this.shopId =
            this.$route.query.recruitShopId || sessionStorage.getItem('recruitShopId');
        this.groupMoney =
            this.$route.query.groupMoney || sessionStorage.getItem('groupMoney');
        this.getList(this.page.currentPage);
    },
    methods: {
        // 获取数据
        getList(val) {
            const data = {
                page: val,
                pageSize: this.page.pageSize
            };
            request.getStoreBonusPageList(data).then(res => {
                this.tableData = [];
                this.tableData = res.data.data;
                this.page.totalPage = res.data.totalNum;
            }).catch(error => {
                console.log(error);
            });
        },

        // 分红组成
        ShareBonusComposition(row) {
            this.$router.push({ name: 'shareBonusCom' });
        },
        // 成员贡献值
        ShareBonusMemberVal(row) {
            sessionStorage.setItem('recruitShopId', this.shopId);
            sessionStorage.setItem('groupMoney', this.groupMoney);
            this.$router.push({ name: 'shopMemberManage', query: { 'recruitShopId': this.shopId, 'groupMoney': this.groupMoney }});
        }
    }
};
</script>
<style lang='less' scoped>
.share-bonus-info {
  .block {
    margin: 10px 0px;
  }
}
</style>
