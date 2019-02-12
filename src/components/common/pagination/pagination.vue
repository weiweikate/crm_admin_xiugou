<!-- pagination -->
<!-- 传参 currentPage,pageSize,totalPage ,parent  (parent相对滚动的最近祖先元素的className,不传后面以body为起始目标滚动) -->
<!-- 回调 getList函数 -->
<!-- mixin引用 myMixinTable -->
<!-- 注意 1.offset是相对最近一个定位的祖先元素来获位置偏移量（http://www.softwhy.com/article-2515-1.html）  2分页器到滚动父元素（props：parent）之间不能设置overflow：hidden/auto属性否则监听滚动失效 -->
<!-- eg: <mr-pagination @getList="getList" parent="content-box" :pageSize="pageSize" :totalPage="totalPage"></mr-pagination> -->
<template>
    <div class="mr-pagination">
        <div class="mr-pagination-box" ref="pagination">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page.currentPage" :page-size="page.pageSize" layout="total, prev, pager, next, jumper" :total="page.totalPage"></el-pagination>
        </div>
        <div class="mr-pagination-box hiden" :class="{'active':isFixedShow}" v-show="isFixedShow" :style="{'top': top,'left':left}">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page.currentPage" :page-size="page.pageSize" layout="total, prev, pager, next, jumper" :total="page.totalPage"></el-pagination>
        </div>
    </div>
</template>

<script>
import { myMixinTable } from '@/JS/commom';
export default {
    mixins: [myMixinTable],
    props: {
        // 相对滚动的父元素className 可以不传，不传后面以body为起始目标滚动
        parent: {
            type: String,
            default: ''
        },
        currentPage: {
            type: Number,
            default: 1
        },
        pageSize: {
            type: Number,
            default: 20
        },
        totalPage: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            startScHeight: 0, // 最短滚动距离
            isFixedShow: false, // 显隐fixed部分
            top: 0, // 定位偏移量
            left: 0
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        // 调用父元素的getlist
        getList(val) {
            this.$emit('getList', val);
        },
        // 初始化
        init() {
            // 父滚动元素
            const startDom = this.parent ? document.getElementsByClassName(this.parent)[0] : document.body;
            // 分页元素
            const goalDom = this.$refs['pagination'];
            // 需要滚动距离
            this.startScHeight = goalDom.offsetTop;
            // 定位偏移量  如果没有
            this.top = startDom.offsetTop + 'px';
            this.left = startDom.offsetLeft + goalDom.offsetLeft + 'px';
            // startDom.addEventListener('scroll', this.menu);
            startDom.onscroll = this.menu;
        },
        // 滚动距离判断isFixedShow值
        menu() {
            const startDom = this.parent ? document.getElementsByClassName(this.parent)[0] : document.body;
            if (!this.parent) {
                if (window.pageYOffset > this.startScHeight) {
                    this.isFixedShow = true;
                    return;
                }
                this.isFixedShow = false;
            } else {
                if (startDom.scrollTop > this.startScHeight) {
                    this.isFixedShow = true;
                    return;
                }
                this.isFixedShow = false;
            }
        }
    },
    // 对请求获得的分页数据进行监听
    watch: {
        totalPage(newVal) {
            if (newVal) {
                this.page.totalPage = newVal;
            }
        },
        currentPage(newVal) {
            if (newVal) {
                this.page.currentPage = newVal;
            }
        },
        pageSize(newVal) {
            if (newVal) {
                this.page.pageSize = newVal;
            }
        }
    }
};
</script>
<style lang='less' scoped>
.mr-pagination {
    .mr-pagination-box {
        background: #fff;
        &.active {
            position: fixed;
            top: 0;
            left: 0;
            z-index: 9999;
        }
    }
}
</style>