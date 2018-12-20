<template>
    <div class="cloud-warehouse">
      <v-breadcrumb :nav="['结算管理','云仓结算管理']"></v-breadcrumb>
      <el-card :body-style="{ padding: '30px' }">
        <el-form :model="form" ref='form' inline>
          <el-form-item prop="time" label="发货时间">
              <el-date-picker v-model="form.time" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>
          <el-form-item label=" ">
              <el-button type="primary" @click="queryForm(1)">查询</el-button>
              <el-button @click="resetForm('form')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <el-card style='margin-top:20px' :body-style="{ padding: '30px' }">
        <el-table :data="table" border>
          <el-table-column prop='no' label="编号" align="center"></el-table-column>
          <el-table-column prop='no' label="开始时间" align="center"></el-table-column>
          <el-table-column prop='no' label="结束时间" align="center">
              <template slot-scope="scope">
                  <span style="color:red">{{scope.row.no | handleMoney}}</span>
              </template>
          </el-table-column>
          <el-table-column prop='no' label="推送数量" align="center"></el-table-column>
          <el-table-column prop='no' label="发货数量" align="center">
              <template slot-scope="scope">
                  <span style="color:red">{{scope.row.no | handleMoney}}</span>
              </template>
          </el-table-column>
          <el-table-column prop='no' label="结算额" align="center"></el-table-column>
          <el-table-column prop='no' label="状态" align="center"></el-table-column>
          <el-table-column label="操作" align="center" width="250px">
            <template slot-scope="scope">
                  <el-button @click="showInfo(scope.row)" type="primary">查看发货单</el-button>
                  <template v-if='scope.row.status == 1'>
                      <el-button @click="settlement(scope.row)" type="danger">结算</el-button>
                  </template>
                  <template v-if='scope.row.status == 2'>
                      <el-button @click="settleRecord(scope.row)" type="success">结算记录</el-button>
                  </template>
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
      <!-- 结算弹窗 -->
      <el-dialog title="确认结算" :visible.sync="isShowdia" width="30%" center >
          <p class="deposit-payment">确认与百世汇通结算吗？</p>
          <p class="deposit-payment">结算金额：666</p>
          <p class="deposit-payment">结算操作人：王小明</p>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirmSett">确 定</el-button>
                <el-button @click="isShowdia = false">取 消</el-button>
            </span>
      </el-dialog> 
      <!-- 结算记录弹窗 -->
      <el-dialog title="结算记录" :visible.sync="isShowRecorDia" width="30%" center >
        <el-table :data="recordTable" border >
          <el-table-column prop="id" label="结算时间" align="center"></el-table-column>
          <el-table-column prop="id" label="结算金额" align="center"></el-table-column>
          <el-table-column prop="id" label="结算操作人" align="center"></el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="isShowRecorDia = false">确 定</el-button>
            <el-button @click="isShowRecorDia = false">取 消</el-button>
        </span>
      </el-dialog> 
    </div>
</template>

<script>
import utils from '@/utils/index.js'
import * as api from '@/api/SettlementMange/index.js';
import vBreadcrumb from '../../common/Breadcrumb.vue';
export default {
  components: {vBreadcrumb},

  data () {
    return {
        // id
        id:'',
      // 表单
      form:{
        name:'',
        time:[]
      },
      table:[{no:123456789,id:1,status:'1'},{no:123456789,id:1,status:'2'}], // 表格信息
      page: {
            currentPage: 1,
            totalPage: 0
        },
        // 结算弹出框
        isShowdia:false,
        // 结算记录弹出框
        isShowRecorDia:false,
        // 结算记录表格
        recordTable:[{id:1}],
    };
  },

  methods: {
    //   结算记录
    settleRecord(row){
        this.isShowRecorDia = true;
    },
    //   结算
    settlement(row){
        this.id = row.id;
        this.isShowdia = true;
    },
    confirmSett(){
        this.axios.post().then(res=>{
        console.log(res.data)
        })
    },
    // 查询表单
    queryForm(val){

    },
    // 查看详情 
    showInfo(row){
        this.$router.push({name:'invoiceInfo',query:{id:row.id}})
    },
    //分页
    handleSizeChange(val) {},
    handleCurrentChange(val) {
        this.page.currentPage = val;
        this.queryForm(val)
    },
  }
}

</script>
<style lang='less' scoped>
.cloud-warehouse{
  .block{margin: 10px 0 20px 0}
  /deep/.el-dialog{border-radius: 10px;.el-dialog__header{border-bottom: 1px solid #ccc;.el-dialog__title{color: #ff6868}}}
  .deposit-payment{
      text-align: center;
      font-size: 16px;
      line-height: 35px;
  }
}
</style>