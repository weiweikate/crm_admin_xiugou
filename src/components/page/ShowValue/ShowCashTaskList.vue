<template>
    <div class="show-task-list">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card>
            <el-button type="primary" class="mb10" @click="taskToast = true">创建任务</el-button>
            <el-table v-loading="tableLoading" :data="tableData" border stripe>
                <el-table-column type="index" label="编号" align="center"></el-table-column>
                <el-table-column prop="type" label="任务类型" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.type == 1">点击分享</span>
                        <span v-else>新加类型和我说一下</span>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="任务激活金额（任务名称）" align="center"></el-table-column>
                <el-table-column label="实际秀值金额" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.minActualMoney}}</span>
                        <span>-</span>
                        <span>{{scope.row.maxActualMoney == -1?'无限':scope.row.maxActualMoney}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="firstMoney" label="初次点击金额" align="center"></el-table-column>
                <el-table-column prop="afterMoney" label="后续单次点击金额" align="center"></el-table-column>
                <el-table-column prop="scratchCode" label="绑定刮刮卡" align="center"></el-table-column>
                <el-table-column prop="highHits" label="底线点击次数" align="center"></el-table-column>
                <el-table-column prop="remarks" label="备注" align="center"></el-table-column>
                <el-table-column label="操作" align="center" width="200px">
                    <template slot-scope="scope">
                        <el-button type="warning" @click="getInfo(scope.row)">编 辑</el-button>
                        <el-button type="danger" @click="delItem(scope.$index, scope.row.id)">删 除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="block">
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
        <el-dialog
            title="请填写任务信息"
            :visible.sync="taskToast"
            width="650px"
            :before-close="handleClose">
            <el-form :model="form" ref="form" label-width="120px">
                <el-form-item prop="type" label="请选择任务类型">
                    <el-select v-model="form.type" class="item">
                        <el-option label="点击分享" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="minMoney" label="任务名称">
                    <el-input class="inp" v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item prop="minActualMoney" label="实际秀值金额">
                    <el-input class="inp" v-model="form.minActualMoney"></el-input>
                    <span>-</span>
                    <el-input class="inp" v-model="form.maxActualMoney"></el-input>
                </el-form-item>
                <el-form-item prop="firstMoney" label="初次点击金额">
                    <el-input-number :controls="false" :min="0" v-model="form.firstMoney" class="item"></el-input-number>
                </el-form-item>
                <el-form-item prop="afterMoney" label="后续单次点击金额">
                    <el-input-number :controls="false" :min="0" v-model="form.afterMoney" class="item"></el-input-number>
                </el-form-item>
                <el-form-item prop="scratchCode" label="绑定刮刮卡ID">
                    <el-input v-model="form.scratchCode" class="item"></el-input>
                </el-form-item>
                <el-form-item prop="highHits" label="底线点击次数">
                    <el-input-number :min="0" :controls="false" v-model="form.highHits" class="item"></el-input-number>
                </el-form-item>
                <el-form-item label="账户清空点击次数">
                    <el-input disabled v-model="clearClick" class="item"></el-input>
                </el-form-item>
                <el-form-item prop="remarks" label="备注">
                    <el-input type="textarea" v-model="form.remarks" class="item"></el-input>
                </el-form-item>
                <el-form-item prop="maxActualMoney" v-show="false" label="">
                </el-form-item>
                <el-form-item prop="maxMoney" v-show="false" label="">
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="btnLoading" @click="valFom">确 定</el-button>
                <el-button @click="handleClose">取 消</el-button>
            </span>
        </el-dialog>
        <!--删除弹窗-->
        <delete-toast :id='delId' :url='delUrl' :uri='delUri' @msg='deleteToast' v-if="isShowDelToast"></delete-toast>
    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import deleteToast from '@/components/common/DeleteToast';
    import request from '@/http/http';
    import { myMixinTable } from '@/JS/commom';
    export default {
        mixins: [myMixinTable],
        components: {
            vBreadcrumb,
            deleteToast
        },
        data() {
            return {
                nav: ['秀值模块', '秀值任务管理', '秀值任务查看'],
                tableData: [],
                taskToast: false,
                clearClick: '点击次数+1',
                tableLoading: false,
                btnLoading: false,
                isShowDelToast: false,
                form: {
                    type: '',
                    maxMoney: '',
                    minMoney: '',
                    minActualMoney: '',
                    maxActualMoney: '',
                    firstMoney: '',
                    afterMoney: '',
                    scratchCode: '',
                    highHits: '',
                    remarks: ''
                },
                delId: '',
                delUrl: '',
                delUri: ''
            };
        },
        activated() {
            this.getList(1);
            this.form = {
                type: '',
                name: '',
                minActualMoney: '',
                maxActualMoney: '',
                firstMoney: '',
                afterMoney: '',
                scratchCode: '',
                highHits: '',
                remarks: ''
            };
        },
        methods: {
            // 表单校验
            valFom() {
                this.form.maxActualMoney = this.form.maxActualMoney == '' ? '-1' : this.form.maxActualMoney;
                if (this.form.minActualMoney > 0) {
                    for (const item in this.form) {
                        if (item === 'maxActualMoney' || item === 'remarks' || item === 'id') {
                            continue;
                        }
                        if (this.form[item] == '') {
                            console.log(this.form, item);
                            return this.$message.warning('参数不能空！');
                        }
                    }
                    this.submitForm();
                } else {
                    return this.$message.warning('实际秀值填写有误!');
                }
            },
            // 提交表单
            submitForm() {
                const data = {
                    ...this.form
                };
                this.btnLoading = true;
                request.saveJobs(data).then(res => {
                    this.btnLoading = false;
                    this.$message.success(res.msg);
                    this.handleClose();
                }).catch(err => {
                    this.btnLoading = false;
                    console.log(err);
                });
            },
            // 编辑
            getInfo(row) {
                row.type = row.type.toString();
                row.maxActualMoney = row.maxActualMoney == -1 ? '' : row.maxActualMoney;
                this.form = row;
                this.form.id = row.id;
                this.taskToast = true;
            },
            handleClose() {
                for (const item in this.form) {
                    this.form[item] = '';
                }
                this.taskToast = false;
                this.getList(this.page.currentPage);
            },
            // 获取列表
            getList(val) {
                const data = {
                    page: val,
                    pageSize: this.page.pageSize
                };
                this.tableLoading = true;
                request.shareTaskQuery(data).then(res => {
                    this.tableLoading = false;
                    this.tableData = [];
                    if (res.data) {
                        res.data.data.forEach(v => {
                            const nameArr = v.name.split(',');
                            if (nameArr[1] == -1) {
                                nameArr[1] = '无限';
                            }
                            this.tableData.push(v);
                        });
                    }
                    this.page.currentPage = res.data.currentPage;
                    this.page.totalPage = res.data.totalNum;
                }).catch(err => {
                    this.tableLoading = false;
                    console.log(err);
                });
            },
            // 删除
            delItem(index, id) {
                this.delId = id;
                this.delUrl = 'deleteTaskJobs';
                this.isShowDelToast = true;
            },
            // 删除弹窗
            deleteToast(msg) {
                this.isShowDelToast = msg;
                this.getList(this.page.currentPage);
            }
        }
    };
</script>

<style lang="less" scoped>
    .show-task-list{
        /deep/.el-dialog {
            border-radius: 10px;
            overflow: auto;
            .el-dialog__header {
                border-bottom: 1px solid #eee;
                padding: 20px 20px 10px 50px;
                .el-dialog__title {
                    color: #ff6868;
                }
            }
        }
        .inp{
            width: 200px;
        }
        .item{
            width: 410px;
        }
    }
</style>
