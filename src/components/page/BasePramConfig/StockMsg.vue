<template>
    <div class="currency-ratio">
        <v-breadcrumb :nav="nav"></v-breadcrumb>
        <el-card v-loading="pageLoading" :body-style="{ padding: '20px 40px',minHeight:'60vh' }">
            <div class="currency-title">库存消息提醒设置</div>
            <div class="currency-wrap">
                <p>
                    <span class="currency-small-title">库存低于</span>
                    <el-input-number class="input-sty" :min="0" :controls="false" v-model="num1" style="width:150px" placeholder="请输入数值"></el-input-number><span class="point">提示：库存不足</span>
                </p>
                <p>
                    <span class="currency-small-title">库存低于</span>
                    <el-input-number class="input-sty" :min="0" :controls="false" v-model="num2" style="width:150px" placeholder="请输入数值"></el-input-number><span class="point">提示：库存紧张</span>
                </p>
                <p>
                    <span class="currency-small-title">库存低于</span>
                    <el-input-number class="input-sty" :min="0" :controls="false" v-model="num3" style="width:150px" placeholder="请输入数值"></el-input-number><span class="point">提示：库存为0</span>
                </p>
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
                nav: ['基础参数设置', '库存消息提醒设置'],
                btnLoading: false,
                pageLoading: false,
                num1: '',
                num2: '',
                num3: ''
            };
        },

        activated() {
            this.getInfo();
        },

        methods: {
            /**
             * @Description: 获取数据
             * @param:
             * @return:
             * @author wuchengji
             * @date 2018/10/10
             */
            getInfo() {
                this.pageLoading = true;
                const data = {
                    codes: 'less_than_stock_insufficient,less_than_stock_tension,less_than_stock_zero'
                };
                request.queryConfig(data).then(res => {
                    this.pageLoading = false;
                    this.num1 = res.data[0].value;
                    this.num2 = res.data[1].value;
                    this.num3 = res.data[2].value;
                    this.bodyLoading = false;
                }).catch(err => {
                    this.pageLoading = false;
                    console.log(err);
                });
            },
            /**
             * @Description: 提交表单
             * @param:
             * @return:
             * @author wuchengji
             * @date 2018/10/10
             */
            submitForm() {
                const data = {
                    configVOS: [
                        {
                            code: 'less_than_stock_insufficient',
                            name: '提醒库存不足',
                            value: this.num1,
                            value_type: 1,
                            status: 1
                        },
                        {
                            code: 'less_than_stock_tension',
                            name: '提醒库存紧张',
                            value: this.num2,
                            value_type: 1,
                            status: 1
                        },
                        {
                            code: 'less_than_stock_zero',
                            name: '提醒库存为0',
                            value: this.num3,
                            value_type: 1,
                            status: 1
                        }
                    ]
                };
                let reg = /^\d+$/;
                if(reg.test(this.num1) && reg.test(this.num2) && reg.test(this.num3)){
                    this.btnLoading = true;
                    request.addOrModifyList(data).then(res => {
                        this.$message.success(res.msg);
                        this.btnLoading = false;
                    }).catch(err => {
                        console.log(err);
                        this.btnLoading = false;
                    });
                }else{
                    this.$message.warning('请输入正整数!')
                }
            },
            // 取消
            cancle() {
                this.getInfo();
            }
        }
    };
</script>
<style lang='less' scoped>
    .currency-ratio {
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
                width: 130px;
                margin-bottom: 20px;
            }
            .point {
                font-size: 14px;
                padding: 0 15px 0 5px;
                color: #ccc;
            }
            .point-mer {
                margin-right: 10px;
            }
            .btn-group {
                margin-top: 40px;
            }
        }
    }
</style>
