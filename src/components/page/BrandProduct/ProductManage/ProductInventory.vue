<template>
  <div class="product-inventory">
    <v-breadcrumb :nav='nav'></v-breadcrumb>
      <el-card :body-style="{ padding: '20px 45px' }">
        <el-table :data="tableData" border>
          <el-table-column prop="spec" label="规格" align="center"></el-table-column>
          <el-table-column  label="总库存" align="center" :render-header="renderHeader">
            <template slot-scope="scope">
              <el-input style="width:150px" @change="changeBtnStyle(scope.row)" v-model="scope.row.stock"></el-input>
              <span>{{unitName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button :loading="btnLoading" :type="scope.row.btnStyle" @click="saveMsg(scope.row)">保存</el-button>
            </template>
          </el-table-column>
          <!--<el-table-column  label="单位" align="center" :render-header="renderHeader">-->
            <!--<template slot-scope="scope">-->
              <!--<span>{{unitName}}</span>-->
            <!--</template>-->
          <!--</el-table-column>-->
          <!--<el-table-column prop=""  label="云仓同步库存" align="center"></el-table-column>-->
          <!--<el-table-column prop=""  label="可售库存" align="center"></el-table-column>-->
          <!--<el-table-column label="操作" align="center">-->
            <!--<template slot-scope="scope">-->
              <!--<el-button type="primary" @click="editInventory(scope.row)">编辑</el-button>-->
              <!--<el-button type="primary" @click="watchInventory(scope.row)">查看</el-button>-->
            <!--</template>-->
          <!--</el-table-column>-->
        </el-table>
      </el-card>

  </div>
</template>

<script>
import vBreadcrumb from '@/components/common/Breadcrumb.vue';
import * as api from '@/api/BrandProduct/ProductMange/index.js';
import * as pApi from '@/privilegeList/BrandProduct/ProductMange/index.js';
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
            btnStyle: 'primary',
            unit: '包',
            unitArr: [
                { label: '包', value: '包' },
                { label: '箱', value: '箱' },
                { label: '件', value: '件' },
                { label: '条', value: '条' },
                { label: '盒', value: '盒' },
                { label: 'KG', value: 'KG' },
                { label: '吨', value: '吨' },
                { label: '平米', value: '平米' },
                { label: '立方', value: '立方' }
            ],
            tableData: []
        };
    },

    computed: {
        unitName() {
            let u = '';
            this.unitArr.forEach((v, k) => {
                if (v.value == this.unit) {
                    u = v.label;
                }
            });
            return u;
        }
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
                    this.unit = v.stockUnit;
                    // 1.修改 2.添加
                    if (!v.id) {
                        v.flag = 2;
                    } else {
                        v.flag = 1;
                    }
                    v.btnStyle = 'primary';
                    this.tableData.push(v);
                });
            }).catch(err => {
                console.log(err);
            });
        },
        // 保存表单信息
        saveMsg(row) {
            const data = {
                priceId: row.priceId,
                stock: row.stock,
                stockUnit: this.unit
            };
            var reg = /^\d+(?=\.{0,1}\d+$|$)/;
            if (!reg.test(row.stock)) {
                this.$message.warning('请输入正确的库存');
                return;
            }
            this.btnLoading = true;
            if (row.flag === 1) {
                data.id = row.id;
                request.updateProductSpecStock(data).then(res => {
                    this.$message.success(res.msg);
                    row.btnStyle = 'success';
                    this.btnLoading = false;
                }).catch(err => {
                    console.log(err);
                    this.btnLoading = false;
                });
            } else {
                request.addProductSpecStock(data).then(res => {
                    this.$message.success(res.msg);
                    row.btnStyle = 'success';
                    this.btnLoading = false;
                }).catch(err => {
                    console.log(err);
                    this.btnLoading = false;
                });
            }
        },
        // 表头下拉框改变
        tableHeadChange(value) {
            this.unit = value;
        },
        // 表头处理
        renderHeader(h, { column, $index }) {
            return [
                h(
                    'div',
                    {
                        style: {
                            margin: '8px -20px 0 0'
                        }
                    },
                    ['总库存']
                ),
                h(
                    'el-select',
                    {
                        style: {
                            display: 'inline-block',
                            width: '120px',
                            'margin-top': '8px'
                        },
                        attrs: {
                            value: this.unit,
                            placeholder: ''
                        },
                        on: {
                            change: this.tableHeadChange
                        }
                    },
                    this.unitArr.map((v, k) => {
                        return h('el-option', {
                            attrs: {
                                label: v.label,
                                value: v.value
                            }
                        });
                    })
                )
            ];
        },
        // 恢复按钮样式
        changeBtnStyle(row) {
            row.btnStyle = 'primary';
        },
        // 编辑库存
        editInventory(row) {
            this.$router.push('/editInventory');
        },
        // 查看库存
        watchInventory(row) {
            this.$router.push('/inventoryInfo');
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
