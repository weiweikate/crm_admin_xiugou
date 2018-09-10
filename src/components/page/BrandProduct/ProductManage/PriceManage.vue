<template>
  <div>
    <v-breadcrumb :nav='nav'></v-breadcrumb>
      <el-card :body-style="{ padding: '20px 45px' }">
        <el-table :data="tableData" border>
          <el-table-column prop="spec" label="规格" align="center"></el-table-column>
          <el-table-column label="结算价" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.settlement_price"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="原价" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.original_price"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="V1价" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.v1"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="V2价" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.v2"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="V3价" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.v3"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="V4价" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.v4"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="最低支付价" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.min_payment"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="拼店价" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.group_price"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button :loading="btnLoading" :type="scope.row.btnStyle" @click="saveMsg(scope.row)">保存</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      
  </div>
</template>

<script>
import vBreadcrumb from "@/components/common/Breadcrumb.vue";
import * as api from "@/api/BrandProduct/ProductMange/index.js";
import * as pApi from "@/privilegeList/BrandProduct/ProductMange/index.js";
export default {
  components: {
    vBreadcrumb
  },

  data() {
    return {
      nav:['品牌产品管理','产品管理','价格管理'],
      btnLoading:false,
      productId:'',
      tableData: []
    };
  },

  activated(){
    this.productId = this.$route.query.priceManageId || sessionStorage.getItem('priceManage');
    this.getProductInfo();
  },

  methods: {
    // 获取产品信息
    getProductInfo(){
      this.tableData = [];
      this.$axios.post(api.queryProductPriceSaleSpecList,{productId:this.productId,url:pApi.queryProductPriceSaleSpecList})
      .then((res) => {
        res.data.data.forEach((v,k)=>{
          v.btnStyle = 'primary';
          this.tableData.push(v)
        })
      }).catch((err) => {
          console.log(err)
      });
    },
    // 保存表单信息
    saveMsg(row){
      row.original_price = Number(row.original_price || 0);
      row.v1 = Number(row.v1 || 0);
      row.v2 = Number(row.v2 || 0);
      row.v3 = Number(row.v3 || 0);
      row.v4 = Number(row.v4 || 0);
      row.group_price = Number(row.group_price || 0);
      row.min_payment = Number(row.min_payment || 0);
      row.settlement_price = Number(row.settlement_price || 0);
      if(!(row.original_price>=row.v1 && row.v1>=row.v2 && row.v2>=row.v3 && row.v3>=row.v4 && row.v4>row.group_price && row.min_payment<=row.v4)){
        this.$message.warning('参数填写有误,请输入正确的参数');
        return;
      }
      this.btnLoading = true;
      let data = {};
      data.id = row.id;
      data.settlement_price = row.settlement_price;
      data.original_price = row.original_price;
      data.v1 = row.v1;
      data.v2 = row.v2;
      data.v3 = row.v3;
      data.v4 = row.v4;
      data.min_payment = row.min_payment;
      data.group_price = row.group_price;
      data.url = pApi.queryProductPriceSaleSpecList;
      data.productId = this.productId;
      this.$axios.post(api.updateProductPrice,data)
      .then((res) => {
          this.$message.success(res.data.msg);
          this.btnLoading = false;
          row.btnStyle = 'success';
      }).catch((err) => {
        console.log(err)
        this.btnLoading = false;
      });
    }
  }
};
</script>
<style lang='less' scoped>
</style>