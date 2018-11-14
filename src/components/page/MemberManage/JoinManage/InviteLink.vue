<template>
    <div>
        <v-breadcrumb :nav="['经销商会员管理','经销商加盟管理','邀请链接']"></v-breadcrumb>
        <div class="invite-link">
            <div class="box">
                <div class="mask-content">
                    <el-form>
                        <div class="title-item">邀请二维码：</div>
                        <el-form-item>
                            <img :src="codeImg" alt="" class="code-area">
                        </el-form-item>
                        <div class="title-item">邀请链接：</div>
                        <el-form-item>
                            <el-input readonly v-model="codeImg" placeholder="请输入邀请链接"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
    </div>

</template>
<script>
    import icon from '@/components/common/ico';
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';

    export default {
        components: {
            vBreadcrumb, icon
        },
        data() {
            return {
                codeImg: '',
                msg: {}
            };
        },
        activated() {
            this.msg = this.$route.query.joinManageLinkPage;
            this.getCode();
        },
        methods: {
            // 获取二维码
            getCode() {
                this.codeImg = this.msg.wxQrcode;
            }

        }
    };
</script>
<style lang="less">
    .invite-link {
        .title-item {
            padding: 10px 0 20px
        }
        .box {
            background-color: #fff;
            border-radius: 10px;
            height: 880px;
            .mask-content {
                position: relative;
                width: 100%;
                padding: 40px 45px 30px 80px;
                box-sizing: border-box;
                .submit-btn {
                    margin-top: 30px;
                    padding-left: 225px;
                    box-sizing: border-box;
                }
            }
        }
        .code-area {
            border-radius: 5px;
            border:1px solid #dfdfdf;
        }
        .el-input {
            width: 300px
        }
        .el-input__inner {
            width: 300px
        }
        .submit-btn {
            padding: 0 50px 20px 130px
        }
    }
</style>


