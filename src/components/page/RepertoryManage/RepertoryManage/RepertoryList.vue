<template>
    <div class="repertory-list">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card :body-style="{ padding: '20px 40px' }">
            <el-form :model="form" ref="form" inline label-width="100px">
                <el-form-item prop="warehouseName" label="仓库名称">
                    <el-input v-model="form.warehouseName" placeholder="请输入仓库名称"></el-input>
                </el-form-item>
                <el-form-item prop="warehouseCode" label="仓库编码">
                    <el-input v-model="form.warehouseCode" placeholder="请输入仓库编码"></el-input>
                </el-form-item>
                <el-form-item prop="supplierName" label="供应商名称">
                    <el-input v-model="form.supplierName" placeholder="请输入供应商名称"></el-input>
                </el-form-item>
                <el-form-item prop="status" label="仓库状态">
                    <el-select v-model="form.status" placeholder="请选择仓库状态">
                        <el-option value="" label="全部"></el-option>
                        <el-option value="1" label="启用"></el-option>
                        <el-option value="2" label="停用"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="date" label="仓库创建时间">
                    <el-date-picker
                        type="datetimerange"
                        format="yyyy-MM-dd"
                        v-model="form.date"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item prop="type" label="仓库类别">
                    <el-select v-model="form.type" placeholder="请选择仓库类别">
                        <el-option value="" label="全部"></el-option>
                        <el-option value="1" label="自建仓"></el-option>
                        <el-option value="2" label="加盟仓"></el-option>
                        <el-option value="3" label="供应商仓"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" @click="getList(1)">搜索</el-button>
                    <el-button @click="resetForm('form')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card :body-style="{ padding: '20px 40px' }" style='margin-top:20px'>
           <el-button type="primary" style="margin-bottom: 20px" @click="$router.push({path:'repertorySet',query:{type:'add'}})">新建仓库</el-button>
            <el-table :data="tableData" border>
                <el-table-column type="index" label="序号" align="center"></el-table-column>
                <el-table-column prop="id" label="仓库ID" align="center"></el-table-column>
                <el-table-column prop="name" label="仓库名称" align="center"></el-table-column>
                <el-table-column prop="code" label="仓库编码" align="center"></el-table-column>
                <el-table-column prop="type" label="仓库类型" align="center">
                    <template slot-scope="scope">
                        <template v-if="scope.row.type==1">自建仓</template>
                        <template v-if="scope.row.type==2">加盟仓</template>
                        <template v-if="scope.row.type==3">供应商仓</template>
                    </template>
                </el-table-column>
                <el-table-column label="加盟仓类型" align="center">
                    <template slot-scope="scope">
                        <template v-if="scope.row.joinWarehouseType==1">百世汇通</template>
                        <template v-if="scope.row.joinWarehouseType==2">顺丰</template>
                        <template v-if="scope.row.joinWarehouseType==3">申通</template>
                        <template v-if="scope.row.joinWarehouseType==4">韵达</template>
                    </template>
                </el-table-column>
                <el-table-column prop="supplierCode" label="供应商ID" align="center"></el-table-column>
                <el-table-column prop="supplierName" label="供应商名称" align="center"></el-table-column>
                <el-table-column label="仓库状态" align="center">
                    <template slot-scope="scope">
                        <template v-if="scope.row.status==1">启用</template>
                        <template v-if="scope.row.status==2">停用</template>
                    </template>
                </el-table-column>
                <el-table-column label="仓库品类数" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="toProduct(scope.row)" v-if="scope.row.productCount">{{scope.row.productCount}}</el-button>
                        <span v-else>/</span>
                    </template>
                </el-table-column>
                <el-table-column prop="lossCount" label="仓库报损数" align="center"></el-table-column>
                <!--<el-table-column label="仓库报损数" align="center">-->
                    <!--<template slot-scope="scope">-->
                        <!--<el-button @click="toLoss(scope.row)" v-if="scope.row.lossCount">{{scope.row.lossCount}}</el-button>-->
                        <!--<span v-else>/</span>-->
                    <!--</template>-->
                <!--</el-table-column>-->
                <el-table-column label="是否为发货仓" align="center">
                    <template slot-scope="scope">
                        <template>{{scope.row.sendGoods?'是':'否'}}</template>
                    </template>
                </el-table-column>
                <el-table-column label="是否为退货仓" align="center">
                    <template slot-scope="scope">
                        <template>{{scope.row.returnGoods?'是':'否'}}</template>
                    </template>
                </el-table-column>
                <el-table-column prop="createUserName" label="创建人" align="center"></el-table-column>
                <el-table-column label="仓库创建时间" align="center">
                    <template slot-scope="scope">
                        <template>{{scope.row.createTime|formatDateAll}}</template>
                    </template>
                </el-table-column>
                <el-table-column label="操作" min-width="150">
                    <template slot-scope="scope">
                        <el-button @click="showInfo(scope.row)" type="primary">详情</el-button>
                        <el-button @click="editRepertory(scope.row)" type="success" v-if="scope.row.status==2">编辑</el-button>
                        <el-button @click="openOrClose(scope.row,1)" type="warning" v-if="scope.row.status==1">停用</el-button>
                        <el-button @click="openOrClose(scope.row,2)" type="warning" v-if="scope.row.status==2">启用</el-button>
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
        <el-dialog :title="title" :visible.sync="mask">
            <el-form v-model="formMask">
                <el-form-item label="管理员手机" v-if="code">
                    <span>{{userPhone}}</span>
                </el-form-item>
                <el-form-item  v-else>
                    <span>已向手机号{{userPhone}}发送验证码，请注意查收</span>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="formMask.verifyCode" placeholder="请输入验证码" auto-complete="off"></el-input>
                    <el-button type="primary" @click="getCode" v-if="code">发送验证码</el-button>
                    <el-button class="code-btn" type="primary" v-else>{{codeTime}}s</el-button>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="sure('formMask')">确 认</el-button>
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
import { mapGetters } from 'vuex';

