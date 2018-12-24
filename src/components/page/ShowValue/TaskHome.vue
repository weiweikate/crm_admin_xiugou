<template>
    <div class="task-home">
        <v-breadcrumb :nav='nav'></v-breadcrumb>
        <el-card :body-style="{ padding: '20px 45px',color:'#666' }">
            <div>
                <div class="area">秀场管理</div>
                <div class="wrap">
                    <div class="item" v-for="(item,index) in list" :key="index" @click="toPage(item.page)">
                        <div class="left">
                            <img :src="item.img" alt="">
                        </div>
                        <div class="left content-area">
                            <span class="title">{{item.title}}</span><br>
                            <span>{{item.content}}</span>
                        </div>
                        <div class="clearfix"></div>
                    </div>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
import vBreadcrumb from '@/components/common/Breadcrumb.vue';
export default {
    components: {
        vBreadcrumb
    },
    data() {
        return {
            nav: ['秀值管理', '秀场管理'],
            list: [
                {
                    img: 'static/img/show_list.png',
                    title: '用户任务看版',
                    content: '查看平台用户的秀值任务状态',
                    page: '/showTaskList'
                }, {
                    img: 'static/img/show_item.png',
                    title: '秀值任务查看',
                    content: '查看平台秀值任务',
                    page: '/showCashTaskList'
                }]
        };
    },
    methods: {
        toPage(page) {
            this.$router.push(page);
        }
    }
};
</script>

<style scoped lang="less">
    .task-home {
        .area {
            font-size: 18px;
            color: #222222;
            font-weight: 600;
            line-height: 40px;
        }
        .item {
            display: inline-block;
            width: 288px;
            height: 58px;
            background-color: #eeeeee;
            border-radius: 2px;
            margin-right: 30px;
            padding: 21px 26px;
            font-size: 14px;
            color: #222222;
            cursor: pointer;
            .title {
                font-size: 16px;
                font-weight: 600;
                margin-bottom: 15px;
                display: inline-block;
            }
            .left{
                float: left;
            }
            .content-area{
                margin:0 10px;
            }
            .clearfix{
                clear: both;
            }
        }
    }
</style>
