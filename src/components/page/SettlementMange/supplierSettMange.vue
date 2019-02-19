<template>
    <div class="supplier-sett-mange">
      <v-breadcrumb :nav="['结算管理','供应商结算管理']"></v-breadcrumb>
      <el-card :body-style="{ padding: '30px' }">
        <el-form :model="form" ref='form' inline>
          <el-form-item prop="name" label="供应商名称">
              <el-input v-model="form.name" placeholder="请输入供应商名称"></el-input>
          </el-form-item>
          <el-form-item prop="year" label="月帐期">
              <el-date-picker v-model="form.date" type="month" placeholder="选择时间"></el-date-picker>
          </el-form-item>
          <el-form-item label=" ">
              <el-button type="primary" @click="handleCurrentChange(1)">查询</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <el-card style='margin-top:20px' :body-style="{ padding: '30px' }">
        <el-button style="margin-bottom:10px" type="primary" @click="exportRecord"><a style="color: #fff" :href="downLoadUrl">导出对账单</a></el-button>
        <mr-flying parentClass="content-box">
            <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page.currentPage"
                :page-size="page.pageSize"
                layout="total, prev, pager, next, jumper"
                :total="page.totalPage">
            </el-pagination>
        </mr-flying>
        <el-table v-loading="loading" :data="tableData" :span-method="arraySpanMethod"  border>
          <el-table-column prop='supplierName' label="供应商" align="center"></el-table-column>
          <el-table-column prop='productName' label="产品名称" align="center"></el-table-column>
          <el-table-column prop='orderNum' label="订单数" align="center"></el-table-column>
          <el-table-column prop='tradingVolume' label="交易量" align="center"></el-table-column>
          <el-table-column prop='turnover' label="交易额" align="center">
              <template slot-scope="scope">
                  <span style="color:red">{{scope.row.turnover || 0 | handleMoney}}</span>
              </template>
          </el-table-column>
          <el-table-column prop='totalSettlement' label="总结算价" align="center">
              <template slot-scope="scope">
                  <span style="color:red">{{scope.row.totalSettlement || 0 | handleMoney}}</span>
              </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
</template>

<script>
import vBreadcrumb from '@/components/common/Breadcrumb.vue';
import { myMixinTable } from '@/JS/commom';
import request from '@/http/http';
import * as api from '@/api/SettlementMange/index.js';
export default {
    components: { vBreadcrumb },

    mixins: [myMixinTable],

    data() {
        return {
            // 表单
            form: {
                name: '',
                date: ''
            },
            loading: false,
            tableData: [],
            spanData: []
        };
    },

    computed: {
        downLoadUrl() {
            const url = `${api.exportStorePayRecordList}?name=${this.form.name || ''}&startTime=${this.$utils.formatTime(this.form.date, 2) || ''}`;
            return url;
        }
    },

    activated() {
        this.handleCurrentChange(1);
    },

    methods: {
        // 查询表单
        getList(val) {
            const data = {
                name: this.form.name,
                startTime: this.$utils.formatTime(this.form.date, 2),
                pageSize: this.page.pageSize,
                page: val
            };
            this.loading = true;
            request.querySupplierByProductId(this.$utils.trimForm(data)).then(res => {
                this.loading = false;
                const table = res.data.data || [];
                this.tableData = [];
                this.spanData = [];
                this.page.totalPage = res.data.totalNum;
                let t = 0;
                table.forEach(v => {
                    if (v.productList.length !== 0) {
                        this.spanData.push({ startIndex: t, num: v.productList.length });
                        t += v.productList.length;
                        v.productList.forEach(v1 => {
                            const item = {
                                supplierName: v.supplierName,
                                ...v1
                            };
                            this.tableData.push(item);
                        });
                    } else {
                        const item = {
                            supplierName: v.supplierName
                        };
                        this.spanData.push({ startIndex: t, num: 1 });
                        t += 1;
                        this.tableData.push(item);
                    }
                });
            }).catch(err => {
                this.loading = false;
                console.log(err);
            });
        },
        // 查看详情
        showDetail(row) {
            this.$router.push({ name: 'refundInfo', query: { id: row.id }});
        },
        /**
         * 合并单元格
         * 从第startIndex开始，合并num行
         * @param row
         * @param column
         * @param rowIndex
         * @param columnIndex
         * @returns {*}
         */
        arraySpanMethod({ row, column, rowIndex, columnIndex }) {
            if (columnIndex === 0) {
                for (let i = 0; i < this.spanData.length; i++) {
                    if (rowIndex === this.spanData[i].startIndex) {
                        return {
                            rowspan: this.spanData[i].num,
                            colspan: 1
                        };
                    }
                }
                return {
                    rowspan: 0,
                    colspan: 0
                };
            }
        }
    }
};

</script>
<style lang='less' scoped>
.supplier-sett-mange{
  .block{margin: 10px 0 20px 0}
}
</style>
