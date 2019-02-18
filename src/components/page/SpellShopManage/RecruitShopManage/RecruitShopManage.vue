<template>
    <div class="recruit-shop-man">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card :body-style="{ padding: '20px 40px' }">
            <el-form :model="form" ref="form" inline label-width="100px" @submit.native.prevent>
                <el-form-item prop="name" label="店铺名称">
                    <el-input v-model="form.name" placeholder="请输入店铺名称"></el-input>
                </el-form-item>
                <el-form-item prop="date" label="发起时间">
                    <el-date-picker
                        v-model="form.date"
                        type="datetimerange"
                        format="yyyy-MM-dd"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" native-type="submit" @click='getList(1)'>搜索</el-button>
                    <el-button @click="resetForm('form')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card :body-style="{ padding: '20px 40px',}" style="margin-top:20px">
            <el-table :data="tableData" border :height="height">
                <el-table-column type="index" label="编号" align="center"></el-table-column>
                <el-table-column prop="name" label="店铺名称" align="center"></el-table-column>
                <el-table-column prop="showNumber" label="店铺ID" align="center"></el-table-column>
                <el-table-column prop="storeNumber" label="店铺内部编号" align="center"></el-table-column>
                <el-table-column prop="storeUserName" label="店长" align="center"></el-table-column>
                <el-table-column prop="storeUserNum" label="招募成员" align="center">
                    <template slot-scope="scope">
                        <template>
                            <span v-if="hasAuth" @click="toUserList(scope.row)" class="color-blue">{{scope.row.storeUserNum||0}}</span>
                            <span v-else>{{scope.row.storeUserNum||0}}</span>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" align="center">
                    <template slot-scope="scope" v-if='scope.row.createTime'>
                        <template>{{scope.row.createTime|formatDateAll}}</template>
                    </template>
                </el-table-column>
                <!--<el-table-column prop="id" label="是否开启推荐" align="center"></el-table-column>-->
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" @click='showInfo(scope.row)' v-auth="'pindian.recruitShopManage.ckxq'">查看详情</el-button>
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
import moment from 'moment';
import { myMixinTable } from '@/JS/commom';
import request from '@/http/http.js';

export default {
    components: { vBreadcrumb },

    mixins: [myMixinTable],

    data() {
        return {

            nav: ['拼店管理', '招募店铺管理'],
            form: {
                name: '',
                date: ''
            },
            tableData: [],
            height: '',
            hasAuth: ''// 是否有查看下级的权限
        };
    },
    created() {
        const winHeight = window.screen.availHeight - 540;
        this.height = winHeight;
    },
    activated() {
        this.getList(this.page.currentPage);
        this.hasAuth = this.$oprAuth('vip.memberManage.xjck');
    },
    methods: {
        // 获取数据
        getList(val) {
            const data = {
                name: this.form.name,
                startTime: this.form.date ? moment(this.form.date[0]).format('YYYY-MM-DD 00:00:00') : '',
                endTime: this.form.date ? moment(this.form.date[1]).format('YYYY-MM-DD 00:00:00') : '',
                page: val,
                size: this.page.pageSize,
                status: 3
            };
            this.page.currentPage = val;
            request.getStoreList(this.$utils.trimForm(data)).then(res => {
                this.tableData = [];
                if (!res.data) return;
                this.tableData = res.data.data;
                this.page.totalPage = res.data.totalNum;
            }).catch(error => {
                console.log(error);
            });
        },
        // 查看店铺详情
        showInfo(row) {
            sessionStorage.setItem('recruitShopId', row.storeNumber);
            this.$router.push({ name: 'recruitShopInfo', query: { 'recruitShopId': row.storeNumber }});
        },
        // 重置表单
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.form.date = '';
            this.getList(this.page.currentPage);
        },
        // 查看招募成员
        toUserList(row) {
            sessionStorage.setItem('recruitShopId', row.storeNumber);
            sessionStorage.setItem('groupMoney', row.groupMoney);
            this.$router.push({ name: 'shopMemberManage', query: { 'recruitShopId': row.storeNumber, 'groupMoney': row.groupMoney }});
        }
    }
};
</script>
<style lang='less' scoped>
    .recruit-shop-man {
        .block {
            margin: 10px 0px;
        }
        .color-blue {
            color: #33b4ff;
            cursor: pointer;
        }
    }
</style>
