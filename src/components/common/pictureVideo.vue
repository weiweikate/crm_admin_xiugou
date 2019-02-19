<template>
    <div class="picture-video">
        <el-dialog :visible.sync="dialogVisible" :before-close="handleClose">
            <div class="content-wrap">
                <video v-if="link[current] && link[current].type == 'video'" class="video-style" controls="controls" :src="link[current].link"></video>
                <img v-else-if="link[current] && link[current].type == 'picture'" ref="size" class="video-style" :style="{width:setWidth+'%'}" :src="link[current].link" alt="图片加载失败">
                <span v-else>加载失败</span>
            </div>
            <div class="enlarge-small">
                <i class="el-icon-arrow-left arraw" @click="toggle('left')" :class="current==0?'grey-text':''"></i>
                <i class="el-icon-zoom-in arraw" @click="bigOrSmall(true,link[current].type)"></i>
                <i class="el-icon-zoom-out arraw" @click="bigOrSmall(false,link[current].type)"></i>
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
            setWidth: 30
        };
    },
    mounted() {},
    methods: {
        handleClose() {
            this.dialogVisible = false;
            this.current = 0;
            this.$emit('msg', false);
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
        },
        // 放大缩小
        bigOrSmall(status, type) {
            if (type === 'video') {
                return;
            }
            this.setWidth = status ? this.setWidth * 1.1 : this.setWidth * 0.9;
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
        .el-dialog__header {
            border-bottom: none;
        }
        .el-dialog__headerbtn .el-dialog__close {
            color: #fff;
            font-size: 20px;
        }
    }
    .el-icon-circle-close-outline {
        position: absolute;
        right: 0;
        top: 0;
    }
    .enlarge-small {
        position: fixed;
        color: #fff;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #ff6868;
        padding: 0 10px;
    }
    .content-wrap {
        .video-style {
            width: 30%;
            position: fixed;
            top: 50%;
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
