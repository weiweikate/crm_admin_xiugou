<template>
    <div class="group-base-params">
        <v-breadcrumb :nav="nav"></v-breadcrumb>
        <el-card v-loading="bodyLoading" :body-style="{ padding: '20px 40px',minHeight:'60vh' }">
            <div class="currency-title">参数设置</div>
            <div class="currency-wrap">
                <span class="currency-small-title">拼店招募开启人数设置</span><br/>
                <el-input v-model="storeStartNum" class="input-sty"></el-input>
                <span class="point">人</span><br/>
                <span class="currency-small-title">拼店保证金设置</span><br/>
                <el-input v-model="storeDeposit" class="input-sty" disabled></el-input>
                <span class="point">元</span><br/>
                <span class="currency-small-title">结算周期</span><br/>
                <span class="point">每月 </span>
                <el-input v-model="settleCycle" class="input-sty"></el-input>
                <span class="point">日 </span>
                <span class="point" style="color: #cccccc;">注：请输入1-28日的数值</span><br/>
                <span class="currency-small-title">加入店铺后，允许退出店铺天数设置</span><br/>
                <el-input v-model="exitDays" class="input-sty"></el-input>
                <span class="point">天</span><br/>
                <span class="currency-small-title">店长店铺被清算，再次开店时间设置</span><br/>
                <el-input v-model="reStartShop" class="input-sty"></el-input>
                <span class="point">天</span>
                <div class="btn-group">
                    <el-button :loading="btnLoading" type="primary" @click="submitForm">确认提交</el-button>
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
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import request from '@/http/http';
    import { regExpConfig } from '@/utils/regConfig';
    export default {
        components: { vBreadcrumb },

        data() {
            return {
                nav: ['运营管理', '拼店基础设置', '拼店基础参数设置'],
                bodyLoading: false,
                btnLoading: false,
                storeStartNum: '', // 拼店招募开启人数设置
                storeDeposit: '', // 拼店保证金设置
                settleCycle: '', // 结算周期
                exitDays: '', // 加入店铺后，允许退出店铺天数设置
                reStartShop: '', // 店长店铺被清算，再次开店时间设置
                mask: false
            };
        },

        activated() {
            this.getInfo();
        },

        methods: {
            //   获取数据
            getInfo() {
                const data = {
                    codes: 'store_start_num,store_deposit,quit_store_day,open_store_again_day'
                };
                this.bodyLoading = true;
                request.queryConfig(data).then(res => {
                    res.data.forEach(v => {
                        if (v.code == 'store_start_num') {
                            this.storeStartNum = v.value;
                        } else if (v.code == 'store_deposit') {
                            this.storeDeposit = v.value;
                        } else if (v.code == 'quit_store_day') {
                            this.exitDays = v.value;
                        } else if (v.code == 'open_store_again_day') {
                            this.reStartShop = v.value;
                        }
                    });
                    this.bodyLoading = false;
                }).catch(err => {
                    console.log(err);
                    this.bodyLoading = false;
                });
            },
            //   提交表单
            submitForm() {
                const int = /^([1-9]\d*)$/;
                const reg = /^([1-9]\d*)([.]{1}[1-9]{1,2})?$/;
                const regNumRange = /^\d{1,4}$/;
                if (!int.test(this.storeStartNum) || !reg.test(this.exitDays) || !reg.test(this.reStartShop) || !int.test(this.settleCycle) || this.settleCycle < 0 || this.settleCycle > 28) {
                    this.$message.warning('请输入合法数据!');
                    return;
                }
                if (!regExpConfig.regNum1_4.test(this.exitDays) || !regExpConfig.regNum1_4.test(this.reStartShop)) return this.$message.warning('请输入正确的天数!');
                this.mask = true;
            },
            sure() {
                const data = {
                    configVOS: [
                        {
                            code: 'store_start_num',
                            name: '拼店招募开启人数',
                            value: this.storeStartNum,
                            value_type: 1,
                            status: 1
                        },
                        {
                            code: 'store_deposit',
                            name: '拼店保证金',
                            value: this.storeDeposit,
                            value_type: 1,
                            status: 1
                        },
                        {
                            code: 'quit_store_day',
                            name: '加入店铺后允许退出天数',
                            value: this.exitDays,
                            value_type: 1,
                            status: 1
                        },
                        {
                            code: 'open_store_again_day',
                            name: '店长店铺被清算，再次开店时间',
                            value: this.reStartShop,
                            value_type: 1,
                            status: 1
                        }
                    ]
                };
                this.btnLoading = true;
                request.addOrModifyList(data).then(res => {
                    this.$message.success(res.msg);
                    this.btnLoading = false;
                    this.mask = false;
                }).catch(err => {
                    console.log(err);
                    this.btnLoading = false;
                });
            },
            // 取消
            cancel() {
                this.getInfo();
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
