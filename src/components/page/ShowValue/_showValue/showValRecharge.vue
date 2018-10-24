<template>
    <div class="show-val-recharge">
        <el-card>
            <el-form :model="form" ref='form' inline label-width="100px">
                <el-form-item prop="id" label="会员ID">
                    <el-input v-model="form.id" placeholder="模糊搜索"></el-input>
                </el-form-item>
                <el-form-item prop="nickName" label="会员昵称">
                    <el-input v-model="form.nickName" placeholder="模糊搜索"></el-input>
                </el-form-item>
                <el-form-item prop="levelId" label="会员层级">
                    <el-select v-model="form.levelId">
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="(v, k) in userLevel" :key="k" :label="v.name" :value="v.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="type" label="充值类型">
                    <el-select v-model="form.type">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="单人" value="1"></el-option>
                        <el-option label="批量" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="createUser" label="创建人">
                    <el-input v-model="form.createUser" placeholder="模糊搜索"></el-input>
                </el-form-item>
                <el-form-item prop="dealUser" label="处理人">
                    <el-input v-model="form.dealUser" placeholder="模糊搜索"></el-input>
                </el-form-item>
                <el-form-item prop="time" label="充值时间">
                    <el-date-picker type="datetimerange" v-model="form.time" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
                </el-form-item>
                <el-form-item label=" ">
                    <el-button type="primary" @click="getList">搜 索</el-button>
                    <el-button @click="$refs['form'].resetFields()">重 置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card style="margin-top: 10px">
            <el-button type="primary" style="margin-bottom: 10px" @click="rechargeDia = true">秀值充值</el-button>
            <el-table :data="tableData" border stripe>
                <el-table-column type="index" label="编号" align="center"></el-table-column>
                <el-table-column prop="id" label="充值类型" align="center"></el-table-column>
                <el-table-column prop="id" label="账户类型" align="center"></el-table-column>
                <el-table-column prop="id" label="会员昵称/ID" align="center"></el-table-column>
                <el-table-column prop="id" label="层级" align="center"></el-table-column>
                <el-table-column prop="id" label="充值数" align="center"></el-table-column>
                <el-table-column prop="id" label="充值人数" align="center"></el-table-column>
                <el-table-column prop="id" label="充值金额" align="center"></el-table-column>
                <el-table-column prop="id" label="充值时间" align="center"></el-table-column>
                <el-table-column prop="id" label="创建人" align="center"></el-table-column>
                <el-table-column prop="id" label="处理人" align="center"></el-table-column>
                <el-table-column prop="id" label="状态" align="center"></el-table-column>
                <el-table-column prop="id" label="备注" align="center"></el-table-column>
                <el-table-column prop="id" label="操作" align="center" width="150px">
                    <template slot-scope="scope">
                        <el-button type="primary">通过</el-button>
                        <el-button type="danger">驳回</el-button>
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
            :visible.sync="rechargeDia"
            width="30%"
            :before-close="handleClose">
            <el-radio-group v-model="rechargeType" @change="changeRechargeType">
                <el-radio label="single">单人充值</el-radio>
                <el-radio label="batch">批量充值</el-radio>
            </el-radio-group>
            <single ref="single"></single>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="rechargeDia = false">确 定</el-button>
            <el-button @click="rechargeDia = false">取 消</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
import request from '@/http/http';
import { myMixinTable } from '@/JS/commom';
import utils from '@/utils/index';
import single from './singleRecharge';
export default {
    props: ['status'],
    mixins: [myMixinTable],
    components: {single},
    data() {
        return {
            form: {
                id: '',
                nickName: '',
                levelId: '',
                type: '',
                createUser: '',
                dealUser: '',
                time: [],
                beginTime: '',
                endTime: ''
            },
            userLevel: [],
            tableData: [{ id: 1 }],
            rechargeDia: false,
            rechargeType: 'single' // 充值类型
        };
    },
    created() {
        this.getUserLevel();
    },
    methods: {
        // 提交表单
        getList() {
            this.form.beginTime = this.form.time.length !== 0 ? utils.formatTime(this.form.time[0]) : '';
            this.form.endTime = this.form.time.length !== 0 ? utils.formatTime(this.form.time[1]) : '';
            const data = {
                ...this.form,
                status: this.status
            };
            console.log(data);
        },
        // 获取会员层级
        getUserLevel() {
            request.getLevelList({}).then(res => {
                this.userLevel = res.data;
            }).catch(err => {
                console.log(err);
            });
        },
        handleClose() {},
        // 修改充值状态
        changeRechargeType(val) {
            console.log(val);
        }
    }
};
</script>

<style lang="less" scoped>
.show-val-recharge{
    /*弹窗样式*/
    /deep/.el-dialog {
        border-radius: 10px;
        .el-dialog__header {
            border-bottom: 1px solid #eee;
            padding: 20px 20px 10px 50px;
            .el-dialog__title {
                color: #ff6868;
            }
        }
    }
}
</style>
