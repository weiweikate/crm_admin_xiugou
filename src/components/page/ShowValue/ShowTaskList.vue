<template>
    <div class="show-task-list">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card style="margin-bottom: 10px">
            <el-form :model="form" ref="form" inline label-width="120px">
                <el-form-item prop="userName" label="任务人">
                    <el-input v-model="form.userName"></el-input>
                </el-form-item>
                <el-form-item prop="name" label="任务名称">
                    <el-select v-model="form.name">
                        <el-option v-for="(v, k) in taskTypeArr" :key="k" :label="v" :value="v"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="taskTime" label="任务时间">
                    <el-date-picker type="datetimerange" v-model="form.taskTime" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
                </el-form-item>
                <el-form-item label=" ">
                    <el-button type="primary" @click="submitForm">查 询</el-button>
                    <el-button @click="$refs['form'].resetFields()">重 置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card>
            <el-tabs v-model="activeName" @tab-click="handleClickTab">
                <el-tab-pane label="全部任务查看" name="all">
                    <tpl ref="all" status=""></tpl>
                </el-tab-pane>
                <el-tab-pane label="进行中的任务" name="ing">
                    <tpl ref="ing" status="1"></tpl>
                </el-tab-pane>
                <el-tab-pane label="任务结束" name="end">
                    <tpl ref="end" status="2"></tpl>
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>

<script>
import vBreadcrumb from '@/components/common/Breadcrumb.vue';
import tpl from './_showValue/showTaskList';
import utils from '@/utils/index';
import request from '../../../http/http';
export default {
    components: {
        vBreadcrumb,
        tpl
    },
    data() {
        return {
            nav: ['秀值模块', '秀值任务管理', '用户任务看板'],
            form: {
                userName: '',
                name: '',
                taskTime: [],
                startTime: '',
                endTime: ''
            },
            taskTypeArr: [],
            activeName: 'all'
        };
    },
    activated() {
        this.submitForm();
        this.getTaskName();
    },
    methods: {
        submitForm() {
            if (!this.form.taskTime) this.form.taskTime = [];
            this.form.startTime = this.form.taskTime.length !== 0 ? utils.formatTime(this.form.taskTime[0]) : '';
            this.form.endTime = this.form.taskTime.length !== 0 ? utils.formatTime(this.form.taskTime[1]) : '';
            this.$refs[this.activeName].form = this.form;
            this.$refs[this.activeName].getList(1);
        },
        // 获取任务名称
        getTaskName() {
            request.userTaskNameQuery({}).then(res => {
                this.taskTypeArr = [];
                res.data.forEach(v => {
                    this.taskTypeArr.push(v);
                });
            }).catch(err => {
                console.log(err);
            });
        },
        handleClickTab(tab) {
            this.$refs[tab.name].form = this.form;
            this.$refs[tab.name].getList(1);
        }
    }
};
</script>

<style lang="less" scoped>
.show-task-list{
    /deep/.el-tabs__header{
        padding: 0 20px;
        background-color: white;
        border-radius: 5px;
        margin-bottom: 20px;
    }
    /deep/.el-tabs__active-bar {
        background-color: #ff1e30;
    }
    /deep/.el-tabs__item.is-active,
    /deep/.el-tabs__item:hover {
        color: #ff1e30;
    }
}
</style>
