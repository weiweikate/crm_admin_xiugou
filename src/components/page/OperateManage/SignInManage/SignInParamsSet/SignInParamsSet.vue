<template>
    <div class="signIn-params">
        <v-breadcrumb :nav="nav"></v-breadcrumb>
        <el-card v-loading="bodyLoading" :body-style="{ padding: '20px 40px',minHeight:'60vh' }">
            <div class="currency-title">每日签到设置</div>
            <div class="currency-area">
                <div class="currency-wrap" v-for="(v,k) in daysList" :key="k">
                    <span class="currency-small-title">连续签到{{k+1}}天可得</span>
                    <el-input v-model="daysList[k]" placeholder="请输入数值" class="input-sty"></el-input><span class="point">秀豆</span>
                    <span v-if="k>0" class="opr-btn" @click="deleteItem(k)">删除</span>
                </div>
                <div>
                    <span class="opr-btn add-btn" @click="addItem">添加</span>
                </div>
            </div>

            <div class="currency-title">连续签到设置</div>
            <div class="currency-area">
                <div class="currency-wrap">
                    <span class="currency-small-title">连续签到超过设置天数后可得</span>
                    <el-input v-model="greaterDays" placeholder="请输入数值" class="input-sty"></el-input><span class="point">秀豆</span>
                </div>
            </div>
            <div class="btn-group">
                <el-button :loading="btnLoading" type="primary" @click="submitForm">确认保存</el-button>
                <el-button type="success" @click="cancel">取消</el-button>
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
                nav: ['基础参数设置', '交易基础参数设置'],
                bodyLoading: false,
                btnLoading: false,
                daysList: [],
                greaterDays: ''
            };
        },

        activated() {
            this.getInfo();
        },

        methods: {
            // 获取数据
            getInfo() {
                const data = {
                    codes: 'continue_sign_in'
                };
                this.bodyLoading = true;
                request.queryConfig(data).then(res => {
                    let values = []; let daysValue = [];
                    this.daysList = [];
                    // values = res.data[0].value.indexOf(',') != -1 ? res.data[0].value.split(',') : [res.data[0].value];
                    values = res.data[0].value.split(',');
                    daysValue = values.slice(0, -1);
                    this.greaterDays = values[values.length - 1];
                    daysValue.forEach((v, k) => {
                        this.daysList.push(v);
                    });
                    this.bodyLoading = false;
                }).catch(err => {
                    this.bodyLoading = false;
                    console.log(err);
                });
            },
            //   提交表单
            submitForm() {
                const reg = /^(0|[1-9]\d*)$/;
                for (let i = 0; i < this.daysList.length; i++) {
                    let pre = '';
                    if (i === 0) {
                        pre = this.daysList[0];
                    } else {
                        pre = this.daysList[i - 1];
                    }
                    const v = this.daysList[i];
                    if (!v || !reg.test(v) || v < pre) {
                        this.$message.warning('请输入合法数据');
                        return;
                    }
                }
                if (!this.greaterDays || !reg.test(this.greaterDays) || this.greaterDays < this.daysList[this.daysList.length - 1].value) {
                    this.$message.warning('请输入合法数据');
                    return;
                }
                const data = {
                    configVOS: [{
                        code: 'continue_sign_in',
                        value: this.daysList.join(',') + ',' + this.greaterDays
                    }

                    ]
                };
                this.btnLoading = true;
                request.addOrModifyList(data).then(res => {
                    this.$message.success(res.msg);
                    this.btnLoading = false;
                }).catch(err => {
                    console.log(err);
                    this.btnLoading = false;
                });
            },
            // 添加
            addItem() {
                this.daysList.push({
                    value: ''
                });
            },
            // 删除
            deleteItem(index) {
                this.daysList.splice(index, 1);
            },
            // 取消
            cancel() {
                this.getInfo();
            }
        }
    };
</script>
<style lang='less' scoped>
    .signIn-params {
        .currency-title {
            width: 100%;
            height: 60px;
            line-height: 60px;
            padding: 0 20px;
            box-sizing: border-box;
        }
        .currency-area{
            background-color: #f7f7f7;
            width: 450px;
            padding-bottom: 20px;
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
                width: 150px;
                margin-bottom: 20px;
            }
            .point {
                font-size: 14px;
                padding: 0 15px 0 5px;
            }
        }
        .btn-group {
            margin-top: 40px;
        }
        .opr-btn{
            font-size: 14px;
            color: #3a8ee6;
            cursor: pointer;
        }
        .add-btn{
            margin-left: 100px;
        }
    }
</style>
