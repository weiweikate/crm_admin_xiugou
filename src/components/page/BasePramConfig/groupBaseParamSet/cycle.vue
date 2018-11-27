<template>
    <div class="group-base-params">
        <v-breadcrumb :nav="nav"></v-breadcrumb>
        <el-card v-loading="bodyLoading" :body-style="{ padding: '20px 40px',minHeight:'60vh' }">
            <div class="currency-title">参数设置</div>
            <div class="currency-wrap">
                <span class="currency-small-title">X值结算方式</span><br/>
                <el-select v-model="xNum" class="input-sty">
                    <el-option label="结算周期" value="1"></el-option>
                    <el-option label="即时周期" value="2"></el-option>
                </el-select><br>
                <span class="currency-small-title">Y值结算方式</span><br/>
                <el-select v-model="yNum" class="input-sty">
                    <el-option label="结算周期" value="1"></el-option>
                    <el-option label="即时周期" value="2"></el-option>
                </el-select><br>
                <span class="currency-small-title">Z值结算方式</span><br/>
                <el-select v-model="zNum" class="input-sty">
                    <el-option label="结算周期" value="1"></el-option>
                    <el-option label="即时周期" value="2"></el-option>
                </el-select><br>
                <div class="btn-group">
                    <el-button :loading="btnLoading" type="primary" @click="submitForm">确认提交</el-button>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import request from '@/http/http';

    export default {
        components: { vBreadcrumb },

        data() {
            return {
                nav: ['运营管理', '拼店基础设置', '拼店结算周期设置'],
                bodyLoading: false,
                btnLoading: false,
                xNum: '',
                yNum: '',
                zNum: '',
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
                    codes: 'store_start_num,store_deposit'
                };
                // this.bodyLoading = true;
                // request.queryConfig(data).then(res => {
                //     res.data.forEach(v => {
                //         if (v.code == 'store_start_num') {
                //             this.storeStartNum = v.value;
                //         } else if (v.code == 'store_deposit') {
                //             this.storeDeposit = v.value;
                //         }
                //     });
                //     this.bodyLoading = false;
                // }).catch(err => {
                //     console.log(err);
                //     this.bodyLoading = false;
                // });
            },
            //   提交表单
            submitForm() {
                const int = /^([1-9]\d*)$/;
                const reg = /^([1-9]\d*)([.]{1}[1-9]{1,2})?$/;
                if (!int.test(this.storeStartNum) || !reg.test(this.storeDeposit)) {
                    this.$message.warning('请输入合法数据!');
                    return;
                }
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
    }
</style>
