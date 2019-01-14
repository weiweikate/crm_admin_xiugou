<template>
    <div>
        <v-breadcrumb :nav="['会员管理','经验值专区管理']"></v-breadcrumb>
        <transition name="move" appear>
            <el-card style="margin:10px 0 20px">
                <el-form ref="form" :inline="true" :model="form">

                    <el-form-item prop="time" label="创建时间" label-width="120">
                        <el-date-picker
                            v-model="form.time"
                            type="datetimerange"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :default-time="['00:00:00', '23:59:59']"
                        >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item prop="code" label="授权码" label-width="120">
                        <el-input style="width:200px" placeholder="模糊搜索" v-model="form.code"></el-input>
                    </el-form-item>
                    <el-form-item prop="phone" label="手机号" label-width="120">
                        <el-input style="width:200px" placeholder="模糊搜索" v-model="form.phone"></el-input>
                    </el-form-item>
                    <el-form-item prop="sourceType" label="经验值状态状态">
                        <el-select v-model="form.sourceType" placeholder="全部">
                            <el-option label="全部" value="">全部</el-option>
                            <el-option :label="value" :value="key" v-for="(value, key) in sourceTypeList" :key="key">{{value}}</el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="sourceCode" label="经验值来源" label-width="120">
                        <el-select v-model="form.sourceCode" placeholder="全部">
                            <el-option label="全部" value="">全部</el-option>
                            <el-option :label="value" :value="key" v-for="(value, key) in sourceCodeList" :key="key">{{value}}</el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="getList(1)" type="primary">查询</el-button>
                        <el-button @click="resetForm('form')">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </transition>

        <el-card style="margin-top: 20px;">
            <el-table v-loading="tableLoading" :data="tableData" :height="height" border style="width: 100%;margin-top:20px;">
                <el-table-column prop="userCode" label="授权码" align="center"></el-table-column>
                <el-table-column prop="phone" label="手机号" width="100" align="center"></el-table-column>
                <el-table-column prop="sourceCode" label="经验值来源" align="center"></el-table-column>
                <el-table-column prop="sourceType" label="经验值状态" width="150" align="center">
                    <template slot-scope="scope">
                        {{sourceTypeList[scope.row.sourceType]}}
                    </template>
                </el-table-column>
                <el-table-column prop="experience" label="赠送经验值" width="150" align="center"></el-table-column>
                <el-table-column prop="platformOrderNo" label="平台订单号" width="150" align="center"></el-table-column>
                <el-table-column prop="startTime" label="创建时间" width="150" align="center">
                    <template slot-scope="scope">
                        {{scope.row.createTime | formatDateAll}}
                    </template>
                </el-table-column>
            </el-table>
            <div class="paginate">
                <el-pagination
                    background
                    @size-change="handleSizeChange"
                    :page-size="page.pageSize"
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
    import vBreadcrumb from '../../common/Breadcrumb.vue';
    import request from '@/http/http';
    import { myMixinTable } from '@/JS/commom';

    export default {
        name: 'ExpList',
        components: {
            vBreadcrumb
        },
        mixins: [myMixinTable],
        data() {
            return {
                sourceCodeList: {
                    1: '直接邀请',
                    2: '间接邀请',
                    3: '个人交易额',
                    4: '直接代理交易',
                    5: '间接代理交易',
                    6: '周交易额',
                    7: '周交易频次',
                    8: '一次性交易额',
                    9: '签到',
                    10: '分享',
                    11: '分享点击',
                    12: '个人奖励金',
                    13: '礼包',
                    14: '经验值专区',
                    15: '其他',
                    16: '店铺分红',
                    30: '30天未登录',
                    31: '未达到交易额'
                },
                sourceTypeList: {
                    1: '收入',
                    2: '支出'
                },
                form: {
                    sourceType: '',
                    sourceCode: '',
                    time: [],
                    startTime: '',
                    endTime: '',
                    phone: '',
                    code: ''
                },
                tableLoading: false
            };
        },
        methods: {
            getList(page) {
                const data = {
                    ...this.form
                };
                data.page = page;
                data.pageSize = this.page.pageSize;
                if (this.form.time && this.form.time.length) {
                    data.startTime = this.form.time[0];
                    data.endTime = this.form.time[1];
                }
                this.tableLoading = true;
                request.queryUserExperiencePageList(data).then(res => {
                    this.tableLoading = false;
                    this.tableData = res.data.data;
                    this.page.totalPage = res.data.totalNum;
                    this.page.currentPage = res.data.currentPage;
                }).catch(res => {
                    this.tableLoading = false;
                    this.$message.warning(res.msg);
                });
            },
            //   重置表单
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.getList(1);
            }
        },
        mounted() {
            this.getList(1);
        }
    };
</script>
<style lang='less' scoped>
    .paginate {
        margin-top: 20px;
        text-align: right;
    }
</style>
