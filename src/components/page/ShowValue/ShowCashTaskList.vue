<template>
    <div class="show-task-list">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card>
            <el-button type="primary" class="mb10" @click="taskToast = true">创建任务</el-button>
            <el-table :data="tableData" border stripe>
                <el-table-column prop="id" label="编号" align="center"></el-table-column>
                <el-table-column prop="id" label="任务类型" align="center"></el-table-column>
                <el-table-column prop="id" label="任务激活金额（任务名称）" align="center"></el-table-column>
                <el-table-column prop="id" label="实际秀值金额" align="center"></el-table-column>
                <el-table-column prop="id" label="初次点击金额" align="center"></el-table-column>
                <el-table-column prop="id" label="后续单次点击金额" align="center"></el-table-column>
                <el-table-column prop="id" label="绑定刮刮卡" align="center"></el-table-column>
                <el-table-column prop="id" label="底线点击次数" align="center"></el-table-column>
                <el-table-column prop="id" label="清空次数" align="center"></el-table-column>
                <el-table-column prop="id" label="备注" align="center"></el-table-column>
                <el-table-column label="操作" align="center" width="200px">
                    <template slot-scope="scope">
                        <el-button type="warning" @click="getInfo(scope.row)">编 辑</el-button>
                        <el-button type="danger">删 除</el-button>
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
            title="秀值充值"
            :visible.sync="taskToast"
            width="650px"
            :before-close="handleClose">
            <el-form :model="form" ref="form" label-width="120px">
                <el-form-item prop="taskType" label="请选择任务类型">
                    <el-select v-model="form.taskType" class="item">
                        <el-option label="分享点击" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="minMoney" label="任务激活金额">
                    <el-input-number :controls="false" :min="0" class="inp" v-model="form.minMoney"></el-input-number>
                    <span>-</span>
                    <el-input-number :controls="false" :min="0" class="inp" v-model="form.maxMoney"></el-input-number>
                </el-form-item>
                <el-form-item prop="realMinMoney" label="实际秀值金额">
                    <el-input-number :controls="false" :min="0" class="inp" v-model="form.realMinMoney"></el-input-number>
                    <span>-</span>
                    <el-input-number :controls="false" :min="0" class="inp" v-model="form.realMaxMoney"></el-input-number>
                </el-form-item>
                <el-form-item prop="firstClick" label="初次点击金额">
                    <el-input-number :controls="false" :min="0" v-model="form.firstClick" class="item"></el-input-number>
                </el-form-item>
                <el-form-item prop="singleClick" label="后续单次点击金额">
                    <el-input-number :controls="false" :min="0" v-model="form.singleClick" class="item"></el-input-number>
                </el-form-item>
                <el-form-item prop="cardId" label="绑定刮刮卡ID">
                    <el-input-number :controls="false" v-model="form.cardId" class="item"></el-input-number>
                </el-form-item>
                <el-form-item prop="lessClick" label="底线点击次数">
                    <el-input v-model="form.lessClick" class="item"></el-input>
                </el-form-item>
                <el-form-item label="账户清空点击次数">
                    <el-input-number :controls="false" :min="0" disabled v-model="clearClick" class="item"></el-input-number>
                </el-form-item>
                <el-form-item prop="tip" label="备注">
                    <el-input type="textarea" v-model="form.tip" class="item"></el-input>
                </el-form-item>
                <el-form-item prop="maxMoney" v-show="false" label="">
                </el-form-item>
                <el-form-item prop="realMaxMoney" v-show="false" label="">
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleClose">确 定</el-button>
                <el-button @click="handleClose">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import { myMixinTable } from '@/JS/commom';
    export default {
        mixins: [myMixinTable],
        components: {
            vBreadcrumb
        },
        data() {
            return {
                nav: ['秀值模块', '秀值任务管理', '秀值任务查看'],
                tableData: [{id: 1}],
                taskToast: false,
                clearClick: '点击次数+1',
                form: {
                    taskType: '',
                    maxMoney: '',
                    minMoney: '',
                    realMaxMoney: '',
                    realMinMoney: '',
                    firstClick: '',
                    singleClick: '',
                    cardId: '',
                    lessClick: '',
                    tip: ''
                }
            }
        },
        methods: {
            // 编辑
            getInfo(row) {
                this.taskToast = true;
            },
            handleClose() {
                this.$refs['form'].resetFields();
                this.taskToast = false;
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
