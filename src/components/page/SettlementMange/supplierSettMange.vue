<template>
    <div class="supplier-sett-mange">
      <v-breadcrumb :nav="['结算管理','供应商结算管理']"></v-breadcrumb>
      <el-card :body-style="{ padding: '30px' }">
        <el-form :model="form" ref='form' inline>
          <el-form-item prop="name" label="供应商名称">
              <el-input v-model="form.name" placeholder="请输入供应商名称"></el-input>
          </el-form-item>
          <el-form-item prop="time" label="退款时间">
              <el-date-picker v-model="form.time" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>
          <el-form-item label=" ">
              <el-button type="primary" @click="getList(1)">查询</el-button>
              <el-button @click="resetForm('form')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <el-card style='margin-top:20px' :body-style="{ padding: '30px' }">
        <el-button style="margin-bottom:10px" type="primary">导出对账单</el-button>
        <el-table :data="tableData" :span-method="arraySpanMethod"  border>
          <el-table-column prop='supName' label="供应商" align="center"></el-table-column>
          <el-table-column prop='no' label="产品名称" align="center"></el-table-column>
          <el-table-column prop='no' label="订单数" align="center"></el-table-column>
          <el-table-column prop='no' label="交易量" align="center"></el-table-column>
          <el-table-column prop='no' label="交易额" align="center">
              <template slot-scope="scope">
                  <span style="color:red">{{scope.row.no | handleMoney}}</span>
              </template>
          </el-table-column>
          <el-table-column prop='no' label="总结算价" align="center">
              <template slot-scope="scope">
                  <span style="color:red">{{scope.row.no | handleMoney}}</span>
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
import { myMixinTable } from '@/JS/commom';
export default {
    components: { vBreadcrumb },

    mixins: [myMixinTable],

    data() {
        return {
            // 表单
            form: {
                name: '',
                time: []
            },
            tableData: [],
            spanData: [],
            table: [
                {
                    'supName': '供应商A',
                    'productList': [{ 'name': '产品1' }, { 'name': '产品2' }, { 'name': '产品3' }]
                },
                {
                    'supName': '供应商B',
                    'productList': [{ 'name': '产品2' }, { 'name': '产品3' }]
                }
            ] // 表格信息
        };
    },

    activated() {
        this.getList();
    },

    methods: {
        // 查询表单
        getList(val) {
            let t = 0;
            this.table.forEach(v => {
                const data = {
                    supName: v.supName
                };
                if (v.productList.length !== 0) {
                    this.spanData.push({ startIndex: t, num: v.productList.length });
                    t += v.productList.length;
                    v.productList.forEach(v => {
                        data.productName = v.name;
                        this.tableData.push(data);
                    });
                } else {
                    this.spanData.push({ startIndex: t, num: 1 });
                    t += 1;
                    this.tableData.push(data);
                }
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
