<template>
  <div class="product-inventory">
    <v-breadcrumb :nav='nav'></v-breadcrumb>
      <el-card :body-style="{ padding: '20px 45px' }">
        <el-table :data="tableData" border>
            <template v-for='(v,k) in headData'>
                <el-table-column
                    :show-overflow-tooltip="true"
                    :prop="v.value"
                    :label="v.name"
                    :key="k"
                    align="center">
                </el-table-column>
            </template>
          <el-table-column prop="stockUnit"  label="单位" align="center"></el-table-column>
          <el-table-column prop="warehouseStock"  label="云仓同步库存" align="center"></el-table-column>
          <el-table-column label="可售库存" align="center">
              <template slot-scope="scope">
                  <template>{{scope.row.openSale?scope.row.stock:'/'}}</template>
              </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="primary" @click="editInventory(scope.row)">编辑</el-button>
              <el-button type="primary" @click="watchInventory(scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

  </div>
</template>

<script>
import vBreadcrumb from '@/components/common/Breadcrumb.vue';
import request from '@/http/http';
export default {
    components: {
        vBreadcrumb
    },

    data() {
        return {
            nav: ['品牌产品管理', '产品管理', '产品库存管理'],
            productId: '',
            btnLoading: false,
            tableData: [],
            headData: []
        };
    },

    activated() {
        this.productId =
      this.$route.query.productInventoryId ||
      sessionStorage.getItem('productInventory');
        this.getInfo();
    },

    methods: {
    // 获取库存信息
        getInfo() {
            this.tableData = [];
            request.queryProductSpecStockList({ productId: this.productId }).then(res => {
                res.data.forEach((v, k) => {
                    // 1.修改 2.添加
                    if (!v.id) {
                        v.flag = 2;
                    } else {
                        v.flag = 1;
                    }
                    this.tableData.push(v);
                    this.headData = [];
                    if (!v.specType || !v.spec) return;
                    const specs = v.specType.split('-');
                    const specValues = v.spec.split('-');
                    specs.forEach((v1, k1) => {
                        const temp = {
                            value: v1,
                            name: v1
                        };
                        this.headData.push(temp);
                        this.tableData[k][v1] = specValues[k1];
                    });
                });
            }).catch(err => {
                console.log(err);
            });
        },
        // 编辑库存
        editInventory(row) {
            sessionStorage.setItem('editInventoryId', row.priceId);
            this.$router.push({ path: '/editInventory', query: { editInventoryId: row.priceId }});
        },
        // 查看库存
        watchInventory(row) {
            sessionStorage.setItem('inventoryInfoId', row.priceId);
            this.$router.push({ path: '/inventoryInfo', query: { inventoryInfoId: row.priceId }});
        }
    }
};
</script>
<style lang='less'>
.product-inventory {
  .el-input__suffix {
    right: 13px;
  }
}
</style>
