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
import vBreadcrumb from "@/components/common/Breadcrumb.vue";
import * as api from '@/api/SpellShopManage/index';
import * as pApi from '@/privilegeList/SpellShopManage/index';

export default {
  components: { vBreadcrumb },

  data() {
    return {
      nav: ["拼店店铺管理", "店铺管理", "店铺详情", "成员贡献值"],
      tableData: [],
      page: {
        currentPage: 1,
        totalPage: 0
      },
        shopId:''
    };
  },
    activated() {
        this.shopId =
            this.$route.query.recruitShopId ||
            sessionStorage.getItem("recruitShopId");
        this.groupMoney =
            this.$route.query.groupMoney ||
            sessionStorage.getItem("groupMoney");
        this.getList(this.page.currentPage)
    },
  methods: {

      // 获取数据
      getList(val) {
          let data = {
              page: val,
              id:this.shopId
          };
          this.$axios.post(api.getStoreMembers, data)
              .then((res) => {
                  this.tableData = [];
                  for(let i in res.data.data.data){
                      let item=res.data.data.data[i];
                      if(item.thisTimeBonus){
                          item.preBonus=Math.floor(item.storeBonusDto.thisTimeBonus/this.groupMoney);
                          item.totalBonus=Math.floor(item.storeBonusDto.bonus/item.storeBonusDto.totalBonus)
                      }else{
                          item.preBonus=''
                      }
                  }
                  this.tableData = res.data.data.data;
                  this.page.totalPage = res.data.data.resultCount
              }).catch((err) => {
              console.log(err);
          });
      },
    //分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page.currentPage = val;
      this.submitForm(val);
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
