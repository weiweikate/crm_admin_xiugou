<template>
    <div class="pwd-mask">
        <div class="box">
            <div class="mask-title">
                <icon class="ico" ico='icon-jinggao'/>
                温馨提示
            </div>
            <div class="mask-content">
                <span class="del-tip">是否确认{{title}}</span>
                <div class="del-btn-group">
                    <el-button :loading="btnLoading" @click="closeToask(true)" class="del-btn" type="danger">
                        确认{{title}}
                    </el-button>
                    <el-button @click="closeToask(false)">取消</el-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import icon from './ico';
    import request from '@/http/http.js';

    export default {
        props: {
            tip: '',
            id: {
                require: true
            },
            url: {
                require: true
            },
            status: {},
            isTopic: {},
            isProperty: {},
            type: ''
        },
        components: {
            icon
        },
        computed: {
            title() {
                return this.tip === undefined ? '删除' : this.tip;
            }
        },
        data() {
            return {
                btnLoading: false
            };
        },
        methods: {
            //  取消弹窗
            closeToask(status) {
                if (status === true) {
                    const that = this;
                    that.btnLoading = true;
                    const url = that.url;
                    const data = {};
                    if (that.isTopic) {
                        data.code = that.id;
                    } else if (that.isProperty) {
                        data.codes = that.id;
                    } else {
                        data.id = that.id;
                    }
                    that.type && (data.type = that.type);
                    data.status = that.status;
                    request[url](data).then(res => {
                        that.btnLoading = false;
                        this.$message.success(res.msg);
                        this.$emit('msg', false);
                    }).catch(err => {
                        that.btnLoading = false;
                        this.$emit('msg', false);
                        this.$message.warning(err);
                    });
                } else {
                    this.$emit('msg', false);
                }
            }
        }
    };
</script>
<style lang="less" scoped>
    @import "../../assets/css/components/popup";
</style>


