<template>
    <div class="picture-video">
        <el-dialog
            title="预览"
            :visible.sync="dialogVisible"
            width="600px"
            :before-close="handleClose"
        >
            <div class="content-wrap">
                <span @click="toggle('left')" class="arraw"><</span>
                <video v-if="link[current] && link[current].type == 'video'" class="video-style" controls="controls" :src="link[current].link"></video>
                <img v-else-if="link[current] && link[current].type == 'picture'" class="video-style" :src="link[current].link" alt="图片加载失败">
                <span v-else>加载失败</span>
                <span @click="toggle('right')" class="arraw">></span>
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
            }
        },
        data() {
            return {
                current: 0
            };
        },
        methods: {
            handleClose() {
                this.current = 0;
                this.dialogVisible = false;
            },
            toggle(type) {
                if (type === 'left') {
                    if (this.current == 0) {
                        return;
                    } else {
                        this.current--;
                    }
                } else if (type === 'right') {
                    if (this.current == this.link.length - 1) {
                        return;
                    } else {
                        this.current++;
                    }
                }
            }
        }
    };
</script>

<style lang="less" scoped>
.picture-video{
    .content-wrap{
        display: flex;
        justify-content: space-between;
        align-items: center;
        .video-style{
            width: 400px;
        }
        .arraw {
            cursor: pointer;
            font-size: 42px;
        }
    }
}
</style>
