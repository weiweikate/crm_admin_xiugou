<template>
    <div class="show-value-set">
        <v-breadcrumb :nav="nav"></v-breadcrumb>
        <el-card v-loading="pageLoading">
            <el-form label-width="180px">
                <el-form-item label="综合活跃度分配模板名称：">
                    <el-input placeholder="请输入模板名称" class="inp" v-model="form.name"></el-input>
                </el-form-item>
            </el-form>
            <div class="option">
                <div>综合活跃度占比</div>
                <div>
                    设置：综合活跃度 <el-input-number :controls="false" :min="0" :max="100" @input="computedShowBean" @blur="toFixed" v-model="form.valueRate" placeholder="请输入数值"></el-input-number> %
                </div>
            </div>
            <div class="option">
                <div>秀豆占比</div>
                <div>
                    设置：秀豆 <el-input disabled style='width:200px' v-model="form.showPeas" placeholder="请输入数值"></el-input> %
                    <span class="grey-text ml10">则自动计算出Y=0%</span>
                </div>
            </div>
            <el-button-group class="btn-group">
                <el-button @click="toggleShowModle(1)" :class="{'btn-active': active == 1, 'btn-def': active == 2}">综合活跃度设置</el-button>
                <el-button @click="toggleShowModle(2)" :class="{'btn-active': active == 2, 'btn-def': active == 1}">秀豆设置</el-button>
            </el-button-group>
            <tpl v-show="active == 1" ref="showValue"></tpl>
            <tpl v-show="active == 2" ref="showBean"></tpl>
            <p class="grey-text mt10" style="padding-left: 50px">最高等级项相加需小于等于100%，参数可为空/填写0</p>
            <div class="time">
                <el-checkbox v-model="isSetTime" @change="changeTimeStatus">
                    <span>设置开启时间</span>
                </el-checkbox>
                <el-date-picker :disabled="!isSetTime" v-model="form.startTime" type="datetime" placeholder="请选择开启时间"></el-date-picker>
                <span>设置结束时间</span>
                <el-date-picker :disabled="!isSetTime" v-model="form.endTime" type="datetime" placeholder="请选择结束时间"></el-date-picker>
                <p class="grey-text mt10" style="margin-left: 110px">设置时间只能是0点</p>
            </div>
            <div>
                <el-button :loading="btnLoading" type="primary" @click="beforeSubmit">确 认</el-button>
                <el-button @click="$router.push('showValueList')">取 消</el-button>
            </div>
        </el-card>
    </div>
</template>

