<template>
    <div>
        <v-breadcrumb :nav="['服务管理','问题反馈']"></v-breadcrumb>
            <el-card style="margin:10px 0 20px">
                <el-form ref="form" inline :model="form" @submit.native.prevent>
                    <el-form-item prop="level" label="用户层级" label-width="120">
                        <el-select v-model="form.level" placeholder="全部层级">
                            <el-option label="全部层级" value=""></el-option>
                            <el-option :label="item.name" :value="item.level" v-for="(item,index) in levelList" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="type" label="问题类型" label-width="120">
                        <el-select v-model="form.type" placeholder="请选择">
                            <el-option label="请选择" value=""></el-option>
                            <el-option v-for="(v,k) in typeList" :key="k" :label="v.value" :value="v.detailId"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="date" label="时间" label-width="120">
                        <el-date-picker
                                v-model="form.date"
                                type="daterange"
                                format="yyyy-MM-dd"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                        >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item prop="status" label="反馈状态" label-width="120">
                        <el-select v-model="form.status" placeholder="全部反馈">
                            <el-option label="全部反馈" value=""></el-option>
                            <el-option label="待处理" value="1"></el-option>
                            <el-option label="已处理" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="userName" label="用户" label-width="120">
                        <el-input style="width:200px" placeholder="请输入用户" v-model="form.userName"></el-input>
                    </el-form-item>
                    <el-form-item prop="adminName" label="处理人" label-width="120">
                        <el-input style="width:200px" placeholder="请输入处理人" v-model="form.adminName"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="getList(1)" native-type="submit" type="primary">查询</el-button>
                        <el-button @click="resetForm('form')">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        <div class="table-block">
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
            <template>
                <el-table v-loading="tableLoading" :data="tableData" :height="height" border style="width: 100%">
                    <el-table-column prop="id" label="ID" width="60" align="center"></el-table-column>
                    <el-table-column prop="nickname" label="用户" align="center"></el-table-column>
                    <el-table-column label="类型" align="center">
                        <template slot-scope="scope">
                            <template v-if="scope.row.dtype == 1">网信经销商</template>
                            <template v-if="scope.row.dtype == 2">供货经销商</template>
                            <template v-if="scope.row.dtype == 3">网红经销商</template>
                        </template>
                    </el-table-column>
                    <el-table-column prop="levelName" label="层级" align="center"></el-table-column>
                    <el-table-column prop="phone" label="联系电话" align="center"></el-table-column>
                    <el-table-column label="所在区域" align="center">
                        <template slot-scope="scope">{{scope.row.province}}{{scope.row.city}}{{scope.row.area}}</template>
                    </el-table-column>
                    <el-table-column label="反馈时间" align="center">
                        <template slot-scope="scope">
                            {{scope.row.createTime|formatDateAll}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="problemName" label="问题类型" width="100" align="center">
                        <!--<template slot-scope="scope">-->
                            <!--<template v-if="scope.row.typeKey == 1">账户问题</template>-->
                            <!--<template v-if="scope.row.typeKey == 2">营销问题</template>-->
                            <!--<template v-if="scope.row.typeKey == 3">购买流程</template>-->
                            <!--<template v-if="scope.row.typeKey == 4">推广机制</template>-->
                        <!--</template>-->
                    </el-table-column>
                    <el-table-column label="状态" width="100" align="center">
                        <template slot-scope="scope">
                            <template v-if="scope.row.status == 1">待处理</template>
                            <template v-if="scope.row.status == 2">已处理</template>
                        </template>
                    </el-table-column>
                    <el-table-column prop="adminName" label="处理人" align="center"></el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <a v-auth="'service.feedBack.ckxq'" class="el-button el-button--primary el-button--small" :href="'#/feedDetail?id='+`${scope.row.id}`" target="_blank">查看详情</a>  
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </div>

    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import icon from '@/components/common/ico.vue';
    import moment from 'moment';
    import { myMixinTable, queryDictonary } from '@/JS/commom';
    import request from '@/http/http.js';

    export default {
        components: {
            vBreadcrumb, icon
        },
        mixins: [myMixinTable, queryDictonary],
        data() {
            return {

                typeList: [], // 问题类型
                tableData: [],
                tableLoading: false,
                height: '',
                formLabelWidth: '100px',
                form: {
                    level: '',
                    date: '',
                    type: '',
                    status: '',
                    adminName: '',
                    userName: ''
                },
                levelList: [], // 用户层级列表
                selected: ''
            };
        },
        created() {
            const winHeight = window.screen.availHeight - 520;
            this.height = winHeight;
        },
        mounted() {
            this.getList(this.page.currentPage);
            this.getLevelList();
        },
        methods: {
            // 获取列表
            async getList(val) {
                const that = this;
                await this.queryDictonary('WTLX');
                that.typeList = that.tmpAxiosData;
                that.tableData = [];
                const data = {
                    page: val,
                    pageSize: this.page.pageSize,
                    level: that.form.level,
                    type: that.form.type,
                    status: that.form.status,
                    userName: that.form.userName,
                    adminName: that.form.adminName,
                    beginTime: that.form.date ? moment(that.form.date[0]).format('YYYY-MM-DD') : '',
                    endTime: that.form.date ? moment(that.form.date[1]).format('YYYY-MM-DD') : ''
                };
                that.tableLoading = true;
                this.page.currentPage = val;
                request.queryFeedbackList(this.$utils.trimForm(data)).then(res => {
                    that.tableLoading = false;
                    that.tableData = res.data.data;
                    that.page.totalPage = res.data.totalNum;
                }).catch(error => {
                    that.tableLoading = false;
                    console.log(error);
                });
            },
            // 获取用户层级列表
            getLevelList() {
                const that = this;
                request.getUserLevelList({}).then(res => {
                    that.levelList = res.data;
                }).catch(error => {
                    console.log(error);
                });
            },
            // 重置表单
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.form.date = '';
                this.getList(this.page.currentPage);
            }
        }
    };
</script>

<style>
    /*表格样式*/
    .table-block {
        padding: 20px 20px 60px;
        background: #fff
    }

    .block {
        float: right;
        margin-top: 10px
    }

    .content {
        padding: 40px 40px 0
    }

    .table-block .el-form-item {
        margin-bottom: 0 !important;
    }

    .search-area {
        margin-bottom: 20px
    }

    .search-area .el-input__inner {
        width: 160px
    }


</style>
