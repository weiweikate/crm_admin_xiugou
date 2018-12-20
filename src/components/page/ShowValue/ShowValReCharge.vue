<template>
    <div class="show-val-recharge">
        <v-breadcrumb :nav="nav"></v-breadcrumb>
        <el-tabs v-model="activeName" @tab-click="handleClickTab">
            <el-tab-pane label="全部记录" name="all">
                <tpl ref="all" status=""></tpl>
            </el-tab-pane>
            <el-tab-pane label="待审核记录" name="audit">
                <tpl ref="audit" status="1"></tpl>
            </el-tab-pane>
            <el-tab-pane label="已通过记录" name="pass">
                <tpl ref="pass" status="2"></tpl>
            </el-tab-pane>
            <el-tab-pane label="已驳回记录" name="reject">
                <tpl ref="reject" status="3"></tpl>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import vBreadcrumb from '@/components/common/Breadcrumb.vue';
import tpl from './_showValue/showValRecharge';
export default {
    components: { vBreadcrumb, tpl },
    data() {
        return {
            nav: ['秀值模块', '秀值账户充值'],
            activeName: 'all'
        };
    },
    activated() {
        this.$refs[this.activeName].getList(1);
    },
    methods: {
        handleClickTab(tab) {
            this.$refs[tab.name].getList(1);
        }
    }
};
</script>

<style lang="less" scoped>
.show-val-recharge{
    /deep/.el-tabs__header{
        padding: 0 20px;
        background-color: white;
        border-radius: 5px;
        margin-bottom: 0;
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
