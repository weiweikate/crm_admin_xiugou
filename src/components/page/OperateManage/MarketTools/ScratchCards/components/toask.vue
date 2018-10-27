<template>
    <div class="stratch-card-toask">
        <el-dialog
            title="提示"
            :visible.sync="toask"
            width="650px"
            :before-close="handleClose">
            <p class="tac" v-if="status == 3">一但删除将不可撤回</p>
            <p class="tac" v-if="status == 2">是否暂停该刮刮卡</p>
            <p class="tac" v-if="status == 2" style="color: #ccc;font-size: 14px">停用后剩余的奖品数将不会中出去</p>
            <p class="tac" v-if="status == 1">是否开启该刮刮卡</p>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="handleClose">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                toask: false,
                id: '',
                status: '1' // 1: 开启 2：暂停 3：删除
            };
        },
        methods: {
            submitForm() {
                console.log(this.status);
            },
            handleClose() {
                this.toask = false;
            }
        }
    };
</script>

<style lang="less" scoped>
    .stratch-card-toask{
        /deep/.el-dialog {
            border-radius: 10px;
            overflow: auto;
            .el-dialog__header {
                border-bottom: 1px solid #eee;
                padding: 20px 20px 10px 50px;
                .el-dialog__title {
                    color: #ff6868;
                }
            }
        }
    }
</style>
