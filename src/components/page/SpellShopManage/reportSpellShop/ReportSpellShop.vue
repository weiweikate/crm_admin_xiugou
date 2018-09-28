<template>
    <div class="report-spell-shop">
        <v-breadcrumb :nav="['运营管理','拼店店铺举报']"></v-breadcrumb>
        <el-card :body-style="{ padding: '30px' }">
            <el-table :data="tableData" border>
                <el-table-column type="index" :index='handleIndex' label="序号" align="center"></el-table-column>
                <el-table-column prop="userName" label="举报用户" align="center">
                    <template slot-scope="scope">
                        <span class="report-cur" @click="reportUser(scope.row)">{{scope.row.userName}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="storeName" label="举报店铺" align="center">
                    <template slot-scope="scope">
                        <span class="report-cur" @click="reportShop(scope.row)">{{scope.row.storeName}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="举报时间" align="center">
                    <template slot-scope="scope" v-if='scope.row.createTime'>
                        {{scope.row.createTime | formatDateAll}}
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
                        :page-size="page.pageSize"
                        layout="total, prev, pager, next, jumper"
                        :total="page.totalPage">
                </el-pagination>
            </div>
        </el-card>
    </div>
</template>

<script>
import vBreadcrumb from '@/components/common/Breadcrumb.vue';
import * as api from '@/api/OperateManage/ReportSpellShop.js';
import utils from '@/utils/index.js';
import { myMixinTable } from '@/JS/commom';
import request from '@/http/http.js';

export default {
    components: { vBreadcrumb },
    mixins: [myMixinTable],

    data() {
        return {
            tableData: []
        };
    },

    activated() {
        this.getList(this.page.currentPage);
    },

    methods: {
    //   获取数据
        getList(val) {
            const data = {
                page: val,
                size: this.page.pageSize
            };
            request.getStoreTipOffList(data).then(res => {
                if (!res.data) return;
                this.tableData = res.data.data;
                this.page.totalPage = res.data.totalNum;
            }).catch(error => {
                console.log(error);
            });
        },
        //   序号
        handleIndex(index) {
            return index + 1;
        },
        // 举报用户
        reportUser(row) {
            sessionStorage.setItem('memberDetail', row.userId);
            this.$router.push({ name: 'memberDetail', query: { id: row.userId }});
        },
        // 举报店铺
        reportShop(row) {
            sessionStorage.setItem('shopInfoId', row.storeId);
            sessionStorage.setItem('status', 1);
            this.$router.push({ name: 'shopInfo', query: { shopInfoId: row.storeId, status: 1 }});
        }
    }
};

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
