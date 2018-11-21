<template>
    <div class="desposit-payment">
      <v-breadcrumb :nav="['结算管理','保证金缴纳记录']"></v-breadcrumb>
      <el-card :body-style="{ padding: '30px' }">
        <el-form :model="form" ref='form' inline>
          <el-form-item prop="name" label="缴纳人">
              <el-input v-model="form.name" placeholder="请输入缴纳人"></el-input>
          </el-form-item>
          <el-form-item prop="time" label="缴纳时间">
              <el-date-picker v-model="form.time" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>
          <el-form-item label=" ">
              <el-button type="primary" @click="getList(1)">查询</el-button>
              <el-button @click="resetForm('form')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <el-card style='margin-top:20px' :body-style="{ padding: '30px' }">
        <el-table :data="table" border v-loading="tabLoading">
          <el-table-column type='index' label="编号" align="center"></el-table-column>
          <el-table-column prop='name' label="缴纳人" align="center"></el-table-column>
          <el-table-column prop='amounts' label="缴纳金额" align="center">
              <template slot-scope="scope">
                  <span style="color:red">¥{{scope.row.amounts ||0+scope.row.balance ||0}}</span>
              </template>
          </el-table-column>
          <el-table-column prop='createTime' label="缴纳时间" align="center">
              <template slot-scope="scope" v-if='scope.row.createTime'>
                  <span>{{scope.row.createTime | formatDateAll}}</span>
              </template>
          </el-table-column>
          <el-table-column prop='payType' label="缴纳类型" align="center">
              <template slot-scope="scope">
                <template v-if='scope.row.type == 1'>店铺保证金</template>
                <!--<template v-if='scope.row.payType == 1'>纯平台</template>-->
                <!--<template v-if='scope.row.payType == 2'>微信（小程序）</template>-->
                <!--<template v-if='scope.row.payType == 4'>微信（APP）</template>-->
                <!--<template v-if='scope.row.payType == 8'>支付宝</template>-->
                <!--<template v-if='scope.row.payType == 16'>银联</template>-->
              </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
                <el-button @click="showInfo(scope.row)" type="primary">保证金缴纳明细</el-button>
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
      <el-dialog title="保证金缴纳记录" :visible.sync="isShowdia" width="30%" >
          <p class="deposit-payment">缴纳人：{{name}}</p>
          <p class="deposit-payment">缴纳时间：{{time}}</p>
          <p class="deposit-payment">缴纳类型：店铺缴纳金</p>
          <p class="deposit-payment">支付余额：¥{{balance||0}}</p>
          <!--<p class="deposit-payment">支付代币：{{tokenCoin}}</p>-->
          <p class="deposit-payment">三方支付：¥{{amounts||0}}</p>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="isShowdia = false">确 定</el-button>
                <el-button @click="isShowdia = false">取 消</el-button>
            </span>
      </el-dialog>
    </div>
</template>

<script>
import utils from '@/utils/index.js';
import vBreadcrumb from '@/components/common/Breadcrumb.vue';
import { myMixinTable } from '@/JS/commom';
import request from '@/http/http.js';
export default {
    components: { vBreadcrumb },

    mixins: [myMixinTable],

    data() {
        return {
            tabLoading: false,
            // 表单
            form: {
                name: '',
                time: []
            },
            table: [], // 表格信息
            // 弹出框
            isShowdia: false,
            // 缴纳人
            name: '',
            // 缴纳时间
            time: '',
            // 缴纳类型
            type: '',
            // 支付余额
            balance: '',
            // 支付代币
            tokenCoin: '',
            // 三方支付
            amounts: ''
        };
    },

    activated() {
        this.getList(1);
    },

    methods: {
    // 查询表单
        getList(val) {
            const data = {};
            data.page = val;
            data.size = this.page.pageSize;
            data.name = this.form.name;
            data.start = this.form.time.length == 0 ? '' : utils.formatTime(this.form.time[0], 1);
            data.end = this.form.time.length == 0 ? '' : utils.formatTime(this.form.time[1], 1);
            this.tabLoading = true;
            this.page.currentPage = val;
            request.storePayRecordList(data).then(res => {
                this.tabLoading = false;
                this.table = res.data.data;
                this.page.totalPage = res.data.totalNum;
            }).catch(err => {
                this.tabLoading = false;
            });
        },
        // 查看详情
        showInfo(row) {
            this.isShowdia = true;
            this.name = row.name;
            this.time = utils.formatTime(row.createTime);
            this.balance = row.balance;
            this.tokenCoin = row.tokenCoin;
            this.amounts = row.amounts;
            switch (row.payType) {
                case 1:
                    this.type = '平台支付';
                    break;
                case 2:
                    this.type = '微信(小程序)';
                    break;
                case 4:
                    this.type = '微信(APP)';
                    break;
                case 8:
                    this.type = '支付宝';
                    break;
                case 16:
                    this.type = '银联';
                    break;
                default:
                    break;
            }
        },
        // 重置
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.getList(this.page.currentPage);
        }
    }
};
</script>
<style lang='less' scoped>
.desposit-payment {
  .block {
    margin: 10px 0 20px 0;
  }
  /deep/.el-dialog {
    border-radius: 10px;
    .el-dialog__header {
      border-bottom: 1px solid #ccc;
      .el-dialog__title {
        color: #ff6868;
      }
    }
  }
  .deposit-payment {
    margin-left: 50px;
    font-size: 16px;
    line-height: 35px;
  }
}
</style>
