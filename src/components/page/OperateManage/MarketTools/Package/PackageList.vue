<template>
    <div class="package-list">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card :body-style="{ padding: '30px 45px',minHeight:'80vh' }">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="全部套餐产品" name="allPackage">
                    <v-tab-content v-if="activeName == 'allPackage'" :name='activeName'></v-tab-content>
                </el-tab-pane>
                <el-tab-pane label="已上架" name="upPackage">
                    <v-tab-content v-if="activeName == 'upPackage'" :name='activeName'></v-tab-content>
                </el-tab-pane>
                <el-tab-pane label="待提交" name="submitPackage">
                    <v-tab-content v-if="activeName == 'submitPackage'" :name='activeName'></v-tab-content>
                </el-tab-pane>
                <el-tab-pane label="待审核" name="auditPackage">
                    <v-tab-content v-if="activeName == 'auditPackage'" :name='activeName'></v-tab-content>
                </el-tab-pane>
                <el-tab-pane label="已下架" name="downProduct">
                    <v-tab-content v-if="activeName == 'downProduct'" :name='activeName'></v-tab-content>
                </el-tab-pane>
                <el-tab-pane label="已驳回" name="rejectPackage">
                    <v-tab-content v-if="activeName == 'rejectPackage'" :name='activeName'></v-tab-content>
                </el-tab-pane>
            </el-tabs>
        </el-card>

    </div>
</template>

<script>
    import vBreadcrumb from "@/components/common/Breadcrumb.vue";
    import vTabContent from "./package/_tabContent";

    export default {
        components: {
            vBreadcrumb,
            vTabContent
        },

        data() {
            return {
                nav: ["运营管理", "营销工具管理","优惠套餐"],
                activeName: "allPackage",
            };
        },
        activated(){
            this.activeName = "allPackage";
        },
        methods: {
            handleClick(tab) {
                this.tabName = tab.name;
            }
        }
    };
</script>
<style lang='less'>
    .package-list {
        .el-tabs__active-bar {
            background-color: #ff1e30;
        }
        .el-tabs__item.is-active,
        .el-tabs__item:hover {
            color: #ff1e30;
        }
    }
</style>
