<!-- flying -->
<!-- eg: 
    import flying from '@/components/common/flying/flying';
    <mr-flying parentClass="content-box">
        <slot></slot>
    </mr-flying> 
-->
<!-- 传参  parentClass(parentClass相对滚动的最近祖先元素的className,不传后面以body为起始目标滚动) -->
<!-- slot 插槽浮层内容需要注入 -->
<!-- 注意 1.offset是相对最近一个定位的祖先元素来获位置偏移量（http://www.softwhy.com/article-2515-1.html）  2分页器到滚动父元素（props：parentClass）之间不能设置overflow：hidden/auto属性否则监听滚动失效 -->
<template>
    <div class="mr-flying">
        <div class="mr-flying-box" ref="mrLayer" :class="{'active':isFixedShow}" :style="{'top': layerTop,'left':layerLeft}">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        // 相对滚动的父元素className 可以不传，不传后面以body为起始目标滚动
        parentClass: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            startScrollHeight: 0, // 最短滚动距离
            isFixedShow: false, // 显隐fixed部分
            layerTop: 0, // 定位偏移量
            layerLeft: 0
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        // 初始化
        init() {
            // 父元素
            const parentDom = this.parentClass ? document.getElementsByClassName(this.parentClass)[0] : document.body;
            // 目标元素
            const flyingDom = this.$refs['mrLayer'];
            // 需要滚动距离
            this.startScrollHeight = flyingDom.offsetTop;
            // 定位偏移量
            this.layerTop = parentDom.offsetTop + 'px';
            this.layerLeft = parentDom.offsetLeft + 'px';
            parentDom.removeEventListener('scroll', this.scroll);
            parentDom.addEventListener('scroll', this.scroll);
            // parentDom.onscroll = this.flying;
        },
        // 滚动距离判断isFixedShow值
        scroll() {
            const parentDom = this.parentClass ? document.getElementsByClassName(this.parentClass)[0] : document.body;
            if (!this.parentClass) {
                if (window.pageYOffset > this.startScrollHeight) {
                    this.isFixedShow = true;
                    return;
                }
                this.isFixedShow = false;
            } else {
                if (parentDom.scrollTop > this.startScrollHeight) {
                    this.isFixedShow = true;
                    return;
                }
                this.isFixedShow = false;
            }
        }
    }
};
</script>