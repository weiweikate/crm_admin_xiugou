<template>
    <div class="picture-video">
        <el-dialog title="" :visible.sync="dialogVisible" :width="width" :height="height" :before-close="handleClose">
            <div class="content-wrap">
                <i class="el-icon-arrow-left arraw" @click="toggle('left')" :class="current==0?'grey-text':''"></i>
                <video v-if="link[current] && link[current].type == 'video'" class="video-style" controls="controls" :src="link[current].link"></video>
                <!-- <img v-else-if="link[current] && link[current].type == 'picture'" class="video-style" :src="link[current].link" alt="图片加载失败">
                <span v-else>加载失败</span> -->
                <viewer :images="imgUrls" v-else-if="link[current] && link[current].type == 'picture'">
                       <img v-for="(item,index) in imgUrls" :key="index" :src="item" alt="">
                </viewer>
                <span v-else>加载失败</span>
                <div class="enlarge-small" v-if="link[current] && link[current].type == 'picture'">
                    <i class="el-icon-zoom-in" @click="enlarge(current)"></i>
                    <i class="el-icon-zoom-out" @click="small(current)"></i>
                </div>
                <i class="el-icon-arrow-right arraw" @click="toggle('right')" :class="current==link.length-1?'grey-text':''"></i>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props: {
        dialogVisible: {
            required: true,
            default: false
        },
        link: {
            default: []
        },
        imgUrls: {
            default: []
        },
        current: {
            default: 0
        }
    },
    data() {
        return {
            width: '600px',
            height: '600px',
            i: 0
        };
    },
    mounted() {
    },
    methods: {
        handleClose() {
            this.dialogVisible = false;
            this.current = 0;
        },
        // 上一张下一张
        toggle(type) {
            if (type === 'left') {
                if (this.current === 0) {
                    return;
                } else {
                    this.current--;
                }
            } else if (type === 'right') {
                if (this.current === this.link.length - 1) {
                    return;
                } else {
                    this.current++;
                }
            }
            this.small(0);
        },
        // 放大缩小
        enlarge(num) {
            this.width = '80%';
            this.height = '80%';
        },
        small(num) {
            this.width = '600px';
            this.height = '600px';
        }
    }
};
</script>

<style lang="less" scoped>
.picture-video {
    .el-dialog {
        background: inherit;
    }
    .content-wrap {
        display: flex;
        justify-content: space-between;
        align-items: center;
        // height: 600px;
        position: relative;
        .video-style {
            width: 400px;
        }
        .arraw {
            cursor: pointer;
            font-size: 42px;
        }
        .enlarge-small {
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
        }
    }
}
</style>
