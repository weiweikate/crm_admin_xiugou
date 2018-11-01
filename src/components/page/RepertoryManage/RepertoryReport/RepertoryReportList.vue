<template>
    <div class="repertory-list">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card :body-style="{ padding: '20px 40px' }">
            <el-form :model="form" ref="form" inline label-width="100px">
                <el-form-item prop="name" label="入库单编号">
                    <el-input v-model="form.name" placeholder="请输入入库单编号"></el-input>
                </el-form-item>
                <el-form-item prop="type" label="入库类别">
                    <el-select v-model="form.type" placeholder="请选择入库类别">
                        <el-option value="">全部</el-option>
                        <el-option value="1">采购入库</el-option>
                        <el-option value="2">调拨入库</el-option>
                        <el-option value="2">盘盈入库</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="date" label="创建时间">
                    <el-date-picker
                        v-model="form.date"
                        type="datetimerange"
                        format="yyyy-MM-dd"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item prop="code" label="出库仓库编号">
                    <el-input v-model="form.code" placeholder="请输入出库仓库编号"></el-input>
                </el-form-item>
                <el-form-item prop="supplierName" label="出库方">
                    <el-input v-model="form.supplierName" placeholder="请输入出库方"></el-input>
                </el-form-item>
                <el-form-item prop="supplierName" label="入库仓库编号">
                    <el-input v-model="form.supplierName" placeholder="请输入入库仓库编号"></el-input>
                </el-form-item>
                <el-form-item prop="supplierName" label="入库方">
                    <el-input v-model="form.supplierName" placeholder="请输入入库方"></el-input>
                </el-form-item>
                <el-form-item prop="supplierName" label="送货人姓名">
                    <el-input v-model="form.supplierName" placeholder="请输入送货人姓名"></el-input>
                </el-form-item>
                <el-form-item prop="supplierName" label="联系方式">
                    <el-input v-model="form.supplierName" placeholder="请输入联系方式"></el-input>
                </el-form-item>
                <el-form-item prop="status" label="状态">
                    <el-select v-model="form.status" placeholder="请选择">
                        <el-option value="">全部</el-option>
                        <el-option value="1">未推送</el-option>
                        <el-option value="2">待入库</el-option>
                        <el-option value="3">已入库</el-option>
                        <el-option value="4">已取消</el-option>
                        <el-option value="5">已可售</el-option>
                    </el-select>
                </el-form-item>


                <el-form-item label="">
                    <el-button type="primary" @click="getList(1)">搜索</el-button>
                    <el-button @click="resetForm('form')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card :body-style="{ padding: '20px 40px' }" style='margin-top:20px'>
           <el-button type="primary" style="margin-bottom: 20px" @click="$router.push({path:'repertoryReportSet',query:{type:'add'}})">新建入库单</el-button>
            <el-table :data="tableData" border>
                <el-table-column type="index" label="序号" align="center"></el-table-column>
                <el-table-column prop="id" label="入库单编号" align="center"></el-table-column>
                <el-table-column prop="name" label="入库类别" align="center"></el-table-column>
                <el-table-column label="创建时间" align="center">
                    <template slot-scope="scope">
                        <template>{{scope.row.createTime|formatDateAll}}</template>
                    </template>
                </el-table-column>
                <el-table-column prop="type" label="创建人" align="center"></el-table-column>
                <el-table-column prop="type" label="联系方式" align="center"></el-table-column>
                <el-table-column prop="supplierId" label="出库仓库编号" align="center"></el-table-column>
                <el-table-column prop="supplierName" label="出库方" align="center"></el-table-column>
                <el-table-column prop="supplierId" label="入库仓库编号" align="center"></el-table-column>
                <el-table-column prop="supplierName" label="入库方" align="center"></el-table-column>
                <el-table-column prop="supplierName" label="送货人姓名" align="center"></el-table-column>
                <el-table-column prop="supplierName" label="送货人联系方式" align="center"></el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        <template v-if="scope.row.status==1">未推送</template>
                        <template v-if="scope.row.status==2">待入库</template>
                        <template v-if="scope.row.status==3">已入库</template>
                        <template v-if="scope.row.status==4">已取消</template>
                        <template v-if="scope.row.status==5">已可售</template>
                    </template>
                </el-table-column>
                <el-table-column label="操作" min-width="150">
                    <template slot-scope="scope">
                        <el-button @click="showInfo(scope.row)" type="primary">详情</el-button>
                        <el-button @click="editReport(scope.row)" type="success" v-if="scope.row.status==1||scope.row.status==2">编辑</el-button>
                        <el-button @click="sendOrCancel(scope.row,0)" type="warning" v-if="scope.row.status==1">推送</el-button>
                        <el-button @click="sendOrCancel(scope.row,1)" type="warning" v-if="scope.row.status==2">取消入库单</el-button>
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
        <!--删除-->
        <el-dialog title="温馨提示" :visible.sync="mask">
            <div class="tip">{{tips[index]}}</div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="sure">确 认</el-button>
                <el-button @click="mask=false">取 消</el-button>
            </div>
        </el-dialog>
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
            nav: ['云仓仓库管理', '仓库单', '入库单'],
            tableData: [],
            form: {},
            formMask: {},
            title: '启用仓库',
            mask: false,
            tips: ['确认推送入库单？', '确认取消图库单？'],
            index: ''
        };
    },
    activated() {
        this.getList(this.page.currentPage);
    },
    methods: {
        // 获取数据
        getList(val) {
            const data = {
                name: this.form.name,
                supplierName: this.form.supplierName,
                code: this.form.code,
                status: this.form.status,
                type: this.form.type,
                startTime: this.form.date
                    ? moment(this.form.date[0]).format('YYYY-MM-DD')
                    : '',
                endTime: this.form.date
                    ? moment(this.form.date[1]).format('YYYY-MM-DD')
                    : '',
                page: val,
                size: this.page.pageSize
            };
            this.page.currentPage = val;
            request
                .getStoreList(data)
                .then(res => {
                    this.tableData = [];
                    if (!res.data) return;
                    this.tableData = res.data.data;
                    this.page.totalPage = res.data.totalNum;
                })
                .catch(error => {
                    console.log(error);
                });
        },
        // 查看详情
        showInfo(row) {
            sessionStorage.setItem('reportInfoId', row.id);
            this.$router.push({
                name: 'reportInfoId',
                query: { repertoryInfoId: row.id }
            });
        },
        // 编辑
        editReport(row) {
            sessionStorage.setItem('reportId', row.id);
            this.$router.push({
                name: 'repertoryReportSet',
                query: { reportId: row.id }
            });
        },
        // 重置表单
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.form.date = '';
            this.getList(this.page.currentPage);
        },
        // 停用启用
        sendOrCancel(row, num) {
            this.mask = true;
            // this.id = row.id;
            // this.status = row.status;
            this.index = num;
        },
        sure() {
            this.mask = false;
        }
    }
};
</script>
<style lang='less' scoped>
.repertory-list {
    .block {
        margin: 10px 0;
    }
    .color-blue {
        color: #33b4ff;
        cursor: pointer;
    }
    /*弹窗样式*/
    /deep/.el-dialog {
        width: 530px;
        border-radius: 10px;
        .el-dialog__header {
            border-bottom: 1px solid #eee;
            padding: 20px 20px 10px;
        }
        .el-dialog__title {
            color: #ff6868;
        }
        .el-input {
            display: inline;
        }
        .el-input__inner {
            width: 360px;
        }
        .el-dialog__footer {
            margin-right: 30px;
        }
    }

}
</style>
