<template>
    <div class="gift-list">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card :body-style="{ padding: '30px 45px',minHeight:'80vh' }">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="全部礼包产品" name="allGift">
                    <v-tab-content ref = 'allGift'></v-tab-content>
                </el-tab-pane>
                <el-tab-pane label="上架产品" name="upGift">
                    <v-tab-content ref = 'upGift'></v-tab-content>
                </el-tab-pane>
                <el-tab-pane label="下架产品" name="downGift">
                    <v-tab-content ref = 'downGift'></v-tab-content>
                </el-tab-pane>
                <el-tab-pane label="审核产品" name="auditGift">
                    <v-tab-content ref = 'auditGift'></v-tab-content>
                </el-tab-pane>
            </el-tabs>
        </el-card>

    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import vTabContent from './giftList/_tabContent';

    export default {
        components: {
            vBreadcrumb,
            vTabContent
        },

        data() {
            return {
                nav: ['品牌产品管理', '产品礼包设置'],
                activeName: 'allGift'
            };
        },
        methods: {
            handleClick(tab) {
                let status = '';
                switch (tab.name) {
                    case 'allGift': status = 1; break;
                    case 'upGift': status = 2; break;
                    case 'downGift': status = 3; break;
                    case 'auditGift': status = 4; break;
                }
                this.$refs[tab.name].giftStatus = status;
                this.$refs[tab.name].getList(this.$refs[tab.name].page.currentPage);
            }
        }
    };
</script>
<style lang='less'>
    .gift-list {
        .el-tabs__active-bar {
            background-color: #ff1e30;
        }
        .el-tabs__item.is-active,
        .el-tabs__item:hover {
            color: #ff1e30;
        }
    }
</style>
