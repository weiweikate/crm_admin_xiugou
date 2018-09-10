<template>
    <div class="recruit-shop-man">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card :body-style="{ padding: '20px 40px' }">
            <el-form :model="form" ref="form" inline label-width="100px">
                <el-form-item prop="name" label="店铺名称">
                    <el-input v-model="form.name" placeholder="请输入店铺名称"></el-input>
                </el-form-item>
                <el-form-item prop="date" label="发起时间">
                    <el-date-picker
                        v-model="form.date"
                        type="datetimerange"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" @click='getList(1)'>搜索</el-button>
                    <el-button @click="resetForm('form')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card :body-style="{ padding: '20px 40px',}" style="margin-top:20px">
            <el-table :data="tableData" border>
                <el-table-column type="index" label="编号" align="center"></el-table-column>
                <el-table-column prop="name" label="店铺名称" align="center"></el-table-column>
                <el-table-column prop="id" label="店铺ID" align="center"></el-table-column>
                <el-table-column prop="storeUser" label="店长" align="center"></el-table-column>
                <el-table-column prop="storeNumber" label="招募成员" align="center">
                    <template slot-scope="scope">
                        <template><span @click="toUserList(scope.row)" class="color-blue">{{scope.row.hadUser}}</span></template>                    </template>
                </el-table-column>
                <el-table-column label="创建时间" align="center">
                    <template slot-scope="scope" v-if='scope.row.createTime'>
                        <template>{{scope.row.createTime|formatDate}}</template>
                    </template>
                </el-table-column>
                <!--<el-table-column prop="id" label="是否开启推荐" align="center"></el-table-column>-->
                <el-table-column label="操作" align="center" v-if="p.getRecruitmentStoreDetail">
                    <template slot-scope="scope">
                        <el-button type="primary" @click='showInfo(scope.row)'>查看详情</el-button>
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
import vBreadcrumb from "@/components/common/Breadcrumb.vue";
import moment from 'moment';
import * as api from '@/api/SpellShopManage/index';
import * as pApi from '@/privilegeList/SpellShopManage/index';
import utils from "@/utils/index.js";
import { myMixinTable } from '@/JS/commom';
export default {
    components: {vBreadcrumb},

    mixins:[myMixinTable],

    data() {
        return {
            // 权限控制
            p:{
                getRecruitmentStoreDetail:false,
            },

            nav: ["拼店店铺管理", "招募店铺管理"],
            form: {
                name: '',
                date: '',
            },
            tableData: [],
        };
    },
    activated() {
        this.getList(this.page.currentPage);
        this.pControl();
    },
    methods: {
        // 权限控制
        pControl() {
            for (const k in this.p) {
                this.p[k] = utils.pc(pApi[k]);
            }
        },
        // 获取数据
        getList(val) {
            let data = {
                name: this.form.name,
                beginTime: this.form.date ? moment(this.form.date[0]).format('YYYY-MM-DD HH:mm:ss') : '',
                endTime: this.form.date ? moment(this.form.date[1]).format('YYYY-MM-DD HH:mm:ss') : '',
                page: val,
                url:pApi.getRecruitmentStorePageList
            };
            this.$axios.post(api.getRecruitmentStorePageList, data)
                .then((res) => {
                    this.tableData = [];
                    this.tableData = res.data.data.data;
                    this.page.totalPage = res.data.data.resultCount
                }).catch((err) => {
                console.log(err);
            });
        },
        // 查看店铺详情
        showInfo(row) {
            sessionStorage.setItem('shopInfoId', row.id);
            this.$router.push({name: 'shopInfo', query: {'shopInfoId': row.id}})
            // sessionStorage.setItem('recruitShopId', row.id);
            // this.$router.push({name: 'recruitShopInfo', query: {'recruitShopId': row.id}});
        },
        //重置表单
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.form.date = '';
            this.getList(this.page.currentPage)
        },
        // 查看招募成员
        toUserList(row){
            sessionStorage.setItem('recruitShopId', row.id);
            sessionStorage.setItem('groupMoney', row.groupMoney);
            this.$router.push({name: 'shopMemberManage', query: {'recruitShopId': row.id,'groupMoney':row.groupMoney}});
        }
    }
}
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
