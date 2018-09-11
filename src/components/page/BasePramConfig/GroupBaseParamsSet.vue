<template>
    <div class="group-base-params">
        <v-breadcrumb :nav="nav"></v-breadcrumb>
        <el-card :body-style="{ padding: '20px 40px',minHeight:'60vh' }">
            <div class="currency-title">参数设置</div>
            <div class="currency-wrap">
                <span class="currency-small-title">拼店招募开启人数设置</span><br/>
                <el-input v-model="storeStartNum" class="input-sty"></el-input>
                <span class="point">人</span><br/>
                <span class="currency-small-title">拼店保证金设置</span><br/>
                <el-input v-model="storeDeposit" class="input-sty"></el-input>
                <span class="point">元</span><br/>
                <div class="btn-group">
                    <el-button :loading="btnLoading" type="primary" @click="submitForm">确认提交</el-button>
                    <el-button @click="cancel">取消</el-button>
                </div>
            </div>
        </el-card>
        <!--提示-->
        <el-dialog title="温馨提示" :visible.sync="mask">
            <div class="tip-content">
                <div>拼店保证金是否确认设置为“<span>{{storeDeposit}}</span>”元</div>
                <div>点击确认即可提交完成</div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="sure">确 认</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import vBreadcrumb from "@/components/common/Breadcrumb.vue";
    import * as api from "@/api/OperateManage/groupBaseParamsSet.js";
    import * as pApi from "@/privilegeList/OperateManage/groupBaseParamsSet.js";

    export default {
        components: {vBreadcrumb},

        data() {
            return {
                nav: ["运营管理", "拼店基础参数设置"],
                btnLoading: false,
                storeStartNum: "",
                storeDeposit: "",
                mask: false
            };
        },

        activated() {
            this.getInfo();
        },

        methods: {
            //   获取数据
            getInfo() {
                this.$axios
                    .post(api.findConfig, {})
                    .then(res => {
                        this.storeStartNum = res.data.data.storeStartNum;
                        this.storeDeposit = res.data.data.storeDeposit;
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            //   提交表单
            submitForm() {
                this.mask = true;
            },
            sure() {
                let data = {};
                data.storeStartNum = this.storeStartNum;
                data.storeDeposit = this.storeDeposit;
                data.url = pApi.updateConfigByGroupstore;
                this.btnLoading = true;
                this.$axios
                    .post(api.updateConfigByGroupstore, data)
                    .then(res => {
                        this.$message.success(res.data.msg);
                        this.btnLoading = false;
                        this.mask = false
                    })
                    .catch(err => {
                        console.log(err);
                        this.btnLoading = false;
                    });
            },
            //取消
            cancel() {
                this.getInfo()
            }
        }
    };
</script>
<style lang='less'>
    .group-base-params {
        .currency-title {
            width: 100%;
            height: 60px;
            background-color: #f7f7f7;
            line-height: 60px;
            padding: 0 20px;
            box-sizing: border-box;
        }
        .currency-wrap {
            padding: 0 20px;
            box-sizing: border-box;
            .currency-small-title {
                display: inline-block;
                margin: 20px 0;
                box-sizing: border-box;
                font-size: 14px;
            }
            .input-sty {
                width: 350px;
                margin-bottom: 20px;
            }
            .point {
                font-size: 14px;
                padding: 0 15px 0 5px;
            }
            .btn-group {
                margin-top: 40px;
            }
        }
        /*弹窗样式*/
        .el-dialog {
            width: 530px;
            border-radius: 10px;
            .el-dialog__header {
                border-bottom: 1px solid #eee;
                padding: 20px 20px 10px 50px;
            }
            .el-dialog__title {
                color: #ff6868;
            }
            .el-dialog__footer {
                text-align: center;
                .el-button {
                    width: 70%;
                    height: 40px;
                    background-color: #ff6868;
                    border-radius: 5px;
                    font-size: 18px;
                    color: #ffffff;
                    border: none
                }
            }
            .el-dialog__body {
                padding: 0;
            }
            .tip-content {
                text-align: center;
                font-size: 18px;
                color: #000000;
                padding: 30px 0 50px;
                span {
                    color: #ff6868;
                }
            }
        }
    }
</style>