export default {
    components: { vBreadcrumb },

    mixins: [myMixinTable],

    data() {
        return {
            nav: ['云仓仓库管理', '仓库管理'],
            tableData: [],
            form: {
                date: [],
                status: '',
                warehouseName: '',
                warehouseCode: '',
                supplierName: '',
                type: ''
            },
            formMask: {},
            title: '启用仓库',
            mask: false,
            codeTime: 0,
            code: true
        };
    },
    computed: {
        ...mapGetters([
            'user'
        ]),
        userPhone() {
            const userPhone = this.user.telephone;
            return userPhone;
        }
    },
    activated() {
        this.getList(this.page.currentPage);
    },
    methods: {
        // 获取数据
        getList(val) {
            const data = {
                warehouseName: this.form.warehouseName,
                supplierName: this.form.supplierName,
                warehouseCode: this.form.warehouseCode,
                status: this.form.status,
                type: this.form.type,
                startTime: this.form.date[0]
                    ? moment(this.form.date[0]).format('YYYY-MM-DD 00:00:00')
                    : '',
                endTime: this.form.date[1]
                    ? moment(this.form.date[1]).format('YYYY-MM-DD 23:59:59')
                    : '',
                page: val,
                pageSize: this.page.pageSize
            };
            this.page.currentPage = val;
            request.queryRepertoryList(data).then(res => {
                this.tableData = [];
                if (!res.data) return;
                this.tableData = res.data.data;
                this.page.totalPage = res.data.totalNum;
            }).catch(error => {
                console.log(error);
            });
        },
        // 查看详情
        showInfo(row) {
            sessionStorage.setItem('repertoryInfoId', row.code);
            this.$router.push({
                name: 'repertoryInfo',
                query: { repertoryInfoId: row.code }
            });
        },
        // 编辑
        editRepertory(row) {
            sessionStorage.setItem('repertoryId', row.code);
            this.$router.push({
                name: 'repertorySet',
                query: { repertoryId: row.code }
            });
        },
        // 重置表单
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.form.date = [];
            this.getList(this.page.currentPage);
        },
        // 停用启用
        openOrClose(row, num) {
            this.mask = true;
            this.formMask.code = row.code;
            this.formMask.status = row.status;
            this.formMask.verifyCode = '';
            this.codeTime = 60;
            this.title = num == 1 ? '停用仓库' : '启用仓库';
        },
        sure(formName) {
            const data = {};
            data.verifyCode = this.formMask.verifyCode;
            data.warehouseCode = this.formMask.code;
            if (!data.verifyCode) {
                return this.$message.warning('请获取验证码');
            }
            this.btnLoading = true;
            request.startOrStopRepertory(data).then(res => {
                this.$message.success(res.msg);
                this.mask = false;
                this.getList(this.page.currentPage);
                this.btnLoading = false;
            });
        },
        getCode() {
            const that = this;
            this.code = false;
            const data = {};
            request.sendWarehouseMessage(data).then(res => {
                this.codeTime = 60;
                const timer = setInterval(function() {
                    that.codeTime--;
                    if (that.codeTime <= 0) {
                        that.code = true;
                        clearInterval(timer);
                    }
                }, 1000);
                this.$message.success(res.msg);
            });
        },
        // 跳转到品类数
        toProduct(row) {
            sessionStorage.setItem('repertotyId', row.code);
            this.$router.push({ path: '/repertoryInventory', query: { repertotyId: row.code }});
        },
        toLoss(row) {
            sessionStorage.setItem('repertotyId', row.id);
            this.$router.push({ path: '/repertoryBad', query: { repertotyId: row.id }});
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