<script>
    import vBreadcrumb from '@/components/common/Breadcrumb.vue';
    import tpl from './_showValue/profitTemplate.vue';
    import request from '@/http/http';
    export default {
        components: { vBreadcrumb, tpl },
        data() {
            return {
                nav: ['秀值模块', '秀值分配设置', '新建利润分配模板'],
                id: '',
                url: '',
                form: {
                    name: '',
                    valueRate: '',
                    showPeas: '',
                    startTime: '',
                    endTime: ''
                },
                data: {}, // 表单数据
                profitParm: [{ label: '其他1', value: 1 }],
                active: '1',
                isSetTime: false,
                pageLoading: false,
                btnLoading: false
            };
        },
        activated() {
            this.id = this.$route.query.showValueTplId;
            this.getInfo();
        },
        deactivated() {
            this.id = '';
        },
        methods: {
            // 提交之前判断
            beforeSubmit() {},
            // 提交表单
            submitForm() {
                request[this.url](this.data).then(res => {
                    this.$message.success(res.msg);
                    this.$router.push('/showValueList');
                }).catch(err => {
                    console.log(err);
                });
            },
            // 获取信息
            getInfo() {
                if (this.id === undefined || this.id === '') {
                    this.nav[2] = '新建利润分配模板';
                    this.form.id = '';
                    this.url = 'addShowValBeanTemplate';
                } else {
                    this.nav[2] = '编辑利润分配模板';
                    this.url = 'updateProfitTemplateById';
                    this.form.id = this.id;
                    this.pageLoading = true;
                    request.queryProfitTemplateById({ id: this.id }).then(res => {
                        this.pageLoading = false;
                        this.form.name = res.data.name;
                        this.form.source = res.data.source;
                        this.form.valueRate = Number(res.data.valueRate);
                        this.isSetTime = !res.data.startTime;
                        this.form.startTime = res.data.activeTime || '';
                        this.form.endTime = res.data.stopTime || '';
                        res.data.showValueList.forEach((v, k) => {
                            this.$refs['showValue'].userLevel.forEach((v1, k1) => {
                                if (v.type == 'X') {
                                    if (v.shareType == 1) {
                                        v1.valueX[0] = v[`v${k1}`];
                                    } else if (v.shareType == 2) {
                                        v1.valueX[1] = v[`v${k1}`];
                                    } else {
                                        v1.valueX[2] = v[`v${k1}`];
                                    }
                                } else if (v.type == 'Y') {
                                    if (v.shareType == 1) {
                                        v1.valueY[0] = v[`v${k1}`];
                                    } else if (v.shareType == 2) {
                                        v1.valueY[1] = v[`v${k1}`];
                                    } else {
                                        v1.valueY[2] = v[`v${k1}`];
                                    }
                                } else {
                                    if (v.shareType == 1) {
                                        v1.valueZ[0] = v[`v${k1}`];
                                    } else if (v.shareType == 2) {
                                        v1.valueZ[1] = v[`v${k1}`];
                                    } else {
                                        v1.valueZ[2] = v[`v${k1}`];
                                    }
                                }
                                this.$set(this.$refs['showValue'].userLevel, k1, this.$refs['showValue'].userLevel[k1]);
                            });
                        });
                        res.data.showPeasList.forEach((v, k) => {
                            this.$refs['showBean'].userLevel.forEach((v1, k1) => {
                                if (v.type == 'X') {
                                    if (v.shareType == 1) {
                                        v1.valueX[0] = v[`v${k1}`];
                                    } else if (v.shareType == 2) {
                                        v1.valueX[1] = v[`v${k1}`];
                                    } else {
                                        v1.valueX[2] = v[`v${k1}`];
                                    }
                                } else if (v.type == 'Y') {
                                    if (v.shareType == 1) {
                                        v1.valueY[0] = v[`v${k1}`];
                                    } else if (v.shareType == 2) {
                                        v1.valueY[1] = v[`v${k1}`];
                                    } else {
                                        v1.valueY[2] = v[`v${k1}`];
                                    }
                                } else {
                                    if (v.shareType == 1) {
                                        v1.valueZ[0] = v[`v${k1}`];
                                    } else if (v.shareType == 2) {
                                        v1.valueZ[1] = v[`v${k1}`];
                                    } else {
                                        v1.valueZ[2] = v[`v${k1}`];
                                    }
                                }
                                this.$set(this.$refs['showBean'].userLevel, k1, this.$refs['showBean'].userLevel[k1]);
                            });
                        });
                    }).catch(err => {
                        this.pageLoading = false;
                        console.log(err);
                    });
                }
            },
            // 保留小数
            toFixed() {
                this.form.valueRate = this.form.valueRate ? this.form.valueRate : 0;
                this.form.valueRate = this.form.valueRate.toFixed(2);
            },
            // 计算秀豆占比
            computedShowBean(val) {
                this.form.showPeas = (100 - val).toFixed(2);
            },
            // 切换秀值秀豆
            toggleShowModle(val) {
                this.active = val;
            },
            // 禁用/启用时间
            changeTimeStatus(val) {
                if (!val) {
                    this.form.startTime = '';
                    this.form.endTime = '';
                }
            }
        }
    };
</script>

<style lang="less" scoped>
.show-value-set{
    .option{
        display: flex;
        justify-content: center;
        flex-direction: column;
        width: 585px;
        height: 105px;
        background-color: #f7f7f7;
        margin-bottom: 10px;
        font-size: 14px;
        padding: 0 20px;
        box-sizing: border-box;
        & div{
            line-height: 42px;
        }
    }
    .btn-group{
        width: 340px;
        height: 50px;
        .btn-active{
            width: 50%;
            height: 50px;
            background-color: #33b4ff;
            color: white;
        }
        .btn-def{
            width: 50%;
            height: 50px;
            color: #33b4ff;
        }
    }
    .time{
        margin: 20px 0;
        & span{
            font-size: 14px;
        }
    }
    .inp{
        width: 210px;
    }
}
</style>
