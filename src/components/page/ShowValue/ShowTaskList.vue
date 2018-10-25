<template>
    <div class="show-task-list">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card style="margin-bottom: 10px">
            <el-form :model="form" ref="form" inline label-width="120px">
                <el-form-item prop="taskUser" label="任务人">
                    <el-input v-model="form.taskUser"></el-input>
                </el-form-item>
                <el-form-item prop="taskType" label="任务类型">
                    <el-select v-model="form.taskType">
                        <el-option v-for="(v, k) in taskTypeArr" :key="k" :label="v.label" :value="v.value"></el-option>
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
import tpl from './_showValue/showTaskList'
export default {
    components: {
        vBreadcrumb,
        tpl
    },
    data() {
        return {
            nav: ['秀值模块', '秀值任务管理', '用户任务看板'],
            form: {
                taskUser: '',
                taskType: '',
                taskTime: []
            },
            taskTypeArr: [{label: '15-99', value: '1'}],
            activeName: 'all'
        }
    },
    activated() {
        this.submitForm();
    },
    methods: {
        submitForm() {
            this.$refs[this.activeName].form = this.form;
            this.$refs[this.activeName].getList();
        },
        handleClickTab(tab) {
            this.$refs[tab.name].form = this.form;
            this.$refs[tab.name].getList();
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
