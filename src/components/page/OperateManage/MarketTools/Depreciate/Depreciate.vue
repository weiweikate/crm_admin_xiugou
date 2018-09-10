<template>
    <div class="depreciate-list">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card :body-style="{ padding: '30px 45px',minHeight:'80vh' }">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="全部" name="allDepreciate">
                    <v-tab-content v-if="activeName == 'allDepreciate'" :name='activeName'></v-tab-content>
                </el-tab-pane>
                <el-tab-pane label="未开始" name="notStart">
                    <v-tab-content v-if="activeName == 'notStart'" :name='activeName'></v-tab-content>
                </el-tab-pane>
                <el-tab-pane label="进行中" name="starting">
                    <v-tab-content v-if="activeName == 'starting'" :name='activeName'></v-tab-content>
                </el-tab-pane>
                <el-tab-pane label="已结束" name="ended">
                    <v-tab-content v-if="activeName == 'ended'" :name='activeName'></v-tab-content>
                </el-tab-pane>
            </el-tabs>
        </el-card>

    </div>
</template>

<script>
    import vBreadcrumb from "@/components/common/Breadcrumb.vue";
    import vTabContent from "./depreciateList/_tabContent";

    export default {
        components: {
            vBreadcrumb,
            vTabContent
        },

        data() {
            return {
                nav: ["运营管理", "营销工具管理","降价拍"],
                activeName: "allDepreciate",
            };
        },
        methods: {
            handleClick(tab) {
                this.activeName = tab.name;
            }
        }
    };
</script>
<style lang='less'>
    .depreciate-list {
        .el-tabs__active-bar {
            background-color: #ff1e30;
        }
        .el-tabs__item.is-active,
        .el-tabs__item:hover {
            color: #ff1e30;
        }
    }
</style>
