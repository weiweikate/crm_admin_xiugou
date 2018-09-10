<template>
    <div class="report-spell-shop">
        <v-breadcrumb :nav="['运营管理','拼店店铺举报']"></v-breadcrumb>
        <el-card :body-style="{ padding: '30px' }">
            <el-table :data="tableData" border>
                <el-table-column type="index" :index='handleIndex' label="序号" align="center"></el-table-column>
                <el-table-column prop="nickname" label="举报用户" align="center">
                    <template slot-scope="scope">
                        <span class="report-cur" @click="reportUser(scope.row)">{{scope.row.nickname}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="举报店铺" align="center">
                    <template slot-scope="scope">
                        <span class="report-cur" @click="reportShop(scope.row)">{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="举报时间" align="center">
                    <template slot-scope="scope" v-if='scope.row.create_time'>
                        {{scope.row.create_time | formatDate}}
                    </template>
                </el-table-column>
                <el-table-column prop="content" label="举报内容" align="center"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button @click="reportShop(scope.row)" type="primary">详情</el-button>
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
import * as api from "@/api/OperateManage/ReportSpellShop.js";
import utils from '@/utils/index.js';
import { myMixinTable } from '@/JS/commom';
export default {
  components: {vBreadcrumb},
  mixins:[myMixinTable],

  data () {
    return {
        tableData:[],
    };
  },

  activated(){
      this.getList(this.page.currentPage);
  },

  methods: {
    //   获取数据
    getList(val){
        this.$axios.post(api.queryStoreReportPageList,{page:val,pageSize:10}).then(res=>{
            this.tableData = res.data.data.data;
            this.page.totalPage = res.data.data.resultCount;
        })
    },
    //   序号
    handleIndex(index){
        return index+1;
    },
    // 举报用户
    reportUser(row){
        sessionStorage.setItem('memberDetail',row.id);
        this.$router.push({name:'memberDetail',query:{id:row.id}})
    },
    // 举报店铺
    reportShop(row){
        sessionStorage.setItem('shopInfoId',row.id);
        this.$router.push({name:'shopInfo',query:{shopInfoId:row.id}})
    },
  }
}

</script>
<style lang='less' scoped>
.report-spell-shop{
    .report-cur{
        cursor: pointer;
        color: rgb(0, 153, 255)
    }
    .block{
        margin: 10px 0;
    }
}
</style>