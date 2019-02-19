<template>
  <div class="trade-info">
      <v-breadcrumb :nav='nav'></v-breadcrumb>
      <el-card :body-style="{ padding: '20px 40px' }">
        <el-form :model="form" inline label-width="100px" @submit.native.prevent>
          <el-form-item prop="name" label="买家">
              <el-input v-model="form.name" placeholder="请输入买家名称"></el-input>
          </el-form-item>
          <el-form-item prop="first" label="交易品类">
              <el-select v-model="form.first" placeholder="" @change="getClassify(2)">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="(v,k) in first" :key="k" :label="v.name" :value="v.id"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item prop="second" label="">
              <el-select v-model="form.second" placeholder="">
                <el-option label="全部" value=""></el-option>
                  <el-option v-for="(v,k) in second" :key="k" :label="v.name" :value="v.id"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item prop="beginTime" label="购买时间">
            <el-date-picker type="datetime" v-model="form.beginTime" placeholder="请选择"></el-date-picker>
          </el-form-item>
          <el-form-item prop="endTime" label="">
              <el-date-picker type="datetime" v-model="form.endTime" placeholder="请选择"></el-date-picker>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" native-type="submit" @click='submitForm'>搜索</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <el-card :body-style="{ padding: '20px 40px',}" style="margin-top:20px">
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
        <el-table :data="tableData" border>
          <el-table-column prop="id" label="编号" align="center"></el-table-column>
          <el-table-column prop="id" label="订单号" align="center"></el-table-column>
          <el-table-column prop="id" label="购买人" align="center"></el-table-column>
          <el-table-column prop="id" label="购买时间" align="center"></el-table-column>
          <el-table-column prop="id" label="购买金额（元）" align="center"></el-table-column>
          <el-table-column prop="id" label="利润（元）" align="center"></el-table-column>
          <el-table-column prop="id" label="分红金（元）" align="center"></el-table-column>
        </el-table>
      </el-card>
  </div>
</template>

<script>
import vBreadcrumb from '@/components/common/Breadcrumb.vue';
import { myMixinTable } from '@/JS/commom';
import request from '@/http/http.js';

export default {
    components: { vBreadcrumb },
    mixins: [myMixinTable],

    data() {
        return {
            nav: ['拼店管理', '店铺详情', '拼店账户', '交易明细'],
            form: {
                name: '',
                first: '',
                second: '',
                beginTime: '',
                endTime: ''
            },
            tableData: [],
            first: [],
            second: []
        };
    },
    activated() {
        this.getClassify(1);
    },
    methods: {
        // 提交表单
        submitForm() {

        },
        // 获取一级二级类目
        getClassify(num) {
            let data = {};
            if (num == 1) {
                data = {
                    page: 1,
                    pageSize: 10000,
                    level: 1,
                    fatherId: 0
                };
            } else {
                data = {
                    page: 1,
                    pageSize: 10000,
                    level: 2,
                    fatherId: this.form.first
                };
                this.second = [];
                this.form.second = '';
            }
            request.queryProductCategoryList(data).then(res => {
                if (num == 1) {
                    this.first = [];
                    this.first = res.data.data;
                } else {
                    this.second = [];
                    this.second = res.data.data;
                }
            }).catch(error => {
                console.log(error);
            });
        }
    }
};

</script>
<style lang='less' scoped>
.trade-info{
    .block{
        margin: 10px 0px;
    }
}
</style>
