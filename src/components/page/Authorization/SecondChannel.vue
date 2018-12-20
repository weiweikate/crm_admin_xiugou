<template>
    <div>
        <breadcrumb :nav='breadcrumb'></breadcrumb>
        <el-card>
            <el-button v-if="p.addPermitChannel_2" type='primary' @click="addChan">添加渠道</el-button>
            <el-table v-loading="tableLoading" class="w-table" stripe :data="tableData" :height="height" border style="width: 100%">
                <el-table-column prop="id" label="ID" width="180" align="center"></el-table-column>
                <el-table-column prop="name" label="品类" align="center"></el-table-column>
                <el-table-column prop="status" label="渠道参与者" align="center"></el-table-column>
                <el-table-column prop="status" label="状态" align="center">
                  <template slot-scope="scope">
                    <template v-if="scope.row.status == 1">开启</template>
                    <template v-if="scope.row.status == 2">关闭</template>
                    <template v-if="scope.row.status == 3">删除</template>
                  </template> 
                </el-table-column>
                <el-table-column v-if="isShowOperate" label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button v-if="p.updatePermitChannel_2" type="warning" @click='edit(scope.row)'>编辑</el-button>
                        <el-button type="danger" v-if="scope.row.status == 2 && p.updatePermitChannel_3" @click="deleteMsg(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- <div class="block">
                <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="page.currentPage"
                    layout="total, prev, pager, next, jumper"
                    :total="page.totalPage">
                </el-pagination>
            </div> -->
        </el-card>
        <add-channel @status='closeAddChan' :fathermsg='fathermsg' v-if="isShowAddChan"></add-channel>
        <edit-channel @status='closeEditChan' :row='row' v-if="isShowEditChan"></edit-channel>
        <delete-toast :id='delId' :url='delUrl' :uri='delUri' status='3' @msg='deleteToast' v-if="isShowDelToast"></delete-toast>
    </div>
</template>
<script>
import breadcrumb from "../../common/Breadcrumb";
import addChannel from "./SecondChannel/addChannel";
import editChannel from "./SecondChannel/editChannel";
import deleteToast from "../../common/DeleteToast";
import * as api from "../../../api/api.js";
import utils from "../../../utils/index.js";
import * as pApi from "../../../privilegeList/index.js";
export default {
  components: {
    breadcrumb,
    addChannel,
    editChannel,
    deleteToast
  },
  data() {
    return {
      // 权限控制
      p: {
        addPermitChannel_1: false,
        addPermitChannel_2: false,
        updatePermitChannel_1: false,
        updatePermitChannel_2: false,
        updatePermitChannel_3: false
      },
      isShowOperate: true,

      breadcrumb: ["授权审核管理", "渠道类目管理", ""],
      isShowAddChan: false,
      isShowEditChan: false,
      isShowDelToast: false,
      tableLoading: false,
      row: "",
      fathermsg: {},
      delId: 66,
      delUrl: "http://api",
      delUri:'',
      tableData: [{ ID: 123 }],
      id: "",
      fatherName: "",
      page: {
        currentPage: 1,
        totalPage: 20
      },
      height: ""
    };
  },
  created() {
    let winHeight = window.screen.availHeight - 360;
    this.height = winHeight;
    this.pControl();
  },
  activated() {
    this.pControl();
    this.breadcrumb[2] = this.$route.params.firstName;
    this.id =
      this.$route.params.id ||
      JSON.parse(sessionStorage.getItem("secondChannel")).id;
    this.fatherName =
      this.$route.params.fatherName ||
      JSON.parse(sessionStorage.getItem("secondChannel")).fatherName;
    this.fathermsg.id = this.id;
    this.fathermsg.fatherName = this.fatherName;
    this.getList();
  },
  methods: {
    // 权限控制
    pControl() {
      for (const k in this.p) {
        this.p[k] = utils.pc(pApi[k]);
      }
      if (!this.p.updatePermitChannel_2 && !this.p.updatePermitChannel_2) {
        this.isShowOperate = false;
      }
    },
    //获取列表
    getList() {
      let that = this;
      let data = {
        fatherid: this.id,
        url:pApi.addPermitChannel_2
      };
      this.tableLoading = true;
      this.$axios
        .post(api.permitChannelGetList, data)
        .then(res => {
          this.tableLoading = false;
          if (res.data.code == 200) {
            this.tableData = [];
            this.tableData = res.data.data;
          } else {
            this.$message.warning(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
          that.tableLoading = false;
        });
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page.currentPage = val;
      this.getList(val);
    },

    // 编辑信息
    edit(row) {
      this.row = row;
      this.row.fatherName = this.fathermsg.fatherName;
      this.isShowEditChan = true;
    },

    // 删除信息
    deleteMsg(row) {
      this.delId = row.id;
      this.delUrl = api.updatePermitChannel;
      this.delUri = pApi.updatePermitChannel_3;
      this.isShowDelToast = true;
    },

    // 添加渠道
    addChan() {
      this.isShowAddChan = true;
    },
    // 关闭添加弹窗
    closeAddChan(msg) {
      this.getList();
      this.isShowAddChan = msg;
    },
    // 关闭编辑弹窗
    closeEditChan(msg) {
      this.getList();
      this.isShowEditChan = msg;
    },
    // 删除弹窗
    deleteToast(msg) {
      this.getList();
      this.isShowDelToast = msg;
    }
  }
};
</script>
<style lang="less" scoped>
.w-table {
  margin-top: 10px;
}
.block {
  float: right;
  margin: 10px 0 10px 0;
}
</style>


