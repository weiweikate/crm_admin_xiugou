<template>
    <!-- <div class="picture-video" v-if="dialogVisible"> -->
        <!-- <div class="content-wrap">
            <i class="el-icon-arrow-left arraw" @click="toggle('left')" :class="current==0?'grey-text':''"></i>
            <video v-if="link[current] && link[current].type == 'video'" class="video-style" controls="controls" :src="link[current].link"></video>
            <img v-else-if="link[current] && link[current].type == 'picture'" class="video-style" :src="link[current].link" alt="图片加载失败">
            <span v-else>加载失败</span>
            <div class="enlarge-small" v-if="link[current] && link[current].type == 'picture'">
                <i class="el-icon-zoom-in" @click="enlarge(current)"></i>
                <i class="el-icon-zoom-out" @click="small(current)"></i>
            </div>
            <i class="el-icon-arrow-right arraw" @click="toggle('right')" :class="current==link.length-1?'grey-text':''"></i>
        </div>    -->
    <div class="picture-video">
        <el-dialog :visible.sync="dialogVisible" :before-close="handleClose">
            <div class="content-wrap">
                <video v-if="link[current] && link[current].type == 'video'" class="video-style" controls="controls" :src="link[current].link"></video>
                <img v-else-if="link[current] && link[current].type == 'picture'" class="video-style" :src="link[current].link" alt="图片加载失败">
                <span v-else>加载失败</span>
            </div>
             <div class="enlarge-small">
                    <i class="el-icon-arrow-left arraw" @click="toggle('left')" :class="current==0?'grey-text':''"></i>
                    <i class="el-icon-zoom-in arraw" @click="enlarge(current)"></i>
                    <i class="el-icon-zoom-out arraw" @click="small(current)"></i>
                    <i class="el-icon-arrow-right arraw" @click="toggle('right')" :class="current==link.length-1?'grey-text':''"></i>
                </div>
        </el-dialog>
        <!-- <i class="el-icon-circle-close-outline arraw" @click="handleClose"></i> -->
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
        };
    },
    mounted() {
        console.log(this.dialogVisible)
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
    /deep/.el-dialog {
        width: 100%;
        height: 100%;
        background: inherit;
        margin: 0 !important;
        border-radius: none;
        color: #fff !important;
        .el-dialog__header{
            border-bottom: none
        }
        .el-dialog__headerbtn .el-dialog__close{
            color: #fff;
            font-size: 20px;
        }
    }
    .el-icon-circle-close-outline{
        position: absolute;
        right: 0;
        top: 0;
    }
    .enlarge-small {
            position: absolute;
            color: #fff;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
        }
    .content-wrap {
        .video-style {
            width: 50%;
            text-align: center;
            position: absolute;
            top:50%;
            left: 50%;
            transform: translateX(-50%) translateY(-50%);
        }
        .arraw {
            cursor: pointer;
            font-size: 20px;
        }
    }
}
</style>
